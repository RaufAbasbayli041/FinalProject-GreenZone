using GreenZone.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Domain.Entity
{
    public class DeliveryStatus : BaseEntity
    {
        public string Name { get; set; } = null!;

        // Enum id (int)
        public DeliveryStatusType StatusType { get; set; }

        public ICollection<Delivery> Deliveries { get; set; } = new List<Delivery>();
    }
}
