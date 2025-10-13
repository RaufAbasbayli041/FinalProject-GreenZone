using FluentValidation;
using GreenZone.Contracts.Dtos.DeliveryDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Application.Validators.Delivery
{
    public class DeliveryUpdateDtoValidator : AbstractValidator<DeliveryUpdateDto>
    {
        public DeliveryUpdateDtoValidator()
        {
            RuleFor(d => d.DeliveryStatus)
                .NotEmpty().WithMessage("Delivery status is required.");
        }
    }
}
