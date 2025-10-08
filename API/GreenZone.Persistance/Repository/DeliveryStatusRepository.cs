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
    public class DeliveryStatusRepository : IDeliveryStatusRepository
    {
        private readonly GreenZoneDBContext _context;

        public DeliveryStatusRepository(GreenZoneDBContext context)
        {
            _context = context; 
        }

        public async Task<IEnumerable<DeliveryStatus>?> GetAllAsync()
        { 
            var statuses = await _context.DeliveryStatuses
                .AsNoTracking()                 
                .Include(ds => ds.Deliveries)
                .ToListAsync();

            return statuses;
        }

        public async Task<DeliveryStatus?> GetDeliveryStatusByTypeAsync(DeliveryStatusType statusType)
        {
            return await _context.DeliveryStatuses
                .AsNoTracking() 
                .Include(ds => ds.Deliveries)
                .FirstOrDefaultAsync(s => s.StatusType == statusType);
        }
    }
}
