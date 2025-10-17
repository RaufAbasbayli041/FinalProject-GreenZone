using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Dtos.DeliveryDtos;
using GreenZone.Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GreenZone.API.Controllers.AdminPanel
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminDeliveryController : ControllerBase
    {
        private readonly IDeliveryService _deliveryService;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public AdminDeliveryController(IDeliveryService deliveryService, IWebHostEnvironment webHostEnvironment)
        {
            _deliveryService = deliveryService;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DeliveryReadDto>>> GetAll()
        {
            var deliveries = await _deliveryService.GetAllAsync();
            return Ok(deliveries);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DeliveryReadDto>> GetById(Guid id)
        {
            var delivery = await _deliveryService.GetByIdAsync(id);
            if (delivery == null) return NotFound();
            return Ok(delivery);
        }

        [HttpPost]
        public async Task<ActionResult<DeliveryReadDto>> Create([FromBody] DeliveryCreateDto dto)
        {
            var createdDelivery = await _deliveryService.AddAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = createdDelivery.Id }, createdDelivery);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<DeliveryReadDto>> Update(Guid id, [FromBody] DeliveryUpdateDto dto)
        {
            var updatedDelivery = await _deliveryService.UpdateAsync(id, dto);
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

        [HttpPatch("{id}/status")]
        public async Task<ActionResult> ChangeStatus(Guid id, [FromBody] DeliveryStatusType status)
        {
            var delivery = await _deliveryService.ChangeDeliveryStatusAsync(id, status);
            if (delivery == null) return NotFound();
            return Ok(delivery);
        }
        [HttpGet("status/{status}")]
        public async Task<ActionResult<IEnumerable<DeliveryReadDto>>> GetByStatus(DeliveryStatusType status)
        {
            var deliveries = await _deliveryService.GetAllDeliveriesByStatusAsync(status);
            return Ok(deliveries);
        }

        [HttpGet("status/first/{status}")]
        public async Task<ActionResult<DeliveryReadDto>> GetFirstByStatus(DeliveryStatusType status)
        {
            var delivery = await _deliveryService.GetDeliveryByStatusAsync(status);
            if (delivery == null) return NotFound();
            return Ok(delivery);
        }

        [HttpGet("customer/{customerId}")]
        public async Task<ActionResult<IEnumerable<DeliveryReadDto>>> GetDeliveriesByCustomerId(Guid customerId)
        {
            var deliveries = await _deliveryService.GetDeliveriesByCustomerIdAsync(customerId);
            return Ok(deliveries);
        }
    }
}
