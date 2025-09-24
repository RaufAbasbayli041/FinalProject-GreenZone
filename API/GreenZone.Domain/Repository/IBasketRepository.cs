using GreenZone.Domain.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Domain.Repository
{
    public interface IBasketRepository : IGenericRepository<Basket>
    {
        Task<Basket> GetBasketByCustomerAsync(Guid customerId);
        Task ClearBasketAsync(Guid customerId);
    }
}
