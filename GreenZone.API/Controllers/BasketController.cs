using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Dtos.BasketDtos;
using GreenZone.Contracts.Dtos.BasketItemsDtos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GreenZone.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BasketController : ControllerBase
    {
        private readonly IBasketService _basketService;
        public BasketController(IBasketService basketService)
        {
            _basketService = basketService;
        }
        [HttpGet("{customerId}")]
        public async Task<IActionResult> GetBasketByCustomerId(Guid customerId)
        {
            var basket = await _basketService.GetBasketByCustomerAsync(customerId);
            
            return Ok(basket);
        }
       
        [HttpPost("{customerId}/items")]
        public async Task<IActionResult> AddItemsToBasket(BasketItemsCreateDto basketItemsCreateDto)
        {
            await _basketService.AddItemstoBasketAsync(basketItemsCreateDto);
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
        public async Task<IActionResult> UpdateItemsInBasket(BasketItemsUpdateDto basketItemsUpdateDto)
        {
            await _basketService.UpdateItemsInBasketAsync(basketItemsUpdateDto);
            return NoContent();
		}


	}
}
