using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;
using GreenZone.Contracts.Dtos.PaymentDto;

namespace GreenZone.Application.Validators.Payment
{
	public class PaymentCreateDtoValidator : AbstractValidator<PaymentCreateDto>
	{
		public PaymentCreateDtoValidator()
		{
			RuleFor(p => p.Amount)
				.NotNull().WithMessage("Payment amount is required.")
				.GreaterThan(0).WithMessage("Payment amount must be greater than zero."); 
			RuleFor(p => p.PaymentMethodId)
				.NotEmpty().WithMessage("Payment method is required.");
			RuleFor(p => p.CustomerId)
				.NotEmpty().WithMessage("Customer ID is required.");
		}
	}
}
