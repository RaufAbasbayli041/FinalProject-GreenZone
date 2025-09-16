using FluentValidation;
using FluentValidation.AspNetCore;
using GreenZone.Application.Validations;
using GreenZone.Application.Validations.Category;
using GreenZone.Application.Validators;
using GreenZone.Application.Validators.Basket;
using GreenZone.Application.Validators.BasketItems;
using GreenZone.Application.Validators.Customer;
using GreenZone.Application.Validators.Order;
using GreenZone.Application.Validators.OrderITem;
using GreenZone.Application.Validators.Payment;
using GreenZone.Application.Validators.Product;
using GreenZone.Application.Validators.ProductDocuments;
using GreenZone.Domain.Entity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

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

            // basket validators
            services.AddValidatorsFromAssemblyContaining<BasketDtoValidator>();

			// basket item validators
            services.AddValidatorsFromAssemblyContaining<BasketItemsCreateDtoValidator>();
            services.AddValidatorsFromAssemblyContaining<BasketItemsUpdateDtoValidator>();



			return services;
        }

    }
}
