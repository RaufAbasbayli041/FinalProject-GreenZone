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
        public Guid DeliveryStatusId { get; set; }
    }

}
