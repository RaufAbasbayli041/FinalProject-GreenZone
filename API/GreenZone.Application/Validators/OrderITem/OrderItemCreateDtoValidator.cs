using FluentValidation;
using GreenZone.Contracts.Dtos.OrderItemDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Application.Validators.OrderITem
{
    public class OrderItemCreateDtoValidator : AbstractValidator<OrderItemCreateDto>
    {
        public OrderItemCreateDtoValidator()
        {
            RuleFor(oi => oi.ProductId)
                .NotEmpty().WithMessage("Product ID is required.");
            RuleFor(oi => oi.Quantity)
                .NotEmpty().WithMessage("Quantity is required.")
                .GreaterThan(0).WithMessage("Quantity must be greater than zero.");
            RuleFor(oi => oi.UnitPrice)
                .NotEmpty().WithMessage("Unit price is required.")
                .GreaterThan(0).WithMessage("Unit price must be greater than zero.");
            RuleFor(oi => oi.TotalPrice)
                .NotEmpty().WithMessage("Total price is required.")
                .GreaterThan(0).WithMessage("Total price must be greater than zero.")
                .Equal(oi => oi.Quantity * oi.UnitPrice).WithMessage("Total price must be equal to Quantity multiplied by Unit Price.");
        }
    }
}
