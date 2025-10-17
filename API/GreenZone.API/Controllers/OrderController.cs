using GreenZone.Application.Service;
using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Dtos.OrderDtos;
using GreenZone.Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GreenZone.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Customer")]

    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly ILogger<OrderController> _logger;
        private readonly IWebHostEnvironment _webHostEnvironment;


        public OrderController(IOrderService orderService, ILogger<OrderController> logger, IWebHostEnvironment webHostEnvironment)
        {
            _orderService = orderService;
            _logger = logger;
            _webHostEnvironment = webHostEnvironment;
        }
        
        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetOrdersByCustomerId(Guid customerId)
        {
            var orders = await _orderService.GetOrdersByCustomerIdAsync(customerId);
           _logger.LogInformation("Retrieved orders for customer {CustomerId}", customerId);
            return Ok(orders);
        }


        [HttpGet("by-status/{orderStatusId}")]
        public async Task<IActionResult> GetByOrderStatusId(Guid? orderStatusId, string? keyword, int page = 1, int pageSize = 10)
        {
            var orders = await _orderService.GetOrdersByOrderStatusIdAsync(orderStatusId, keyword, page, pageSize);
           _logger.LogInformation("Retrieved orders with status {OrderStatusId}", orderStatusId);
            return Ok(orders);
        }

        [HttpGet("details/{id}")]
        public async Task<IActionResult> GetByIdAsync(Guid id)
        {
            var order = await _orderService.GetOrderWithDetailsAsync(id);
            if (order == null)
            {
                _logger.LogWarning("Order {OrderId} not found", id);
                return NotFound();
            }
            return Ok(order);
        }



        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] OrderUpdateDto orderUpdateDto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid model state when updating order {OrderId}", id);
                return BadRequest(ModelState);
            }

            var updatedOrder = await _orderService.UpdateAsync(id, orderUpdateDto);
            if (updatedOrder == null)
            {
                _logger.LogWarning("Order {OrderId} not found for update", id);
                return NotFound();
            }

            _logger.LogInformation("Order {OrderId} updated successfully", id);
            return Ok(updatedOrder);
        }

        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelOrder(Guid id)
        {
            var order = await _orderService.CancelOrderAsync(id);
            return Ok(order);
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderCreateDto orderCreateDto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid model state when creating order");
                return BadRequest(ModelState);
            }
            var createdOrder = await _orderService.CreateOrderByCustomerIdAsync(orderCreateDto);
            _logger.LogInformation("Order {OrderId} created successfully", createdOrder.Id);
            return CreatedAtAction(nameof(GetByIdAsync), new { id = createdOrder.Id }, createdOrder);
        }
    }
}
