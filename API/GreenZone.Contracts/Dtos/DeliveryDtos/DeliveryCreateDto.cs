using GreenZone.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Contracts.Dtos.DeliveryDtos
{
    public record class DeliveryCreateDto
    {
        public Guid OrderId { get; set; }
        public DateTime CreatedAt { get; set; } 
        public DeliveryStatusType DeliveryStatus { get; set; }
        public string Address { get; set; }
    }

}
