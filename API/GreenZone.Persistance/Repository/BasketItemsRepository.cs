using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GreenZone.Domain.Entity;
using GreenZone.Domain.Repository;
using GreenZone.Persistance.Database;
using Microsoft.EntityFrameworkCore;

namespace GreenZone.Persistance.Repository
{
    public class BasketItemsRepository : GenericRepository<BasketItems>, IBasketItemsRepository
	{
		public BasketItemsRepository(GreenZoneDBContext context) : base(context)
		{
		}

        public async Task<bool> DeleteAsync(BasketItems basketItem)
        { 
            if (basketItem == null || basketItem.IsDeleted)
            {
                return false;
            }
            basketItem.IsDeleted = true;
            _context.BasketItems.Update(basketItem);
            await Task.CompletedTask; // Simulate async operation
            return true;
        }

        public async Task<BasketItems> GetItemsByProductIdAsync(Guid basketId, Guid productId)
        {
            var item = await _context.BasketItems
                .AsNoTracking()
                .Where(bi => !bi.IsDeleted)
                .Include(bi => bi.Product)
                .FirstOrDefaultAsync(bi => bi.ProductId == productId && bi.BasketId == basketId);
            return item;
        }

    }
}
