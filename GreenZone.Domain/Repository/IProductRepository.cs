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
        Task<Product> UploadImagesAsync(Guid id, string imagePath);
        Task<IEnumerable<Product>> GetProductsByCategoryAsync(Guid categoryId, int pages = 1, int pageSize = 10);
        Task<IEnumerable<Product>> SearchProductsAsync(string keyword, int page = 1, int pageSize = 10);
        Task<Product> GetProductWithDocumentsAsync(Guid id);


    }
}
