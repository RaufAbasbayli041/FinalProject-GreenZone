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

		public async Task<Customer> GetCustomerWithOrdersAsync(Guid customerId)
		{
			var data = await _context.Customers
				.Include(x => x.Orders)
				.ThenInclude(o => o.OrderStatus)
				.Include(x => x.User)
				.Where(x => !x.IsDeleted)
				.FirstOrDefaultAsync(x => x.Id == customerId);
			return data;
		}

		public override async Task<IEnumerable<Customer>> GetAllAsync()
		{
			var datas = await _context.Customers
				.Include(x => x.User)
				.Include(x => x.Orders)
				.Include(x => x.Payments)
				.Where(x => !x.IsDeleted)
				.ToListAsync();
			return datas;
		}
	}
}
