using GreenZone.Application.Service;
using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Dtos.OrderDtos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GreenZone.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly ILogger<OrderService> _logger;

        public OrderController(IOrderService orderService, IWebHostEnvironment webHostEnvironment)
        {
            _orderService = orderService;
            _webHostEnvironment = webHostEnvironment;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _orderService.GetAllOrdersFullData();
            return Ok(orders);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var order = await _orderService.GetOrderWithDetailsAsync(id);
            if (order == null)
            {
                return NotFound();
            }
            return Ok(order);
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] OrderCreateDto orderCreateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var createdOrder = await _orderService.AddAsync(orderCreateDto);
            _logger.LogInformation($"Order created date:{createdOrder.OrderDate}" +
                                    $"Customer Id:{createdOrder.CustomerId}" + 
                                    $"Adress: {createdOrder.ShippingAddress} ");



            return CreatedAtAction(nameof(GetById), new { id = createdOrder.Id }, createdOrder);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] OrderUpdateDto orderUpdateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var updatedOrder = await _orderService.UpdateAsync(id, orderUpdateDto);
            if (updatedOrder == null)
            {
                return NotFound();
            }
            return Ok(updatedOrder);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _orderService.DeleteAsync(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }
        [HttpGet("by-status/{orderStatusId}")]
        public async Task<IActionResult> GetByOrderStatusId(Guid? orderStatusId, string? keyword, int page = 1, int pageSize = 10)
        {
            var orders = await _orderService.GetOrdersByOrderStatusIdAsync(orderStatusId, keyword, page, pageSize);
            return Ok(orders);
        }

    }
}
