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
    public class DeliveryRepository : GenericRepository<Delivery>, IDeliveryRepository
    {
        public DeliveryRepository(GreenZoneDBContext context) : base(context)
        {
        } 
       
        public async Task<Delivery?> GetDeliveryByStatusAsync(DeliveryStatusType deliveryStatus)
        {
            var data = await _context.Deliveries
                .Include(d => d.DeliveryStatus)
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
            return data ;
        }
    }
}
