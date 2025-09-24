using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Domain.Entity
{
    public class DeliveryStatus : BaseEntity
    {
        public string Name { get; set; } // e.g., Scheduled, In Transit, Delivered, Delayed, Canceled
        public string Description { get; set; } // Optional description of the status
        public ICollection<Delivery> Deliveries { get; set; } // Navigation property to related deliveries
    }
}
