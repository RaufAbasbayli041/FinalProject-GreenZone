using GreenZone.Domain.Entity;
using GreenZone.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Contracts.Dtos.DeliveryDtos
{
    public class DeliveryUpdateDto
    {
        public DeliveryStatusType DeliveryStatus { get; set; }
    }
}
