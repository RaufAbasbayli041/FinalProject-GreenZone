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
    public class DeliveryStatusRepository : GenericRepository<DeliveryStatus>, IDeliveryStatusRepository
    {
        public DeliveryStatusRepository(GreenZoneDBContext context) : base(context)
        {
        }
        public async Task<DeliveryStatus?> GetDeliveryStatusByTypeAsync(DeliveryStatusType statusType)
        {
            return await _context.DeliveryStatuses
                .Include(ds => ds.Deliveries)
                .FirstOrDefaultAsync(s => s.StatusType == statusType);
        }
    }
}
