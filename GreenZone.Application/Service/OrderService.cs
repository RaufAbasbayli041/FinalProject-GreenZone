using AutoMapper;
using FluentValidation;
using GreenZone.Application.Exceptions;
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
        private readonly IBasketRepository _basketRepository;
        private readonly IUnitOfWork _unitOfWork;


        public OrderService(IOrderRepository orderRepository, IMapper mapper, IValidator<OrderCreateDto> createValidator, IValidator<OrderUpdateDto> updateValidator, IUnitOfWork unitOfWork, IBasketRepository basketRepository) : base(orderRepository, mapper, createValidator, updateValidator, unitOfWork)
        {
            _orderRepository = orderRepository;
            _basketRepository = basketRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<OrderReadDto> CreateOrderByBasketIdAsync(Guid basketId, OrderCreateDto orderCreateDto)
        {
            if (basketId == Guid.Empty)
                throw new NotFoundException("Basket Id cannot be empty.");


            var excistingBasket = await _basketRepository.GetByIdAsync(basketId);
            if (excistingBasket == null)
                throw new NotFoundException($"Basket with ID {excistingBasket.Id} not found.");
            // Here you would typically have logic to create an order from the basket.
            var order = new Order
            {
                Id = Guid.NewGuid(),
                CustomerId = excistingBasket.CustomerId,
                OrderDate = DateTime.UtcNow,
                ShippingAddress = orderCreateDto.ShippingAddress,
                TotalAmount = excistingBasket.TotalAmount,
                OrderStatus = Guid.Parse(1), // Set to a default status, e.g., "Pending"
                OrderItems = excistingBasket.BasketItems.Select(bi => new OrderItem
                {
                    Id = Guid.NewGuid(),
                    ProductId = bi.ProductId,
                    Quantity = bi.Quantity,
                }).ToList()
            };
            await _orderRepository.AddAsync(order);
            await _unitOfWork.SaveChangesAsync();

            excistingBasket.BasketItems.Clear();
            await _unitOfWork.SaveChangesAsync();

            var dto = _mapper.Map<OrderReadDto>(order);
            return dto;


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
