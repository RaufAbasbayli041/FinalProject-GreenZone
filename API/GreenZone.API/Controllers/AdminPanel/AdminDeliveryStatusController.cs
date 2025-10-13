using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Dtos.DeliveryStatusDtos;
using GreenZone.Contracts.Service;
using GreenZone.Domain.Entity;
using GreenZone.Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GreenZone.API.Controllers.AdminPanel
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminDeliveryStatusController : ControllerBase
    {
        private readonly IDeliveryStatusService _service;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public AdminDeliveryStatusController(IDeliveryStatusService service, IWebHostEnvironment webHostEnvironment)
        {
            _service = service;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DeliveryStatusReadDto>>> GetAll()
        {
            var statuses = await _service.GetAllAsync();
            return Ok(statuses);
        }

        [HttpGet("{statusType}")]
        public async Task<ActionResult<DeliveryStatusReadDto>> GetByType(DeliveryStatusType statusType)
        {
            var status = await _service.GetDeliveryStatusByTypeAsync(statusType);
             
            return Ok(status);
        }




    }
}
