using GreenZone.Application.Service;
using GreenZone.Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GreenZone.API.Controllers.AdminPanel
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminOrderStatusController : ControllerBase
    {
        private readonly ILogger<AdminOrderStatusController> _logger;
        private readonly IOrderStatusService _orderStatusService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public AdminOrderStatusController(IOrderStatusService orderStatusService, ILogger<AdminOrderStatusController> logger, IWebHostEnvironment webHostEnvironment)
        {
            _orderStatusService = orderStatusService;
            _logger = logger;
            _webHostEnvironment = webHostEnvironment;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var statuses = await _orderStatusService.GetAllAsync();
            _logger.LogInformation("Retrieved {Count} order statuses", statuses.Count());
            return Ok(statuses);
        }
        [HttpGet("{name}")]
        public async Task<IActionResult> GetByName(OrderStatusName name)
        {
            var status = await _orderStatusService.GetOrderStatusByType(name);
            if (status == null)
            {
                _logger.LogWarning("Order status with name {StatusName} not found", name);
                return NotFound();
            }
            _logger.LogInformation("Retrieved order status: {StatusName}", name);
            return Ok(status);
        }
    }
}
