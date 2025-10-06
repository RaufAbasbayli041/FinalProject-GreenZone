using GreenZone.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Contracts.Dtos.OrderStatus
{
    public class OrderStatusReadDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public OrderStatusName StatusName { get; set; }
    }
}
