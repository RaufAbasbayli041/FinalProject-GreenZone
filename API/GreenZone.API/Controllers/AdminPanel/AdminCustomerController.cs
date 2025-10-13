using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Dtos.CustomerDtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GreenZone.API.Controllers.AdminPanel
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminCustomerController : ControllerBase
    {

        private readonly ICustomerService _customerService;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public AdminCustomerController(ICustomerService customerService, IWebHostEnvironment webHostEnvironment)
        {
            _customerService = customerService;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCustomers()
        {
            var customers = await _customerService.GetAllAsync();
            return Ok(customers);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCustomerById(Guid id)
        {
            var customer = await _customerService.GetByIdAsync(id);
            if (customer == null)
            {
                return NotFound();
            }
            return Ok(customer);
        } 

        [HttpGet("with-orders")]
        public async Task<IActionResult> GetAllCustomersWithOrders(int page, int pageSize)
        {
            var customers = await _customerService.GetAllCustomersWithOrdersAsync(page, pageSize);
            return Ok(customers);
        }
        [HttpGet("full-data/{customerId}")]
        public async Task<IActionResult> GetCustomerFullData(Guid customerId)
        {
            var customer = await _customerService.GetCustomerFullDataAsync(customerId);
            if (customer == null)
            {
                return NotFound();
            }
            return Ok(customer);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(Guid id)
        {
            var customer = await _customerService.GetByIdAsync(id);
            if (customer == null)
            {
                return NotFound();
            }
            await _customerService.DeleteAsync(id);
            return NoContent();
        }
    }
}
