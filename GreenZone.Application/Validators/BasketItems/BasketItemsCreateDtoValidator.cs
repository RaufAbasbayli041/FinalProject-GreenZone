using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;
using GreenZone.Contracts.Dtos.BasketItemsDtos;

namespace GreenZone.Application.Validators.BasketItems
{
	public class BasketItemsCreateDtoValidator : AbstractValidator<BasketItemsCreateDto>
	{
		public BasketItemsCreateDtoValidator()
		{
			RuleFor(basketItem => basketItem.BasketId).NotEmpty().WithMessage("BasketId is required.");
			RuleFor(basketItem => basketItem.ProductId).NotEmpty().WithMessage("ProductId is required.");
			RuleFor(basketItem => basketItem.Quantity).GreaterThan(0).WithMessage("Quantity must be greater than zero.");
		}
	}
}
