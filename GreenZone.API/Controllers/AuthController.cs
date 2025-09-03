using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Dtos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GreenZone.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }
        [HttpPost("login")]

        public async Task<IActionResult> Login([FromBody] LogInDto logInDto)
        {
            if (logInDto == null)
            {
                return BadRequest("Invalid login request");
            }
            var result = await _authService.LogInAsync(logInDto);

            if (!result.Succeeded)
            {
                return Unauthorized("Invalid username or password.");
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

    }
}
