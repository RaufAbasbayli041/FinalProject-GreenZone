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

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrdersByCustomerIdAsync(Guid id)
        {
            var orders = await _orderService.GetOrdersByCustomerIdAsync(id);
            if (orders == null || !orders.Any())
            {
                _logger.LogWarning("Orders for Customer {CustomerId} not found", id);
                return NotFound();
            }
            return Ok(orders);
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
        public async Task<IActionResult> CreateOrder(Guid basketId,[FromBody] OrderCreateDto orderCreateDto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid model state when creating order");
                return BadRequest(ModelState);
            }
            var createdOrder = await _orderService.CreateOrderByBasketIdAsync(basketId, orderCreateDto);
            _logger.LogInformation("Order {OrderId} created successfully", createdOrder.Id);
            return CreatedAtAction(nameof(GetOrdersByCustomerIdAsync), new { id = createdOrder.CustomerId }, createdOrder);
        }
    }
}
