using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Dtos.DeliveryDtos;
using GreenZone.Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GreenZone.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize (Roles = "Customer")]
    public class DeliveryController : ControllerBase
    {
        private readonly IDeliveryService _deliveryService;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public DeliveryController(IDeliveryService deliveryService, IWebHostEnvironment webHostEnvironment)
        {
            _deliveryService = deliveryService;
            _webHostEnvironment = webHostEnvironment;
        }

      
        [HttpGet("{id}")]
        public async Task<ActionResult<DeliveryReadDto>> GetById(Guid id)
        {
            var delivery = await _deliveryService.GetByIdAsync(id);
            if (delivery == null) return NotFound();
            return Ok(delivery);
        }

       
        [HttpPut("{id}")]
        public async Task<ActionResult<DeliveryReadDto>> Update(Guid id, [FromBody] DeliveryUpdateDto dto)
        {
            var updatedDelivery = await _deliveryService.ChangeDeliveryStatusAsync(id, dto.DeliveryStatus);
            if (updatedDelivery == null) return NotFound();
            return Ok(updatedDelivery);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            var deleted = await _deliveryService.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }

        
    }
}
