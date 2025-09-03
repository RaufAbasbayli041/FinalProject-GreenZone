using GreenZone.Domain.Entity;
using GreenZone.Domain.Repository;
using GreenZone.Persistance.Database;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Persistance.Repository
{
    public class ProductRepository : GenericRepository<Product>, IProductRepository
    {
        public ProductRepository(GreenZoneDBContext context) : base(context)
        {

        }

        public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(Guid categoryId, int pages, int pageSize)
        {
            var datas = await _context.Products
                        .Include(p => p.Category)
                        .Where(p => !p.IsDeleted && p.CategoryId == categoryId)
                       .Skip((pages - 1) * pageSize)
                          .Take(pageSize)
                        .AsNoTracking()
                        .ToListAsync();
            return datas;
        }

        public async Task<Product> GetProductWithDocumentsAsync(Guid id)
        {
            var datas = await _context.Products
                            .Include(p => p.Documents)
                            .AsNoTracking()
                            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);
            return datas;
        }

        public async Task<IEnumerable<Product>> SearchProductsAsync(string keyword, int pages, int pageSize)
        {
            var datas = await _context.Products
                       .Where(p => !p.IsDeleted && (p.Title.ToLower().Contains(keyword.ToLower())))
                       .Skip((pages - 1) * pageSize)
                       .Take(pageSize)
                       .AsNoTracking()
                       .ToListAsync();
            return datas;
        }

        public async Task<Product> UploadImageAsync(Guid id, string imagePath)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                throw new ArgumentException("Product not found");
            }
            product.ImageUrl = imagePath;

            await _context.SaveChangesAsync();
            return product;
        }


    }
}
