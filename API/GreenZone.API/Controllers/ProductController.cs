using GreenZone.Application.Service;
using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Dtos;
using GreenZone.Contracts.Dtos.ProductDtos;
using GreenZone.Domain.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GreenZone.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController] 

    public class ProductController : ControllerBase
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IProductService _productService;
        public ProductController(IProductService productService, IWebHostEnvironment webHostEnvironment)
        {
            _productService = productService;
            _webHostEnvironment = webHostEnvironment;
        }
        [HttpGet]

        [AllowAnonymous]
        public async Task<IActionResult> GetAllProducts()
        {
            var products = await _productService.GetAllAsync();
            return Ok(products);
        }
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetProductById(Guid id)
        {
            var product = await _productService.GetByIdAsync(id);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchProducts([FromQuery] string keyword, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            if (string.IsNullOrEmpty(keyword))
            {
                return BadRequest("Keyword cannot be null or empty");
            }
            var products = await _productService.SearchProductsAsync(keyword, page, pageSize);
            return Ok(products);
        }
        [HttpGet("by-category/{categoryId}")]
        public async Task<IActionResult> GetProductsByCategory(Guid categoryId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var products = await _productService.GetProductsByCategoryAsync(categoryId, page, pageSize);
            return Ok(products);
        }

    }
}
