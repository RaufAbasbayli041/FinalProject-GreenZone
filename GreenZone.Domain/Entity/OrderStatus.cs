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
        public OrderStatusName Name { get; set; } // Name of the order status (e.g., "Pending", "Shipped", "Delivered")
        public string Description { get; set; } // Description of the order status
        public ICollection<Order> Orders { get; set; } = new List<Order>(); // Navigation property to related orders
    }
}
