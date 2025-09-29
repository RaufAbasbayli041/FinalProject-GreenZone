using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Domain.Entity
{
    public class Delivery : BaseEntity
    {
        public Guid OrderId { get; set; }
        public Guid DeliveryStatusId { get; set; } 
        public DateTime? DeliveredAt { get; set; }
        public Order Order { get; set; } = null!;
        public DeliveryStatus DeliveryStatus { get; set; } = null!;

    }
}
