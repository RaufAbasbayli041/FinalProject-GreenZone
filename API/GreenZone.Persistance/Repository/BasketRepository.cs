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
    public class BasketRepository : GenericRepository<Basket>, IBasketRepository
    {
        public BasketRepository(GreenZoneDBContext context) : base(context)
        {
        }

        public async Task ClearBasketAsync(Guid customerId)
        {
            var cart = await _context.Baskets
                .Where(c => !c.IsDeleted)
                .Include(c => c.BasketItems)
                .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.CustomerId == customerId);

            if (cart != null)
            {
                _context.BasketItems.RemoveRange(cart.BasketItems);
            }
        }

        public async Task<Basket> GetBasketByCustomerAsync(Guid customerId)
        {
            var cart = await _context.Baskets
                 .Where( b=>!b.IsDeleted)
                 .Include(b => b.BasketItems)
                 .ThenInclude(ci => ci.Product)
                 .FirstOrDefaultAsync(b => b.CustomerId == customerId);
            return cart;
        }
    }
}
