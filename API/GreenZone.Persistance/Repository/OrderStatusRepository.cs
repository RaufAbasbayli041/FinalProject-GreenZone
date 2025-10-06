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
    public class OrderStatusRepository : GenericRepository<OrderStatus>, IOrderStatusRepository
    {
        public OrderStatusRepository(GreenZoneDBContext context) : base(context)
        {
        }
        public async Task<ICollection<OrderStatus>> GetAllOrderStatusesAsync()
        {
            var datas = await _context.OrderStatuses
                .Where(x => !x.IsDeleted)
                .Include(x=>x.Orders)
                .ToListAsync();
            return datas;
        }

        public async Task<OrderStatus?> GetByNameAsync(OrderStatusName name)
        {
            var data = await _context.OrderStatuses
                .Where(x => !x.IsDeleted && x.StatusName == name)
                .Include(x => x.Orders)
                .FirstOrDefaultAsync();
            return data;
        }
        public override Task<OrderStatus> GetByIdAsync(Guid id)
        {
            var data = _context.OrderStatuses
                .Where(x => !x.IsDeleted && x.Id == id)
                .Include(x => x.Orders)
                .FirstOrDefaultAsync(); return data;
        }

       
    }
}
