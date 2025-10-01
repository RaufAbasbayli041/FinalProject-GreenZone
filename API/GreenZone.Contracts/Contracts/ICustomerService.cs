using GreenZone.Contracts.Dtos;
using GreenZone.Contracts.Dtos.CustomerDtos;
using GreenZone.Contracts.Service;
using GreenZone.Domain.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Contracts.Contracts
{
    public interface ICustomerService : IGenericService<Customer,CustomerCreateDto,CustomerReadDto,CustomerUpdateDto>
    { 
        Task<IEnumerable<CustomerReadDto>> GetAllCustomersWithOrdersAsync(int page , int pageSize );
        Task<CustomerReadDto> GetCustomerFullDataAsync(Guid customerId);
        Task<CustomerReadDto> GetCustomerByUserIdAsync(string userId);

    }
}
