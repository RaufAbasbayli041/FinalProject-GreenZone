using GreenZone.Domain.Entity;
using GreenZone.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Domain.Repository
{
    public interface IDeliveryStatusRepository : IGenericRepository<DeliveryStatus>
    {
        Task<DeliveryStatus?> GetByStatusTypeAsync(DeliveryStatusType statusType);

    }
}
