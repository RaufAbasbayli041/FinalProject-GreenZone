using GreenZone.Contracts.Dtos.OrderStatus;
using GreenZone.Contracts.Service;
using GreenZone.Domain.Entity;
using GreenZone.Domain.Enum;
using GreenZone.Domain.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Application.Service
{
    public interface IOrderStatusService : IOrderStatusRepository
    {
        Task<ICollection<OrderStatusReadDto>> GetAllOrderStatusesAsync();
        Task<OrderStatusReadDto?> GetByNameAsync(OrderStatusName name);
        Task<OrderStatusReadDto?> ChangeOrderStatusAsync(Guid id);
    }
}
