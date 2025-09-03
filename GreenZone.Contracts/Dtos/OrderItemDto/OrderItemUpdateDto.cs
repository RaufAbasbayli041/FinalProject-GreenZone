using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Contracts.Dtos.OrderItemDto
{
    public record class OrderItemUpdateDto
    {
        public Guid ProductId { get; set; } // Foreign key to the Product
        public decimal Quantity { get; set; } // Quantity of the product ordered
        public decimal UnitPrice { get; set; } // Price of the product at the time of order
        public decimal TotalPrice => Quantity * UnitPrice; // Total price for the order item
    }
}
