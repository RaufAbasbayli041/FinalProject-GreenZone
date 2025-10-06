using GreenZone.Domain.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Contracts.Dtos.OrderItemDto
{
    public record class OrderITemReadDto : BaseDto
    {
        public Guid OrderId { get; set; } // Foreign key to the Order       
        public Guid ProductId { get; set; } // Foreign key to the Product
        public string ProductName { get; set; } // Name of the product
        public decimal Quantity { get; set; } // Quantity of the product ordered
        public decimal UnitPrice { get; set; } // Price of the product at the time of order
        public decimal TotalPrice { get; set; } // Total price for this item (Quantity * UnitPrice)
    }
}
