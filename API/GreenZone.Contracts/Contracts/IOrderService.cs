using GreenZone.Contracts.Dtos.OrderDtos;
using GreenZone.Contracts.Service;
using GreenZone.Domain.Entity;
using GreenZone.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Contracts.Contracts
{
    public interface IOrderService : IGenericService<Order, OrderCreateDto, OrderReadDto, OrderUpdateDto>
    {
        Task<OrderReadDto> GetOrderWithDetailsAsync(Guid orderId);
        Task<IEnumerable<OrderReadDto>> GetAllOrdersFullData();
        Task<IEnumerable<OrderReadDto>> GetOrdersByOrderStatusIdAsync(Guid? orderStatusId, string? keyword, int pages = 1, int pageSize = 10);
        Task<OrderReadDto> CreateOrderByCustomerIdAsync(OrderCreateDto orderCreateDto);
		Task<OrderReadDto> MarkAsProcessingAsync(Guid orderId);  
		Task<OrderReadDto> MarkAsDeliveredAsync(Guid orderId);
		Task<OrderReadDto> CancelOrderAsync(Guid orderId);
        Task<OrderReadDto> ChangeOrderStatusAsync(Guid orderId, OrderStatusName statusName);
        Task<OrderReadDto> MarkAsReturnedAsync(Guid orderId);
        Task<IEnumerable<OrderReadDto>> GetOrdersByCustomerIdAsync(Guid customerId);




    }
}
