using FluentValidation;
using GreenZone.Contracts.Dtos.ProductDocumentsDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Application.Validators.ProductDocuments
{
    public class ProductDocumentsCreateDtoValidator : AbstractValidator<ProductDocumentsCreateDto>
    {
        public ProductDocumentsCreateDtoValidator()
        {
            RuleFor(x => x.DocumentName)
                .NotEmpty().WithMessage("Document name is required.")
                .MaximumLength(200).WithMessage("Document name must not exceed 200 characters.");
            RuleFor(x => x.OriginalName)
                .NotEmpty().WithMessage("Original name is required.")
                .MaximumLength(200).WithMessage("Original name must not exceed 200 characters.");
            RuleFor(x => x.DocumentUrl)
                .NotEmpty().WithMessage("Document URL is required.")
                .MaximumLength(500).WithMessage("Document URL must not exceed 500 characters.");
            RuleFor(x => x.ProductId)
                .NotEmpty().WithMessage("Product ID is required.");
            RuleFor(x => x.ProductId)
                .NotEqual(Guid.Empty).WithMessage("Product ID must be a valid GUID.");  


        }
    }
}
