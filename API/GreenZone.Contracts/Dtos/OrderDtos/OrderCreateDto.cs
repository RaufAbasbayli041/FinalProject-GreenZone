using GreenZone.Contracts.Dtos.OrderItemDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Contracts.Dtos.OrderDtos
{
    public record class OrderCreateDto
    {
        public Guid CustomerId { get; set; } // Foreign key to the Customer
        public string ShippingAddress { get; set; } // Address where the order will be shipped
        public List<OrderItemCreateDto> Items { get; set; } = new(); // List of items in the order
    }
}
