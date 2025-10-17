using GreenZone.Domain.Entity;
using GreenZone.Domain.Enum;
using GreenZone.Domain.Repository;
using GreenZone.Persistance.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Persistance.Repository
{
    public class DeliveryRepository : GenericRepository<Delivery>, IDeliveryRepository
    {
        public DeliveryRepository(GreenZoneDBContext context) : base(context)
        {
        }

        public async Task<Delivery?> GetDeliveryByStatusAsync(DeliveryStatusType deliveryStatus)
        {
            var data = await _context.Deliveries
                .Where(d => !d.IsDeleted)
                .Include(d => d.DeliveryStatus)
                .AsNoTracking()
                .Include(d => d.Order)
                .ThenInclude(o => o.Customer)

                .FirstOrDefaultAsync(d => d.DeliveryStatus.StatusType == deliveryStatus);

            return data;
        }

        public async Task<IEnumerable<Delivery>> GetAllDeliveriesByStatusAsync(DeliveryStatusType deliveryStatus)
        {
            var data = await _context.Deliveries
                .AsNoTracking()
                .Include(d => d.DeliveryStatus)
                .Where(d => d.DeliveryStatus.StatusType == deliveryStatus)
                .ToListAsync();
            return data;
        }
        public override Task<Delivery> GetByIdAsync(Guid id)
        {
            var data = _context.Deliveries
                .Where(d => !d.IsDeleted)
                .Include(d => d.DeliveryStatus)
                .AsNoTracking()
                .Include(d => d.Order)
                .ThenInclude(o => o.Customer)
                .FirstOrDefaultAsync(d => d.Id == id);
            return data;
        }

        public async Task<IEnumerable<Delivery>> GetDeliveriesByCustomerIdAsync(Guid customerId)
        { 
            var datas = await _context.Deliveries
                .AsNoTracking()
                .Include(d => d.Order)
                    .ThenInclude(o => o.Customer)
                .Include(d => d.DeliveryStatus)
                .Where(d => !d.IsDeleted && d.Order.CustomerId == customerId)
                .ToListAsync();
            return datas;
        }
        public override async Task<IEnumerable<Delivery>> GetAllAsync()
        {
            var datas = await _context.Deliveries
                .Where(d => !d.IsDeleted)
                .Include(d => d.DeliveryStatus)
                .AsNoTracking()
                .Include(d => d.Order)
                .ThenInclude(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .ThenInclude(p => p.Category)
                .ToListAsync();
            return datas;
        }
    }
}
