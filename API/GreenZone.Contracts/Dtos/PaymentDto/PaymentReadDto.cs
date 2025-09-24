using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GreenZone.Domain.Enum;

namespace GreenZone.Contracts.Dtos.PaymentDto
{
	public record class PaymentReadDto : BaseDto
	{
		public decimal Amount { get; set; }
		public DateTime PaymentDate { get; set; }
		public DateTime? RefundDate { get; set; } // Nullable to indicate no refund
        public PaymentStatus Status { get; set; }
		public string PaymentMethodName { get; set; }
		public string CustomerName { get; set; }
	}
}
