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
        Task<ProductReadDto> UploadImageAsync(Guid id, string imagePath);
        Task<IEnumerable<ProductReadDto>> GetProductsByCategoryAsync(Guid categoryId, int pages, int pageSize );
        Task<IEnumerable<ProductReadDto>> SearchProductsAsync(string keyword, int page , int pageSize ); 
        Task<ProductReadDto> UploadDocuments(Guid id, List<ProductDocuments> documents);
    }
}