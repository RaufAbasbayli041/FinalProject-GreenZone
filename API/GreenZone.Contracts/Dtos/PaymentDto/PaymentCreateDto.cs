using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GreenZone.Domain.Enum;

namespace GreenZone.Contracts.Dtos.PaymentDto
{
	public record class PaymentCreateDto
	{
		public decimal Amount { get; set; }
		public DateTime PaymentDate { get; set; } = DateTime.Now;
		public Guid PaymentMethodId { get; set; } // Foreign key to PaymentMethod
		public PaymentStatus Status { get; set; } = PaymentStatus.Pending; // Default status

		public Guid CustomerId { get; set; } // Foreign key to Customer
	}
}
