using GreenZone.Contracts.Dtos.OrderDtos;
using GreenZone.Contracts.Service;
using GreenZone.Domain.Entity;
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
        Task<ICollection<OrderReadDto>> GetAllOrdersFullData();
        Task<ICollection<OrderReadDto>> GetOrdersByOrderStatusIdAsync(Guid? orderStatusId, string? keyword, int pages = 1, int pageSize = 10);
        Task<OrderReadDto> CreateOrderByBasketIdAsync(Guid basketId, OrderCreateDto orderCreateDto);
        Task<OrderReadDto> SetStatusAsync(Guid orderId, Guid orderStatusId);
		Task<OrderReadDto> MarkAsProcessingAsync(Guid orderId);  
		Task<OrderReadDto> MarkAsDeliveredAsync(Guid orderId);
		Task<OrderReadDto> CancelOrderAsync(Guid orderId);
		Task<OrderReadDto> MarkAsReturnedAsync(Guid orderId);


	}
}
