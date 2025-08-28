using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Domain.Entity
{
    public class Delivery : BaseEntity
    {
        public Guid OrderId { get; set; }   // foreign key to Order
        public Order Order { get; set; }      // Navigation property to Order
        public DateTime ScheduledDate { get; set; }  // scheduled date for delivery
        public DateTime? ActualDate { get; set; }    // factual date of delivery (nullable if not yet delivered)
        public string InstallerName { get; set; }   // Name of the installer or delivery person
        public Guid DeliveryStatusId { get; set; } // foreign key to DeliveryStatus
        public DeliveryStatus DeliveryStatus { get; set; } // Navigation property to DeliveryStatus
        public string Notes { get; set; }        // Additional notes or comments about the delivery

    }
}
