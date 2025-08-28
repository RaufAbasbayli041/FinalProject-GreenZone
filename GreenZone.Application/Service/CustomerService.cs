using AutoMapper;
using FluentValidation;
using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Dtos;
using GreenZone.Contracts.Dtos.CustomerDtos;
using GreenZone.Domain.Entity;
using GreenZone.Domain.Repository;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Application.Service
{
    public class CustomerService : GenericService<Customer, CustomerCreateDto, CustomerReadDto, CustomerUpdateDto>, ICustomerService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ICustomerRepository _customerRepository;

        public CustomerService(IGenericRepository<Customer> repository, IMapper mapper, IValidator<CustomerCreateDto> createValidator, IValidator<CustomerUpdateDto> updateValidator, UserManager<ApplicationUser> userManager, ICustomerRepository customerRepository) : base(repository, mapper, createValidator, updateValidator)
        {
            _userManager = userManager;
            _customerRepository = customerRepository;
        }

        public override async Task<CustomerReadDto> AddAsync(CustomerCreateDto dto)
        {
            var user = new ApplicationUser()
            {
                UserName = dto.Email.Split("@")[0],
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                PhoneNumber = dto.PhoneNumber,

            };
            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new Exception($"Failed to create user: {errors}");
            }

            var customer = _mapper.Map<Customer>(dto);
            customer.UserId = user.Id;
            var addedCustomer = await _repository.AddAsync(customer);
            var readDto = _mapper.Map<CustomerReadDto>(addedCustomer);
            return readDto;
        }

        public async Task<IEnumerable<CustomerReadDto>> GetAllCustomersWithOrdersAsync(int page = 1, int pageSize = 10)
        {
            var customers = await _customerRepository.GetAllCustomersWithOrdersAsync(page, pageSize);
            var customerDtos = _mapper.Map<IEnumerable<CustomerReadDto>>(customers);
            return customerDtos;
        }

        public async Task<CustomerReadDto> GetCustomerFullDataAsync(Guid customerId)
        {
            var data = await _customerRepository.GetCustomerFullDataAsync(customerId);
            var dto = _mapper.Map<CustomerReadDto>(data);
            return dto;
        }

        public async Task<CustomerReadDto> GetCustomerWithOrdersAsync(Guid customerId)
        {
            var data =  await _customerRepository.GetCustomerWithOrdersAsync(customerId);
            var dto = _mapper.Map<CustomerReadDto> (data);
            return dto;
        }
    }
}
