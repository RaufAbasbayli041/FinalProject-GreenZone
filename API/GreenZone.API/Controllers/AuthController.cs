using GreenZone.Application.Exceptions;
using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Dtos;
using GreenZone.Domain.Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;

namespace GreenZone.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<AuthController> _logger;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public AuthController(IAuthService authService, UserManager<ApplicationUser> userManager, ILogger<AuthController> logger, IWebHostEnvironment webHostEnvironment)
        {
            _authService = authService;
            _userManager = userManager;
            _logger = logger;
            _webHostEnvironment = webHostEnvironment;
        }
        [HttpPost("login")]

        public async Task<IActionResult> Login([FromBody] LogInDto logInDto)
        {
            if (logInDto == null)
            {
                return BadRequest("Invalid login request");
            }

            var result = await _authService.LogInAsync(logInDto);

            if (result == null)
            {
                return Unauthorized("Invalid email or password, or email not confirmed.");
			}
            _logger.LogInformation($"{logInDto.UserName} logIn ");
			return Ok(result);


        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
          
            var result = await _authService.RegisterAsync(registerDto);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }
            _logger.LogInformation($"{registerDto.UserName} registered");
            return Ok(result);
        }
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        { 
            await _authService.LogOutAsync();
            return Ok("User logged out successfully.");
        }
       

    }
}
