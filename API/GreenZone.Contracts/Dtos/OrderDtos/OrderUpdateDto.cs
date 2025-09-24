using GreenZone.Contracts.Dtos.OrderItemDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Contracts.Dtos.OrderDtos
{
    public record class OrderUpdateDto
    {
        public decimal TotalAmount { get; set; }
        public string ShippingAddress { get; set; } // Address where the order will be shipped
        public DateTime OrderDate { get; set; } = DateTime.UtcNow.AddHours(4);
        public Guid CustomerId { get; set; } // Foreign key to the Customer
        public Guid OrderStatusId { get; set; } // Foreign key to the OrderStatus
        public List<OrderItemCreateDto> Items { get; set; }
    }
}
