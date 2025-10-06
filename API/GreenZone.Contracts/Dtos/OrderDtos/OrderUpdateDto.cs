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
        public string ShippingAddress { get; set; } // Address where the order will be shipped       
    }
}
