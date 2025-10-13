using AutoMapper;
using FluentValidation;
using GreenZone.Application.Exceptions;
using GreenZone.Contracts.Dtos.OrderStatus;
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
    public class OrderStatusService : IOrderStatusService
    {
        private readonly IOrderStatusRepository _orderStatusRepository;
        private readonly IMapper _mapper;

        public OrderStatusService(IOrderStatusRepository orderStatusRepository, IMapper mapper)
        {
            _orderStatusRepository = orderStatusRepository;
            _mapper = mapper;
        }

        public async    Task<IEnumerable<OrderStatusReadDto>> GetAllAsync()
        { 
            var datas = await  _orderStatusRepository.GetAllAsync();
            if (datas == null || !datas.Any())
            {
                throw new NotFoundException("No order statuses found.");
            }
            return _mapper.Map<IEnumerable<OrderStatusReadDto>>(datas);
        }

        public async Task<OrderStatusReadDto?> GetOrderStatusByType(OrderStatusName name)
        {
            if (!Enum.IsDefined(typeof(OrderStatusName), name))
                throw new NotFoundException($"Invalid order status name: {name}");

            var data = await _orderStatusRepository.GetOrderStatusByType(name);
            if (data == null)
                throw new NotFoundException($"Order status with name {name} not found.");

            return _mapper.Map<OrderStatusReadDto>(data);
        }
    }
}
