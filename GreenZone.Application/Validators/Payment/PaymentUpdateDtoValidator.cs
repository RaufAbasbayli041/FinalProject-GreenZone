using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;
using GreenZone.Contracts.Dtos.PaymentDto;
using GreenZone.Domain.Enum;

namespace GreenZone.Application.Validators.Payment
{
	public class PaymentUpdateDtoValidator : AbstractValidator<PaymentUpdateDto>
	{
		public PaymentUpdateDtoValidator()
		{
			 RuleFor(p => p.Status)
				.IsInEnum().WithMessage("Invalid payment status.");
			RuleFor(p => p.Status)	
				.NotEqual(PaymentStatus.Pending).WithMessage("Payment status cannot be set back to Pending.");
		}
	}
}
