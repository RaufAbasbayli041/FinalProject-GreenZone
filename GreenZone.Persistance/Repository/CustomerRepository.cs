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

        public async Task<IEnumerable<Customer>> GetAllCustomersWithOrdersAsync(int page = 1, int pageSize = 10)
        {
            var datas = await _context.Customers
                .Include(x => x.Orders)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Where(x => !x.IsDeleted)
                .ToListAsync();
            return datas;
        }

        public async Task<Customer> GetCustomerFullDataAsync(Guid customerId)
        {
          var data =  await _context.Customers
                .Include(x => x.Orders)
                .ThenInclude(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Include(x=>x.Payments)
                .Include(x=>x.User)
                .Where(x => !x.IsDeleted)
                .FirstOrDefaultAsync(x => x.Id == customerId);
            return data;
        }

        public async Task<Customer> GetCustomerWithOrdersAsync(Guid customerId)
        {
            var data = await _context.Customers
                .Include(x => x.Orders)
                .Where(x => !x.IsDeleted)
                .FirstOrDefaultAsync(x => x.Id == customerId);
            return data;
        }
    }
}
