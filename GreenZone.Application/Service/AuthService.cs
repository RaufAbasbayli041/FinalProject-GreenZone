using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using GreenZone.Application.Exceptions;
using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Dtos;
using GreenZone.Contracts.Dtos.CustomerDtos;
using GreenZone.Domain.Entity;
using GreenZone.Domain.Repository;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

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


        public AuthService(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, ICustomerRepository customerRepository, IEmailSenderOpt emailSenderOpt, ILogger<AuthService> logger, IBasketRepository basketRepository, IUnitOfWork unitOfWork)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _customerRepository = customerRepository;
            _emailSenderOpt = emailSenderOpt;
            _logger = logger;
            _basketRepository = basketRepository;
            _unitOfWork = unitOfWork;
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
                throw new ArgumentException(nameof(logInDto));
            }

            var result = await _signInManager.PasswordSignInAsync(user, logInDto.Password, isPersistent: true, lockoutOnFailure: false);

            if (!user.EmailConfirmed)
            {
                throw new UnAuthorizedException("Please confirm your email.");
            }
            if (result.Succeeded)
            {
                var roles = await _userManager.GetRolesAsync(user);
                var token = GenerateJwtTokenAsync(user, roles);

                _logger.LogInformation("User {UserName} logged in successfully.", logInDto.UserName);

                return new AuthResultDto
                {
                    Token = token,
                    Expiration = DateTime.UtcNow.AddMinutes(60) ,// Token expiration time
                    
                };
            }
            else
            {
                _logger.LogWarning("Invalid login attempt for user {UserName}.", logInDto.UserName);
                return null;
            }
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
            var confirmationLink = $"https://localhost:7100/api/auth/confirm-email?userId={user.Id}&token={encodedToken}";



            // You can use an email service to send the confirmation link to the user's email address.
            await _emailSenderOpt.SendEmailAsync(user.Email, "Confirm your email", $"Please confirm your account by clicking this link: <a href='{confirmationLink}'>Confirm mail</a>");


            await _userManager.AddToRoleAsync(user, "Customer");
            var customer = new Customer
            {
                UserId = user.Id,
                IdentityCard = registerDto.IdentityCard,
                Basket = new Basket()
                {
                    Id = Guid.NewGuid(),
					BasketItems = new List<BasketItems>()
				}
            };
            
            
            await _customerRepository.AddAsync(customer);
            await _unitOfWork.SaveChangesAsync();
            return IdentityResult.Success;

        }

        private string GenerateJwtTokenAsync(ApplicationUser user, IList<string> roles)
        {
            var jwtSettings = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .Build()
                .GetSection("Jwt");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Name, user.UserName)
                };

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(jwtSettings["ExpiresInMinutes"])),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


    }
}
