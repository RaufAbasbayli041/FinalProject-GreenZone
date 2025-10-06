using GreenZone.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Domain.Entity
{
    public class OrderStatus : BaseEntity
    {
        public string Name { get; set; } = null!;  // Name of the order status
        public OrderStatusName StatusName { get; set; } // Enum representing the status of the order
        public ICollection<Order> Orders { get; set; } = new List<Order>(); // Navigation property to related orders
    }
}
