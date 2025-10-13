using GreenZone.Application.Service;
using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Service;
using GreenZone.Domain.Repository;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Application.Extensions
{
    public static class ServiceExtension
    {
        public static IServiceCollection AddServiceRegistration(this IServiceCollection services)
        {
            services.AddScoped(typeof(IGenericService<,,,>), typeof(GenericService<,,,>));
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<ICustomerService, CustomerService>();
            services.AddScoped<IAuthService,AuthService>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<IOrderStatusService, OrderStatusService>(); 
            services.AddScoped<IEmailSenderOpt, EmailSenderOpt>();
			services.AddScoped<IPaymentService, PaymentService>();
            services.AddScoped<IBasketService, BasketService>();
            services.AddScoped<IDeliveryService, DeliveryService>();
            services.AddScoped<IDeliveryStatusService, DeliveryStatusService>();

            return services;

        }
    }
}
