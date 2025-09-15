using FluentValidation;
using GreenZone.Contracts.Dtos.ProductDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Application.Validators.Product
{
    public class ProductUpdateDtoValidator : AbstractValidator<ProductUpdateDto>
    {
        public ProductUpdateDtoValidator()
        {
            RuleFor(p => p.Title) 
                .MaximumLength(100).WithMessage("Title cannot exceed 100 characters.");
            RuleFor(p => p.Description) 
                .MaximumLength(500).WithMessage("Description cannot exceed 500 characters.");
            RuleFor(p => p.PricePerSquareMeter)
                .GreaterThan(0).WithMessage("Price per square meter must be greater than zero.");
            RuleFor(p => p.ImageUrl) 
                .MaximumLength(200).WithMessage("Image URL cannot exceed 200 characters.");
            RuleFor(p => p.CategoryId)
                .NotEmpty().WithMessage("Category ID is required.");
            RuleFor(x => x.MinThickness)
                .GreaterThan(0).WithMessage("Minimum thickness must be greater than zero.")
                .LessThan(x => x.MaxThickness).WithMessage("Minimum thickness must be less than maximum thickness.");
            RuleFor(x => x.MaxThickness)
                .GreaterThan(0).WithMessage("Maximum thickness must be greater than zero.")
                .GreaterThan(x => x.MinThickness).WithMessage("Maximum thickness must be greater than minimum thickness.");
        }
    }
}
