using GreenZone.Contracts.Dtos.DeliveryDtos;
using GreenZone.Contracts.Dtos.OrderItemDto;
using GreenZone.Contracts.Dtos.OrderStatus;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Contracts.Dtos.OrderDtos
{
    public record class OrderReadDto : BaseDto
    {
        public Guid CustomerId { get; set; } // Foreign key to the Customer
        public decimal TotalAmount { get; set; }
        public string ShippingAddress { get; set; } // Address where the order will be shipped
        public DateTime OrderDate { get; set; }
        public OrderStatusReadDto OrderStatus { get; set; }
        public List<DeliveryReadDto> Deliveries { get; set; } = new();
        public List<OrderITemReadDto> OrderItems { get; set; } = new();


    }
}
