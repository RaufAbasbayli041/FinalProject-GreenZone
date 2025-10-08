using AutoMapper;
using GreenZone.Contracts.Dtos.BasketDtos;
using GreenZone.Contracts.Dtos.BasketItemsDtos;
using GreenZone.Contracts.Dtos.CategoryDtos;
using GreenZone.Contracts.Dtos.CustomerDtos;
using GreenZone.Contracts.Dtos.DeliveryDtos;
using GreenZone.Contracts.Dtos.DeliveryStatusDtos;
using GreenZone.Contracts.Dtos.OrderDtos;
using GreenZone.Contracts.Dtos.OrderItemDto;
using GreenZone.Contracts.Dtos.PaymentDto;
using GreenZone.Contracts.Dtos.ProductDtos;
using GreenZone.Domain.Entity;
using GreenZone.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Application.Profiles
{
    public class CustomProfile : Profile
    {
        public CustomProfile()
        {
            // category mappings
            CreateMap<CategoryCreateDto, Category>().ReverseMap();
            CreateMap<Category, CategoryReadDto>().ForMember(dest => dest.ProductIds, opt => opt.MapFrom(src => src.Products.Select(p => p.Id).ToList()));
            CreateMap<CategoryReadDto, Category>()
                 .ForMember(dest => dest.Products,
                  opt => opt.Ignore());
            CreateMap<CategoryUpdateDto, Category>().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // product mappings
            CreateMap<ProductCreateDto, Product>().ReverseMap();
            CreateMap<Product, ProductReadDto>()
                 .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : string.Empty))
                   .ForMember(dest => dest.Documents, opt => opt.MapFrom(src => src.Documents != null ? src.Documents.Select(d => d.DocumentUrl).ToList() : new List<string>()));

            CreateMap<ProductUpdateDto, Product>().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // customer mappings
            CreateMap<CustomerCreateDto, Customer>().ForMember(dest => dest.User, opt => opt.Ignore()).ReverseMap();
            CreateMap<Customer, CustomerReadDto>()
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email))
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.User.FirstName))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.User.LastName))
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.User.Id))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.UserName))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.User.PhoneNumber))

                .ReverseMap();
            CreateMap<CustomerUpdateDto, Customer>().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            ;

            // order mappings
            CreateMap<OrderCreateDto, Order>().ReverseMap();
            CreateMap<OrderReadDto, Order>().ReverseMap();
            CreateMap<OrderUpdateDto, Order>().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // order item mappings
            CreateMap<OrderItemCreateDto, OrderItem>().ReverseMap();
            CreateMap<OrderITemReadDto, OrderItem>().ReverseMap();
            CreateMap<OrderItemUpdateDto, OrderItem>().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // payment mappings
            CreateMap<PaymentCreateDto, Payment>()
               .ForMember(dest => dest.PaymentDate, opt => opt.MapFrom(_ => DateTime.UtcNow))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(_ => PaymentStatus.Pending));
            CreateMap<Payment, PaymentReadDto>()
                .ForMember(dest => dest.PaymentMethodName, opt => opt.MapFrom(src => src.PaymentMethod.Name))
                .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => src.Customer.User.FirstName + " " + src.Customer.User.LastName));
            CreateMap<PaymentUpdateDto, Payment>().ReverseMap();

            // basket mapping
            CreateMap<Basket, BasketReadDto>()
                .ForMember(dest => dest.CustomerId, opt => opt.MapFrom(src => src.CustomerId))
                .ForMember(dest => dest.BasketItems, opt => opt.MapFrom(src => src.BasketItems))
                .ReverseMap();

            // basket items mapping
            CreateMap<BasketItems, BasketItemsReadDto>()
                .ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => src.ProductId))
                .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Quantity))
             .ForMember(dest => dest.TotalPrice, opt => opt.MapFrom(src => src.Product != null ? src.Product.PricePerSquareMeter * src.Quantity : 0))
                .ForMember(dest => dest.ProductTitle, opt => opt.MapFrom(src => src.Product.Title))
                .ForMember(dest => dest.ProductImageUrl, opt => opt.MapFrom(src => src.Product.ImageUrl))
                .ReverseMap();

            CreateMap<BasketItemsCreateDto, BasketItems>()
                    .ForMember(dest => dest.Basket, opt => opt.Ignore())
                    .ForMember(dest => dest.Product, opt => opt.Ignore());

            CreateMap<BasketItemsUpdateDto, BasketItems>().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // delivery mappings
            CreateMap<Delivery, DeliveryReadDto>()
            .ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => src.DeliveryStatus.Name));
            CreateMap<DeliveryCreateDto, Delivery>();
            CreateMap<DeliveryUpdateDto, Delivery>();

            // DeliveryStatus
            CreateMap<DeliveryStatus, DeliveryStatusReadDto>();
         

        }
    }
}
