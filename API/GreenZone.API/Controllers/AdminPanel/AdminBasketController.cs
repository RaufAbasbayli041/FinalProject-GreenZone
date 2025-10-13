using GreenZone.Contracts.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GreenZone.API.Controllers.AdminPanel
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminBasketController : ControllerBase
    {
        private readonly IBasketService _basketService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public AdminBasketController(IBasketService basketService, IWebHostEnvironment webHostEnvironment)
        {
            _basketService = basketService;
            _webHostEnvironment = webHostEnvironment;
        }
        [HttpGet("{customerId}")]
        public async Task<IActionResult> GetBasketByCustomerId(Guid customerId)
        {
            var basket = await _basketService.GetBasketByCustomerAsync(customerId);
            return Ok(basket);
        }
    }
}
