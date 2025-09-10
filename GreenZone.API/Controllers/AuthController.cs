using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Dtos;
using GreenZone.Domain.Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace GreenZone.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly UserManager<ApplicationUser> _userManager;

        public AuthController(IAuthService authService, UserManager<ApplicationUser> userManager)
        {
            _authService = authService;
            _userManager = userManager;
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
			return Ok(result);


        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            if (registerDto == null)
            {
                return BadRequest("Invalid register request");
            }
            if (registerDto.Password != registerDto.ConfirmPassword)
            {
                return BadRequest("Password and Confirm Password do not match.");
            }
            var result = await _authService.RegisterAsync(registerDto);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }
            return Ok(result);
        }
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            // Implement logout logic if needed, e.g., invalidate tokens or clear cookies
            return Ok("User logged out successfully.");
        }
        [HttpGet("confirm-email")]

        public async Task<IActionResult> ConfirmEmail(string userId, string token)
        {
            if (userId == null || token == null) return BadRequest("Invalid email confirmation request.");

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound("User not found.");

            var result = await _userManager.ConfirmEmailAsync(user, token);

            if (result.Succeeded) return Redirect("https://localhost:5173/email-confirmed");

            return BadRequest("Email confirmation failed.");
        }

    }
}
