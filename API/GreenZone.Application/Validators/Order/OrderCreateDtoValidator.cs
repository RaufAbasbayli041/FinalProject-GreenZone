using FluentValidation;
using GreenZone.Application.Validators.OrderITem;
using GreenZone.Contracts.Dtos.OrderDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Application.Validators.Order
{
    public class OrderCreateDtoValidator : AbstractValidator<OrderCreateDto>
    {
        public OrderCreateDtoValidator()
        {
            RuleFor(o => o.ShippingAddress)
                .NotEmpty().WithMessage("Shipping address is required.")
                .MaximumLength(500).WithMessage("Shipping address cannot exceed 500 characters.");           
            RuleFor(o => o.CustomerId)
                .NotEmpty().WithMessage("Customer ID is required.");           
            RuleFor(o => o.Items)
                .NotEmpty().WithMessage("Order must contain at least one item.")
                .Must(items => items != null && items.Count > 0).WithMessage("Order must contain at least one item.");
            RuleForEach(o => o.Items).SetValidator(new OrderItemCreateDtoValidator());

        }
    }
}
