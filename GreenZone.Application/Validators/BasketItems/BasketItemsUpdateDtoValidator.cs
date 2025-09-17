using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;
using GreenZone.Contracts.Dtos.BasketItemsDtos;

namespace GreenZone.Application.Validators.BasketItems
{
	public class BasketItemsUpdateDtoValidator : AbstractValidator<BasketItemsUpdateDto>
	{
		public BasketItemsUpdateDtoValidator()
		{			 
			RuleFor(basketItem => basketItem.Quantity).GreaterThan(0).WithMessage("Quantity must be greater than zero.");
			RuleFor(basketItem => basketItem.ProductId).NotEmpty().WithMessage("ProductId is required.");
		}
	}
}
