using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Domain.Entity
{
    public class Order : BaseEntity
    {
        public decimal TotalAmount { get; set; }
        public string ShippingAddress { get; set; } // Address where the order will be shipped
        public DateTime OrderDate { get; set; } 
        public Guid CustomerId { get; set; } // Foreign key to the Customer
        public Customer Customer { get; set; } // Navigation property to the Customer
        public Guid OrderStatusId { get; set; } // Foreign key to the OrderStatus
        public OrderStatus OrderStatus { get; set; } // Navigation property to the OrderStatus
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public ICollection<Delivery> Deliveries { get; set; } = new List<Delivery>(); // Navigation property to related deliveries

    }
}
