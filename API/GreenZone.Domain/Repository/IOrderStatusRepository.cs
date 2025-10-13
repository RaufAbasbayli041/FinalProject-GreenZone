using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GreenZone.Domain.Entity;
using GreenZone.Domain.Enum;

namespace GreenZone.Domain.Repository
{
    public interface IOrderStatusRepository
    {
        Task<IEnumerable<OrderStatus>> GetAllAsync();
        Task<OrderStatus?> GetOrderStatusByType(OrderStatusName name);


    }
}
