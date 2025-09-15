using FluentValidation;
using GreenZone.Contracts.Dtos.ProductDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Application.Validators.Product
{
    public class ProductCreateDtoValidator : AbstractValidator<ProductCreateDto>
    {
        public ProductCreateDtoValidator()
        {
            RuleFor(x=>x.Title)
                .NotEmpty().WithMessage("Product title is required.")
                .MaximumLength(100).WithMessage("Product title must not exceed 100 characters.");
            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Product description is required.")
                .MaximumLength(500).WithMessage("Description must not exceed 500 characters.");
            RuleFor(x => x.PricePerSquareMeter)
                .NotNull().WithMessage("Price per square meter is required.")
                .GreaterThan(0).WithMessage("Price per square meter must be greater than zero.");
            RuleFor(x => x.ImageUrl)
                .Must(url => string.IsNullOrEmpty(url) || Uri.IsWellFormedUriString(url, UriKind.Absolute))
                .WithMessage("ImageUrl must be a valid URL or empty.");
            RuleFor(x => x.CategoryId)
                .NotEmpty().WithMessage("Category ID is required."); 
            RuleFor(x => x.MinThickness)
                .NotNull().WithMessage("Minimum thickness is required.")
                .GreaterThan(0).WithMessage("Minimum thickness must be greater than zero.")
                .LessThan(x => x.MaxThickness).WithMessage("Minimum thickness must be less than maximum thickness.");
            RuleFor(x => x.MaxThickness)
                .NotNull().WithMessage("Maximum thickness is required.")
                .GreaterThan(0).WithMessage("Maximum thickness must be greater than zero.")
                .GreaterThan(x => x.MinThickness).WithMessage("Maximum thickness must be greater than minimum thickness.");
            //RuleFor(x => x.DocumentIds)
            //    .NotNull().WithMessage("Document IDs collection cannot be null.");

        }
    }
}
