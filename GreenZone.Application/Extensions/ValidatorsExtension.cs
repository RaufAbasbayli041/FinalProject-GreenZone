using GreenZone.Application.Validations.Category;
using Microsoft.Extensions.DependencyInjection;
using GreenZone.Application.Validations;
using FluentValidation.AspNetCore;
using FluentValidation;
using GreenZone.Application.Validators.Product;
using GreenZone.Application.Validators.Customer;
using GreenZone.Application.Validators.ProductDocuments;
using GreenZone.Application.Validators.Order;
using GreenZone.Application.Validators.OrderITem;
using GreenZone.Application.Validators.Payment;

namespace GreenZone.Application.Extensions
{
    public static class ValidatorsExtension
    {
        public static IServiceCollection AddValidatorsRegistration(this IServiceCollection services)
        { 
            services.AddFluentValidationAutoValidation();
            // category validators
            services.AddValidatorsFromAssemblyContaining<CategoryCreateDtoValidator>();
            services.AddValidatorsFromAssemblyContaining<CategoryUpdateDtoValidator>();

            // product validators
            services.AddValidatorsFromAssemblyContaining<ProductCreateDtoValidator>();
            services.AddValidatorsFromAssemblyContaining<ProductUpdateDtoValidator>();

            // customer validators
            services.AddValidatorsFromAssemblyContaining<CustomerCreateDtoValidator>();
            services.AddValidatorsFromAssemblyContaining<CustomerUpdateDtoValidator>();

            // product documents validators
            services.AddValidatorsFromAssemblyContaining<ProductDocumentsCreateDtoValidator>();
            services.AddValidatorsFromAssemblyContaining<ProductDocumentsUpdateDtoValidator>();

            // order validators
            services.AddValidatorsFromAssemblyContaining<OrderCreateDtoValidator>();
            services.AddValidatorsFromAssemblyContaining<OrderUpdateDtoValidator>();

            // order item validators
            services.AddValidatorsFromAssemblyContaining<OrderItemCreateDtoValidator>();

			// payment validators
            services.AddValidatorsFromAssemblyContaining<PaymentUpdateDtoValidator>();
            services.AddValidatorsFromAssemblyContaining<PaymentCreateDtoValidator>();

			return services;
        }

    }
}
