using GreenZone.Domain.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Domain.Repository
{
    public interface ICustomerRepository : IGenericRepository<Customer>
    {   
        Task<Customer> GetCustomerWithOrdersAsync(Guid customerId);         
        Task<IEnumerable<Customer>> GetAllCustomersWithOrdersAsync(int page, int pageSize); 
        Task<Customer> GetCustomerFullDataAsync(Guid customerId);

    }
}
