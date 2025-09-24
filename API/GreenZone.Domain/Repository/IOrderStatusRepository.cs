using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GreenZone.Domain.Entity;
using GreenZone.Domain.Enum;

namespace GreenZone.Domain.Repository
{
    public interface IOrderStatusRepository : IGenericRepository<OrderStatus>
    {
        Task <OrderStatus> GetOrderStatusDetail (OrderStatus orderStatus);
        Task <ICollection<OrderStatus>> GetAllOrderStatusDetails ();

        Task<OrderStatus> GetByNameAsync(OrderStatusName name);

	}
}
