using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Contracts.Dtos.DeliveryStatusDtos
{
    public record class DeliveryStatusUpdateDto
    {
        public string Name { get; set; } = null!;
    }
}
