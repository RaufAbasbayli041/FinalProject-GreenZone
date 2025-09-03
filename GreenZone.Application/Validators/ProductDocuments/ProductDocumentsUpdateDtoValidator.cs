using FluentValidation;
using GreenZone.Contracts.Dtos.ProductDocumentsDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Application.Validators.ProductDocuments
{
    public class ProductDocumentsUpdateDtoValidator : AbstractValidator<ProductDocumentsUpdateDto>
    {
        public ProductDocumentsUpdateDtoValidator()
        {
            RuleFor(x => x.DocumentName)
                .MaximumLength(200).WithMessage("Document name must not exceed 200 characters.");
            RuleFor(x => x.OriginalName)
                .MaximumLength(200).WithMessage("Original name must not exceed 200 characters.");
            RuleFor(x => x.DocumentUrl)
                .MaximumLength(500).WithMessage("Document URL must not exceed 500 characters.")
                .Must(url => Uri.IsWellFormedUriString(url, UriKind.RelativeOrAbsolute))
                .WithMessage("Document URL must be a valid URL or path.");

            RuleFor(x => x.ProductId)
                .NotEqual(Guid.Empty).WithMessage("Product ID must be a valid GUID.");
        }
    }
}
