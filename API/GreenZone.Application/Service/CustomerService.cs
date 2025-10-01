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

        public CustomerService(IGenericRepository<Customer> repository, IMapper mapper, IValidator<CustomerCreateDto> createValidator, IValidator<CustomerUpdateDto> updateValidator, UserManager<ApplicationUser> userManager, ICustomerRepository customerRepository, IUnitOfWork unitOfWork) : base(repository, mapper, createValidator, updateValidator, unitOfWork)
        {
            _userManager = userManager;
            _customerRepository = customerRepository;
        }
              

        public async Task<IEnumerable<CustomerReadDto>> GetAllCustomersWithOrdersAsync(int page, int pageSize)
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

        public override async Task<CustomerReadDto> GetByIdAsync(Guid customerId)
        {
            var data =  await _customerRepository.GetByIdAsync(customerId);
            var dto = _mapper.Map<CustomerReadDto> (data);
            return dto;
        }

        public override async Task<IEnumerable<CustomerReadDto>> GetAllAsync()
        {
            var datas = await _customerRepository.GetAllAsync();
            var dtos = _mapper.Map<IEnumerable<CustomerReadDto>>(datas);
            return dtos;
        }

        public async Task<CustomerReadDto> GetCustomerByUserIdAsync(string userId)
        { 
            var data = await  _customerRepository.GetCustomerByUserIdAsync(userId);
            var dto = _mapper.Map<CustomerReadDto>(data);
            return dto;
        }
    }
}
