using GreenZone.Contracts.Dtos.OrderItemDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Contracts.Dtos.OrderDtos
{
    public record class OrderReadDto : BaseDto
    {
        public decimal TotalAmount { get; set; }
        public string ShippingAddress { get; set; } // Address where the order will be shipped
        public DateTime OrderDate { get; set; }
        public Guid CustomerId { get; set; } // Foreign key to the Customer
        public Guid OrderStatusId { get; set; } // Foreign key to the OrderStatus
        public List<OrderITemReadDto> OrderItems { get; set; } = new List<OrderITemReadDto>();
       
    }
}
