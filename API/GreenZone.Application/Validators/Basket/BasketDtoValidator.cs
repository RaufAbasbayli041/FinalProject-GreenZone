using FluentValidation;
using GreenZone.Contracts.Dtos.BasketDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Application.Validators.Basket
{
    public class BasketDtoValidator : AbstractValidator<BasketReadDto>
    {
        public BasketDtoValidator()
        {
            RuleFor(basket => basket.CustomerId).NotEmpty().WithMessage("CustomerId is required.");
            RuleFor(basket => basket.BasketItems).NotNull().WithMessage("Items collection cannot be null.");
           
        }
    }
}
