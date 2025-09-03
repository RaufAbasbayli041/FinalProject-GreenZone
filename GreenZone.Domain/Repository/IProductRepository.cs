using GreenZone.Domain.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Domain.Repository
{
    public interface IProductRepository : IGenericRepository<Product>
    {
        Task<Product> UploadImageAsync(Guid id, string imagePath);
        Task<IEnumerable<Product>> GetProductsByCategoryAsync(Guid categoryId, int pages , int pageSize);
        Task<IEnumerable<Product>> SearchProductsAsync(string keyword, int page, int pageSize);
        Task<Product> GetProductWithDocumentsAsync(Guid id);  


    }
}
