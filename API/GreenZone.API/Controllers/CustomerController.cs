using GreenZone.Application.Service;
using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Dtos.CustomerDtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GreenZone.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
   [Authorize("Admin")]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _customerService;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public CustomerController(ICustomerService customerService, IWebHostEnvironment webHostEnvironment)
        {
            _customerService = customerService;
            _webHostEnvironment = webHostEnvironment;
        }
      
       
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer(Guid id, [FromBody] CustomerUpdateDto customerUpdateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var updatedCustomer = await _customerService.UpdateAsync(id, customerUpdateDto);
            if (updatedCustomer == null)
            {
                return NotFound();
            }
            return Ok(updatedCustomer);
        }
    
       
    }
}
