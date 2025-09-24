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
    public class ProductDocumentsRepository : GenericRepository<ProductDocuments>, IProductDocumentsRepository
    {
        public ProductDocumentsRepository(GreenZoneDBContext context) : base(context)
        {
        }

        public async Task<ProductDocuments> GetProductByIdAsync(Guid productId)
        {
            var data = await _context.ProductDocuments.FirstOrDefaultAsync(x => x.ProductId == productId);
            return data;
        }

    }
}
