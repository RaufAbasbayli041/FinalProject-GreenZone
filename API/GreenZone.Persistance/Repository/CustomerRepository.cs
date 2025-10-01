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
    public class CustomerRepository : GenericRepository<Customer>, ICustomerRepository
    {
        public CustomerRepository(GreenZoneDBContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Customer>> GetAllCustomersWithOrdersAsync(int page, int pageSize)
        {
            var datas = await _context.Customers
                .Include(x => x.Orders)
                .Include(x => x.User)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Where(x => !x.IsDeleted && x.Orders.Any())
                .ToListAsync();
            return datas;
        }

        public async Task<Customer> GetCustomerFullDataAsync(Guid customerId)
        {
            var data = await _context.Customers
                  .Include(x => x.Orders)
                  .ThenInclude(o => o.OrderItems)
                  .ThenInclude(oi => oi.Product)
                  .Include(x => x.Payments)
                  .Include(x => x.User)
                  .FirstOrDefaultAsync(x => x.Id == customerId);
            return data;
        }

        public override async Task<Customer> GetByIdAsync(Guid customerId)
        {
            var data = await _context.Customers
                .Where(x => !x.IsDeleted)
                .Include(x => x.Orders)
                .ThenInclude(o => o.OrderStatus)
                .Include(x => x.User)
                .FirstOrDefaultAsync(x => x.Id == customerId);
            return data;
        }

        public override async Task<IEnumerable<Customer>> GetAllAsync()
        {
            var datas = await _context.Customers
                .Where(x => !x.IsDeleted)
                .Include(x => x.User)
                .Include(x => x.Orders)
                .Include(x => x.Payments)
                .ToListAsync();
            return datas;
        }

        public async Task<Customer> GetCustomerByUserIdAsync(string userId)
        {
            var customer = await _context.Customers
                .Where(c => !c.IsDeleted)
                    .Include(c => c.User)

                    .Include(c => c.Basket)
                    .ThenInclude(b => b.BasketItems)
                    .ThenInclude(bi => bi.Product)
                    .Include(c => c.Orders)
                    .Include(c => c.Payments)
                    .FirstOrDefaultAsync(c => c.UserId == userId);
            return customer;
        }
    }
}
