using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Dtos;
using GreenZone.Contracts.Dtos.CustomerDtos;
using GreenZone.Domain.Entity;
using GreenZone.Domain.Repository;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Application.Service
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ICustomerRepository _customerRepository;

        public AuthService(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager,   ICustomerRepository customerRepository)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _customerRepository = customerRepository;
        }

        public async Task<IdentityResult> LogInAsync(LogInDto logInDto)
        {
            if (logInDto == null)
            {
                throw new ArgumentNullException(nameof(logInDto));
            }
            var user = await _userManager.FindByEmailAsync(logInDto.Email);
            if (user == null)
            {
                return IdentityResult.Failed(new IdentityError { Description = "User not found." });
            }

            var result = await _signInManager.PasswordSignInAsync(user, logInDto.Password, isPersistent: true,  lockoutOnFailure: false);


            if (result.Succeeded)
            {
                return IdentityResult.Success;
            }
            else
            {
                return IdentityResult.Failed(new IdentityError { Description = "Invalid email or password." });
            }
        }

        public async Task<IdentityResult> RegisterAsync(RegisterDto registerDto)
        {
            if (await _userManager.FindByEmailAsync(registerDto.Email) != null)
            {
                return IdentityResult.Failed(new IdentityError { Description = "Email already in use." });
            }
            var user = new ApplicationUser
            {
                UserName = registerDto.UserName,
                Email = registerDto.Email,
                PhoneNumber = registerDto.PhoneNumber,
                FirstName= registerDto.FirstName,
                LastName= registerDto.LastName
            };
            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                return IdentityResult.Failed(result.Errors.ToArray());
            }

            await _userManager.AddToRoleAsync(user, "Customer");
            var customer = new Customer
            {
                UserId = user.Id,
              IdentityCard = registerDto.IdentityCard,               
            };
            
            await _customerRepository.AddAsync(customer);
            return IdentityResult.Success;

        }
    }
}
