using GreenZone.Domain.Entity;
using GreenZone.Domain.Enum;
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
    public class OrderRepository : GenericRepository<Order>, IOrderRepository
	{
		public OrderRepository(GreenZoneDBContext context) : base(context)
		{
		}

        public override async Task<IEnumerable<Order>> GetAllAsync()
        {
            var datas = await _context.Orders
				.AsNoTracking()
                .Include(o => o.Customer)
                .Include(o => o.OrderStatus)
                .Include(o => o.OrderItems)
                     .ThenInclude(oi => oi.Product)
                .Include(o => o.Deliveries)
                .Where(x => !x.IsDeleted)
                .ToListAsync();
            return datas;
        }

        
		public async Task<int> GetOrderCountByStatusAsync(Guid orderStatusId)
		{
			var data = await _context.Orders
				.Where(o => !o.IsDeleted && o.OrderStatusId == orderStatusId)
				.CountAsync();

			return data;
		}

		public async Task<ICollection<Order>> GetOrdersByCustomerIdAsync(Guid customerId)
		{
			var datas = await _context.Orders
				.AsNoTracking()
               .Include(o => o.Customer)
			   .Include(o => o.OrderStatus)
			   .Include(o => o.OrderItems)
					.ThenInclude(oi => oi.Product)
			   .Include(o => o.Deliveries)
			   .Where(x => !x.IsDeleted && x.CustomerId == customerId)
			   .ToListAsync();

			return datas;
		}

		public async Task<ICollection<Order>> GetOrdersByDateRangeAsync(DateTime startDate, DateTime endDate)
		{
			var datas = await _context.Orders
				.AsNoTracking()
               .Include(o => o.Customer)
			   .Include(o => o.OrderStatus)
			   .Include(o => o.OrderItems)
					.ThenInclude(oi => oi.Product)
			   .Include(o => o.Deliveries)
			   .Where(x => !x.IsDeleted && x.OrderDate >= startDate && x.OrderDate <= endDate)
			   .ToListAsync();
			return datas;
		}

		public async Task<ICollection<Order>> GetOrdersByOrderStatusAsync(Guid? orderStatusId, string? keyword, int page = 1, int pageSize = 10)
		{
			var datas = _context.Orders
				.AsNoTracking() 
               .Include(o => o.Customer)
			   .Include(o => o.OrderStatus)
			   .Include(o => o.OrderItems)
					.ThenInclude(oi => oi.Product)
			   .Include(o => o.Deliveries)
			   .Where(x => !x.IsDeleted)
			   .AsQueryable();
			if (orderStatusId.HasValue && orderStatusId != Guid.Empty)
			{
				datas = datas.Where(o => o.OrderStatusId == orderStatusId);
			}
			if (!string.IsNullOrEmpty(keyword))
			{
				datas = datas.Where(o => o.OrderStatus.Name.ToString().ToLower() .Contains(keyword.ToLower()) ||
					 (o.Customer.User.UserName ?? "").ToLower().Contains(keyword) ||
				o.ShippingAddress.ToLower().Contains(keyword.ToLower())
				);
			}
			var sentDatas = await datas.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
			return sentDatas;
		}

         

        public async Task<Order> GetOrderWithDetailsAsync(Guid orderId)
		{
			var data = await _context.Orders
					.AsNoTracking()
                 .Where(o => o.Id == orderId)
				 .Include(o => o.Customer)
				 .Include(o => o.OrderStatus)
				 .Include(o => o.OrderItems)
					 .ThenInclude(oi => oi.Product)
				 .Include(o => o.Deliveries) // Include related deliveries
				 .FirstOrDefaultAsync();
			return data;
		}

		public async Task<decimal> GetTotalSalesAsync(DateTime startDate, DateTime endDate)
		{ 
			var datas = await _context.Orders
				.AsNoTracking()	
                .Where(o => !o.IsDeleted && o.OrderDate >= startDate && o.OrderDate <= endDate)
				.SumAsync(o => o.TotalAmount); 
			return datas;
		}


	}
}
