using GreenZone.Contracts.Dtos.ProductDtos;
using GreenZone.Contracts.Service;
using GreenZone.Domain.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Contracts.Contracts
{
    public interface IProductService : IGenericService<Product, ProductCreateDto, ProductReadDto, ProductUpdateDto>
    {        
        Task<ProductReadDto> UploadImagesAsync(Guid id, string imagePath);
        Task<IEnumerable<ProductReadDto>> GetProductsByCategoryAsync(Guid categoryId, int pages = 1, int pageSize = 10);
        Task<IEnumerable<ProductReadDto>> SearchProductsAsync(string keyword, int page = 1, int pageSize = 10);
        Task<ProductReadDto> GetProductWithDocumentsAsync(Guid id);
    }
}