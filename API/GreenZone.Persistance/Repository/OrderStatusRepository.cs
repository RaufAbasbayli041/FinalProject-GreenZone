using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GreenZone.Domain.Entity;
using GreenZone.Domain.Enum;
using GreenZone.Domain.Repository;
using GreenZone.Persistance.Database;
using Microsoft.EntityFrameworkCore;

namespace GreenZone.Persistance.Repository
{
    public class OrderStatusRepository : IOrderStatusRepository
    {
        private readonly GreenZoneDBContext _context;

        public OrderStatusRepository(GreenZoneDBContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<OrderStatus>> GetAllAsync()
        { 
            var datas =  await _context.OrderStatuses
                .AsNoTracking()
                .Include(os => os.Orders)
                .ToListAsync();
            return datas;
        }

        public async Task<OrderStatus?> GetOrderStatusByType(OrderStatusName name)
        { 
            var data = await _context.OrderStatuses
                .AsNoTracking()
                .Include(os => os.Orders)
                .FirstOrDefaultAsync(os => os.StatusName == name);
            return data;
        }
    }
}
