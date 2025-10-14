using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Dtos;
using GreenZone.Contracts.Dtos.ProductDtos;
using GreenZone.Domain.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GreenZone.API.Controllers.AdminPanel
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminProductController : ControllerBase
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IProductService _productService;
        public AdminProductController(IProductService productService, IWebHostEnvironment webHostEnvironment)
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
        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] ProductCreateDto productCreateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var createdProduct = await _productService.AddAsync(productCreateDto);
            return CreatedAtAction(nameof(GetProductById), new { id = createdProduct.Id }, createdProduct);
        }
        [HttpPut("{id}")]

        public async Task<IActionResult> UpdateProduct(Guid id, [FromBody] ProductUpdateDto productUpdateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var updatedProduct = await _productService.UpdateAsync(id, productUpdateDto);
            if (updatedProduct == null)
            {
                return NotFound();
            }
            return Ok(updatedProduct);
        }
        [HttpDelete("{id}")]

        public async Task<IActionResult> DeleteProduct(Guid id)
        {
            var deleted = await _productService.DeleteAsync(id);
            if (!deleted)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpPost("upload-image/{id}")]

        public async Task<IActionResult> UploadImage(Guid id, [FromForm] FileUploadDto image)
        {
            if (image == null || image.Image.Length == 0)
            {
                return BadRequest("No image file provided");
            }
            var folder = _webHostEnvironment.WebRootPath + "/images";
            if (!Directory.Exists(folder))
            {
                Directory.CreateDirectory(folder);
            }
            var fileName = $"image{Guid.NewGuid().ToString()}_{image.Image.FileName}";
            var filePath = Path.Combine(folder, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.Image.CopyToAsync(stream);
            }
            var isUploaded = await _productService.UploadImageAsync(id, fileName);

            if (isUploaded == null)
            {
                return NotFound("Product not found");
            }
            return Ok();
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
        [HttpPost("upload-documents/{id}")]

        public async Task<IActionResult> UploadDocuments(Guid id, [FromBody] List<ProductDocuments> documents)
        {

            var productDocuments = documents.Select(d => new ProductDocuments
            {
                DocumentUrl = d.DocumentUrl
            }).ToList();
            var updatedProduct = await _productService.UploadDocuments(id, productDocuments);
            if (updatedProduct == null)
            {
                return NotFound("Product not found");
            }
            return Ok(updatedProduct);
        }

    }
}
