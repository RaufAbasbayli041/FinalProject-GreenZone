using FluentValidation;
using GreenZone.Contracts.Dtos.DeliveryStatusDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Application.Validators.DeliveryStatus
{
    public class DeliveryStatusUpdateDtoValidator : AbstractValidator<DeliveryStatusUpdateDto>
    {
        public DeliveryStatusUpdateDtoValidator()
        {
            RuleFor(ds => ds.Name)
                .NotEmpty().WithMessage("Delivery status name is required.")
                .MaximumLength(100).WithMessage("Delivery status name must not exceed 100 characters.");
        }
    }
}
