using AutoMapper;
using GreenZone.Contracts.Dtos.CategoryDtos;
using GreenZone.Contracts.Dtos.CustomerDtos;
using GreenZone.Contracts.Dtos.ProductDtos;
using GreenZone.Domain.Entity;
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
            CreateMap<ProductReadDto, Product>().ReverseMap();
            CreateMap<ProductUpdateDto, Product>().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // customer mappings
            CreateMap<CustomerCreateDto, Customer>().ForMember(dest => dest.User, opt => opt.Ignore()).ReverseMap();
            CreateMap<Customer, CustomerReadDto>()
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email))
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.User.FirstName))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.User.LastName))
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.User.Id))
                .ReverseMap();
            CreateMap<CustomerUpdateDto, Customer>().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
