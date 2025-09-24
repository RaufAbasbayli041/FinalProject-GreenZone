using GreenZone.Application.Service;
using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Dtos.ProductDocumentsDto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GreenZone.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductDocumentsController : ControllerBase
    {
        private readonly IProductDocumentsService _productDocumentsService;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ProductDocumentsController(IProductDocumentsService productDocumentsService, IWebHostEnvironment webHostEnvironment)
        {
            _productDocumentsService = productDocumentsService;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProductDocuments()
        {
            var documents = await _productDocumentsService.GetAllAsync();
            return Ok(documents);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductDocumentById(Guid id)
        {
            var document = await _productDocumentsService.GetByIdAsync(id);
            if (document == null)
            {
                return NotFound();
            }
            return Ok(document);
        }
        [HttpPost]
        public async Task<IActionResult> CreateProductDocument([FromBody] ProductDocumentsCreateDto productDocumentsCreateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var createdDocument = await _productDocumentsService.AddAsync(productDocumentsCreateDto);
                return CreatedAtAction(nameof(GetProductDocumentById), new { id = createdDocument.Id }, createdDocument);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProductDocument(Guid id, [FromBody] ProductDocumentsUpdateDto productDocumentsUpdateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var updatedDocument = await _productDocumentsService.UpdateAsync(id, productDocumentsUpdateDto);
            if (updatedDocument == null)
            {
                return NotFound();
            }
            return Ok(updatedDocument);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductDocument(Guid id)
        {
            var result = await _productDocumentsService.DeleteAsync(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }


    }
}
