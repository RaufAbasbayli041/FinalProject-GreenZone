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
    public class CategoryRepository : GenericRepository<Category>, ICategoryRepository
    {
        public CategoryRepository(GreenZoneDBContext context) : base(context)
        {
        }
        public async Task<List<Category>> GetCategoriesWithProductsAsync()
        {
            var datas = await _context.Categories
                        .Include(c => c.Products)
                        .Where(c=>!c.IsDeleted)
                        .ToListAsync();
            return datas;
        }

        public async Task<Category> GetCategoryWithProductsByIdAsync(Guid id)
        {
           var data = await _context.Categories
                        .AsNoTracking()
                        .Include(c => c.Products)
                        .Where(c=>!c.IsDeleted)
                        .FirstOrDefaultAsync(c => c.Id == id);
            return data;
        }
    }
}
