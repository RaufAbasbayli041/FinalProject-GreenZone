using GreenZone.Application.Exceptions;
using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Dtos;
using GreenZone.Contracts.Dtos.CustomerDtos;
using GreenZone.Domain.Entity;
using GreenZone.Domain.Repository;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Runtime.ConstrainedExecution;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Application.Service
{
	public class AuthService : IAuthService
	{
		protected readonly UserManager<ApplicationUser> _userManager;
		protected readonly SignInManager<ApplicationUser> _signInManager;
		private readonly ICustomerRepository _customerRepository;
		private readonly IEmailSenderOpt _emailSenderOpt;
		private readonly ILogger<AuthService> _logger;
		private readonly IBasketRepository _basketRepository;
		private readonly IUnitOfWork _unitOfWork;
		private readonly IConfiguration _configuration;

		public AuthService(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, ICustomerRepository customerRepository, IEmailSenderOpt emailSenderOpt, ILogger<AuthService> logger, IBasketRepository basketRepository, IUnitOfWork unitOfWork, IConfiguration configuration)
		{
			_userManager = userManager;
			_signInManager = signInManager;
			_customerRepository = customerRepository;
			_emailSenderOpt = emailSenderOpt;
			_logger = logger;
			_basketRepository = basketRepository;
			_unitOfWork = unitOfWork;
			_configuration = configuration;
		}

		public async Task<AuthResultDto?> LogInAsync(LogInDto logInDto)
		{
			if (logInDto == null)
			{
				throw new ArgumentNullException(nameof(logInDto));
			}
			var user = await _userManager.FindByNameAsync(logInDto.UserName);
			if (user == null)
			{
				_logger.LogWarning("Login failed: user {UserName} not found.", logInDto.UserName);
				throw new UnAuthorizedException("Invalid username or password.");
			}

			user = await _userManager.FindByIdAsync(user.Id);

			if (!user.EmailConfirmed)
			{
				throw new UnAuthorizedException("Please confirm your email.");
			}
			var result = await _signInManager.CheckPasswordSignInAsync(user, logInDto.Password, lockoutOnFailure: false);
			if (!result.Succeeded)
			{
				_logger.LogWarning("Invalid login attempt for user {UserName}.", logInDto.UserName);
				throw new UnAuthorizedException("Invalid username or password.");
			}
			_logger.LogInformation("User {UserName} logged in successfully.", logInDto.UserName);

			var roles = await _userManager.GetRolesAsync(user);
			var token = GenerateJwtToken(user, roles);
			var expiresInMinutes = Convert.ToDouble(_configuration["Jwt:ExpiresInMinutes"]);

			if (roles.Contains("Customer"))
			{
				var customer = await _customerRepository.GetCustomerByUserIdAsync(user.Id);
				if (customer == null)
				{
					_logger.LogError("Customer not found for user {UserName} (userId: {UserId})", user.UserName, user.Id);
					throw new NotFoundException("Customer not found for this user.");
				}
				return new AuthResultDto
				{
					Token = token,
					Expiration = DateTime.UtcNow.AddMinutes(expiresInMinutes),// Token expiration time
					CustomerId = customer.Id,
					Role = "Customer"


                };

			}

			if (roles.Contains("Admin"))
			{
				return new AuthResultDto
				{
					Token = token,
					Expiration = DateTime.UtcNow.AddMinutes(expiresInMinutes),// Token expiration time
					CustomerId = Guid.Empty, // Admins do not have a CustomerId
					Role = "Admin"
				};
			}

			_logger.LogWarning("User {UserName} has no recognized roles.", user.UserName);
			throw new UnAuthorizedException("User has no valid roles.");
		}

		public Task LogOutAsync()
		{
			return _signInManager.SignOutAsync();
		}

		public async Task<IdentityResult> RegisterAsync(RegisterDto registerDto)
		{
			if (registerDto is null)
			{
				throw new NotNullException(nameof(registerDto));
			}

			var user = new ApplicationUser
			{
				UserName = registerDto.UserName,
				Email = registerDto.Email,
				PhoneNumber = registerDto.PhoneNumber,
				FirstName = registerDto.FirstName,
				LastName = registerDto.LastName
			};
			var result = await _userManager.CreateAsync(user, registerDto.Password);

			if (!result.Succeeded)
			{
				return IdentityResult.Failed(result.Errors.ToArray());
			}
			var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
			// Here you would typically send the token via email to the user for confirmation.
			if (token == null)
			{
				return IdentityResult.Failed(new IdentityError { Description = "Token generation failed." });
			}
			var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
			var confirmationLink = $"https://localhost:7100/api/auth/confirm-email?userId={user.Id}&code={encodedToken}";

			// You can use an email service to send the confirmation link to the user's email address.
			await _emailSenderOpt.SendEmailAsync(user.Email, "Confirm your email", $"Please confirm your account by clicking this link: <a href='{confirmationLink}'>Confirm mail</a>");

			await _userManager.AddToRoleAsync(user, "Customer");
			var customer = new Customer
			{
				UserId = user.Id,
				IdentityCard = registerDto.IdentityCard,

			};
			await _customerRepository.AddAsync(customer);
			await _unitOfWork.SaveChangesAsync();
			var Basket = new Basket()
			{
				Id = Guid.NewGuid(),
				BasketItems = new List<BasketItems>(),
				Customer = customer,

			};
			await _basketRepository.AddAsync(Basket);
			await _unitOfWork.SaveChangesAsync();


			customer.Basket = Basket;

			await _unitOfWork.SaveChangesAsync();
			return IdentityResult.Success;

		}

		private string GenerateJwtToken(ApplicationUser user, IList<string> roles)
		{
			var jwtSection = _configuration.GetSection("Jwt");

			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSection["Key"]!));
			var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

			var claims = new List<Claim>
			{
				new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
				new Claim(JwtRegisteredClaimNames.Email, user.Email),
				new Claim(ClaimTypes.NameIdentifier, user.UserName)

				};

			foreach (var role in roles)
			{
				claims.Add(new Claim(ClaimTypes.Role, role));

			}

			var token = new JwtSecurityToken(
				issuer: jwtSection["Issuer"],
				audience: jwtSection["Audience"],
				claims: claims,
				expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(jwtSection["ExpiresInMinutes"])),
				signingCredentials: creds);

			return new JwtSecurityTokenHandler().WriteToken(token);
		}

		public async Task<bool> ConfirmEmailAsync(string userId, string code)
		{
			var user = await _userManager.FindByIdAsync(userId);
			if (user == null) return false;

			var decodedCode = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(code));
			var result = await _userManager.ConfirmEmailAsync(user, decodedCode);

			if (result.Succeeded)
			{
				await _userManager.UpdateAsync(user);
				return true;
			}
			return false;
		}

	}
}
