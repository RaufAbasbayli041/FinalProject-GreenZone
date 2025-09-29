using FluentValidation;
using GreenZone.Contracts.Dtos.DeliveryDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Application.Validators.Delivery
{
    public class DeliveryCreateDtoValidator : AbstractValidator<DeliveryCreateDto>
    {
        public DeliveryCreateDtoValidator()
        {
            RuleFor(d => d.OrderId)
                .NotEmpty().WithMessage("Order ID is required.");
            RuleFor(d => d.DeliveryStatusId)
                .NotEmpty().WithMessage("Delivery status ID is required.");
        }
    }
}
