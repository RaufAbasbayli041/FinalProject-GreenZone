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
            RuleFor(o => o.TotalAmount)
                .GreaterThan(0).WithMessage("Total amount must be greater than zero.");
            RuleFor(o => o.ShippingAddress)
                .NotEmpty().WithMessage("Shipping address is required.")
                .MaximumLength(500).WithMessage("Shipping address cannot exceed 500 characters.");
            RuleFor(o => o.OrderDate)
                .LessThanOrEqualTo(DateTime.UtcNow.AddHours(4)).WithMessage("Order date cannot be in the future.");
            RuleFor(o => o.CustomerId)
                .NotEmpty().WithMessage("Customer ID is required.");
            RuleFor(o => o.OrderStatusId)
                .NotEmpty().WithMessage("Order status ID is required.");
            RuleFor(o => o.Items)
                .NotEmpty().WithMessage("Order must contain at least one item.")
                .Must(items => items != null && items.Count > 0).WithMessage("Order must contain at least one item.");
            RuleForEach(o => o.Items).SetValidator(new OrderItemCreateDtoValidator());

        }
    }
}
