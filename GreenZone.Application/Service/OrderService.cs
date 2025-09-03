using AutoMapper;
using FluentValidation;
using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Dtos.OrderDtos;
using GreenZone.Domain.Entity;
using GreenZone.Domain.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Application.Service
{
    public class OrderService : GenericService<Order, OrderCreateDto, OrderReadDto, OrderUpdateDto>, IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        public OrderService(IOrderRepository orderRepository, IMapper mapper, IValidator<OrderCreateDto> createValidator, IValidator<OrderUpdateDto> updateValidator) : base(orderRepository, mapper, createValidator, updateValidator)
        {
            _orderRepository = orderRepository;
        }

        public async Task<ICollection<OrderReadDto>> GetAllOrdersFullData()
        {
            var datas = await _orderRepository.GetAllOrdersFullData();
            return _mapper.Map<ICollection<OrderReadDto>>(datas);
        }

        public async Task<ICollection<OrderReadDto>> GetOrdersByOrderStatusIdAsync(Guid? orderStatusId, string? keyword, int pages = 1, int pageSize = 10)
        {

            var datas = await _orderRepository.GetOrdersByOrderStatusIdAsync(orderStatusId, keyword, pages, pageSize);
            return _mapper.Map<ICollection<OrderReadDto>>(datas);

        }

        public async Task<OrderReadDto> GetOrderWithDetailsAsync(Guid orderId)
        {
            if (orderId == Guid.Empty)
                throw new ArgumentException("Order ID cannot be empty.", nameof(orderId));

            var data = await _orderRepository.GetByIdAsync(orderId);
            return _mapper.Map<OrderReadDto>(data);
        }
    }
}
