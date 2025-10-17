using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Dtos.OrderDtos;
using GreenZone.Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace GreenZone.API.Controllers.AdminPanel
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminOrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly ILogger<OrderController> _logger;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public AdminOrderController(IOrderService orderService, ILogger<OrderController> logger, IWebHostEnvironment webHostEnvironment)
        {
            _orderService = orderService;
            _logger = logger;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _orderService.GetAllOrdersFullData();
         _logger.LogInformation("Retrieved {Count} orders", orders.Count());
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderByIdAsync(Guid id)
        {
            var order = await _orderService.GetOrderWithDetailsAsync(id);
            if (order == null)
            {
                _logger.LogWarning("Order {OrderId} not found", id);
                return NotFound();
            }
            return Ok(order);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] OrderCreateDto orderCreateDto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid model state for creating order");
                return BadRequest(ModelState);
            }

            var createdOrder = await _orderService.AddAsync(orderCreateDto);

            _logger.LogInformation(
                "Order {OrderId} created for Customer {CustomerId} with ShippingAddress: {ShippingAddress} on {Date}",
                createdOrder.Id,
                createdOrder.CustomerId,
                createdOrder.ShippingAddress,
                createdOrder.OrderDate
            );

            return CreatedAtAction(nameof(GetOrderByIdAsync), new { id = createdOrder.Id }, createdOrder);
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _orderService.DeleteAsync(id);
            if (!result)
            {
                _logger.LogWarning("Order {OrderId} not found for deletion", id);
                return NotFound();
            }

            _logger.LogInformation("Order {OrderId} deleted successfully", id);
            return NoContent();
        }

        [HttpGet("by-customer/{customerId}")]
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
          _logger.LogInformation("Retrieved {Count} orders with status {OrderStatusId}", orders.Count(), orderStatusId);
            return Ok(orders);
        }
        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelOrder(Guid id)
        {
            var order = await _orderService.CancelOrderAsync(id);
            return Ok(order);
        }

        // order change methods
        [HttpPut("{id}/deliver")]
        public async Task<IActionResult> MarkAsDelivered(Guid id)
        {
            var order = await _orderService.MarkAsDeliveredAsync(id);
            return Ok(order);
        }

        [HttpPut("{id}/processing")]
        public async Task<IActionResult> MarkAsProcessing(Guid id)
        {
            var order = await _orderService.MarkAsProcessingAsync(id);
            return Ok(order);
        }

        [HttpPut("{id}/returned")]
        public async Task<IActionResult> MarkAsReturned(Guid id)
        {
            var order = await _orderService.MarkAsReturnedAsync(id);
            return Ok(order);
        }


        [HttpPut("{id}/set-status/{orderStatusId}")]
        public async Task<IActionResult> ChangeOrderStatus(Guid id, OrderStatusName orderStatusName)
        {
            var order = await _orderService.ChangeOrderStatusAsync(id, orderStatusName);
            return Ok(order);
        }

    }
}
