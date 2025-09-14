using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GreenZone.Domain.Enum;

namespace GreenZone.Contracts.Dtos.PaymentDto
{
    public record class PaymentUpdateDto
    {
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending; // Default status		 
    }
}
