using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Contracts.Dtos.DeliveryStatusDtos
{
    public record class DeliveryStatusReadDto: BaseDto
    {
        public string Name { get; set; } = null!;
    }
}
