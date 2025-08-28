using GreenZone.Application.Validations.Category;
using Microsoft.Extensions.DependencyInjection;
using GreenZone.Application.Validations;
using FluentValidation.AspNetCore;
using FluentValidation;
using GreenZone.Application.Validators.Product;
using GreenZone.Application.Validators.Customer;

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
            return services;
        }

    }
}
