using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Contracts.Dtos.DeliveryDtos
{
    public record class DeliveryReadDto : BaseDto
    {
        public Guid OrderId { get; set; }
        public string StatusName { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public DateTime? DeliveredAt { get; set; }
    }
}
