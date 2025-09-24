using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Domain.Entity
{
    public class OrderItem : BaseEntity
    {
        public Guid OrderId { get; set; } // Foreign key to the Order
        public Order Order { get; set; } // Navigation property to the Order
        public Guid ProductId { get; set; } // Foreign key to the Product
        public Product Product { get; set; } // Navigation property to the Product
        public decimal Quantity { get; set; } // Quantity of the product ordered
        public decimal UnitPrice { get; set; } // Price of the product at the time of order
        public decimal TotalPrice => Quantity * UnitPrice; // Total price for the order item
    }
}
