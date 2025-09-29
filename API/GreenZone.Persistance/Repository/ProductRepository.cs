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
        public override async Task<IEnumerable<Product>> GetAllAsync()
        {
            var datas = await _context.Products
                        .Include(p => p.Category)
                        .Where(p => !p.IsDeleted)
                        .AsNoTracking()
                        .ToListAsync();
            return datas;

        }

        public override async Task<Product> GetByIdAsync(Guid id)
        {
            var data = await _context.Products
                            .Include(p => p.Category)
                            .Include(p => p.Documents)
                            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);
            return data;
        }


        public async Task<IEnumerable<Product>> SearchProductsAsync(string keyword, int pages, int pageSize)
        {
            var datas = await _context.Products
                .Include(p => p.Category)
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

        public async Task<Product> UploadDocuments(Guid id, List<ProductDocuments> documents)
        {
            var product = await _context.Products
                 .Include(p => p.Documents)
                 .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);
            if (product == null)
            {
                throw new ArgumentException("Product not found");
            }

            foreach (var doc in documents)
            {
                product.Documents.Add(doc);

            }
            await _context.SaveChangesAsync();
            return product;
        }
    }
}
