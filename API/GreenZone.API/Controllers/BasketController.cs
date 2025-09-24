using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Dtos.BasketDtos;
using GreenZone.Contracts.Dtos.BasketItemsDtos;
using GreenZone.Domain.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GreenZone.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class BasketController : ControllerBase
    {
        private readonly IBasketService _basketService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public BasketController(IBasketService basketService, IWebHostEnvironment webHostEnvironment)
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
       
        [HttpPost("{customerId}/items")]
        public async Task<IActionResult> AddItemsToBasket(Guid customerId, BasketItemsCreateDto basketItemsCreateDto)
        {
            await _basketService.AddItemstoBasketAsync(customerId, basketItemsCreateDto);
            return NoContent();
        }
        [HttpDelete("{customerId}/items")]
        public async Task<IActionResult> RemoveItemsFromBasket(Guid customerId, [FromQuery] Guid productId, [FromQuery] int quantity)
        {
            await _basketService.RemoveItemsFromBasketAsync(customerId, productId, quantity);
            return NoContent();
        }
        [HttpDelete("{customerId}")]
        public async Task<IActionResult> ClearBasket(Guid customerId)
        {
            await _basketService.ClearBasketAsync(customerId);
            return NoContent();
        }
       [HttpPut("items")]
       public async Task<IActionResult> UpdateItemsInBasket(Guid customerId, BasketItemsUpdateDto basketItemsUpdateDto)
        {
            await _basketService.UpdateItemsInBasketAsync(customerId, basketItemsUpdateDto);
            return NoContent();
		}

	}
}
