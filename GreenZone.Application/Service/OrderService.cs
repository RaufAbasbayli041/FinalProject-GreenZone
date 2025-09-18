using AutoMapper;
using FluentValidation;
using GreenZone.Application.Exceptions;
using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Dtos.OrderDtos;
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
	public class OrderService : GenericService<Order, OrderCreateDto, OrderReadDto, OrderUpdateDto>, IOrderService
	{
		private readonly IOrderRepository _orderRepository;
		private readonly IBasketRepository _basketRepository;
		private readonly IUnitOfWork _unitOfWork;
		private readonly IOrderStatusRepository _orderStatusRepository;



		public OrderService(IOrderRepository orderRepository, IMapper mapper, IValidator<OrderCreateDto> createValidator, IValidator<OrderUpdateDto> updateValidator, IUnitOfWork unitOfWork, IBasketRepository basketRepository, IOrderStatusRepository orderStatusRepository) : base(orderRepository, mapper, createValidator, updateValidator, unitOfWork)
		{
			_orderRepository = orderRepository;
			_basketRepository = basketRepository;
			_unitOfWork = unitOfWork;
			_orderStatusRepository = orderStatusRepository;
		}

		public async Task<OrderReadDto> CancelOrderAsync(Guid orderId)
		{
			var data = await _orderRepository.GetByIdAsync(orderId);
			if (data == null)
				throw new NotFoundException("Order not found.");
			var cancelledStatus = await _orderStatusRepository.GetByNameAsync(OrderStatusName.Cancelled);
			if (cancelledStatus == null)
				throw new NotFoundException("Cancelled status not found. Please ensure it exists in the database.");
			data.OrderStatus = cancelledStatus;
			await _unitOfWork.SaveChangesAsync();
			return _mapper.Map<OrderReadDto>(data);

		}

		public async Task<OrderReadDto> CreateOrderByBasketIdAsync(Guid basketId, OrderCreateDto orderCreateDto)
		{
			if (basketId == Guid.Empty)
				throw new NotFoundException("Basket Id cannot be empty.");

			var excistingBasket = await _basketRepository.GetByIdAsync(basketId);

			if (excistingBasket == null)
				throw new NotFoundException($"Basket not found.");

			if (excistingBasket.BasketItems == null || !excistingBasket.BasketItems.Any())
			{
				throw new InvalidOperationException("Cannot create an order from an empty basket.");
			}

			// Ensure the "Pending" status exists

			var pendingStatus = await _orderStatusRepository.GetByNameAsync(OrderStatusName.Pending);
			if (pendingStatus == null)
				throw new NotFoundException($"Order status 'Pending' not found. Please ensure it exists in the database.");

			// Create the order

			var order = new Order
			{
				Id = Guid.NewGuid(),
				CustomerId = excistingBasket.CustomerId,
				OrderDate = DateTime.UtcNow,
				ShippingAddress = orderCreateDto.ShippingAddress,
				TotalAmount = excistingBasket.TotalAmount,
				OrderStatus = pendingStatus, // Set to a default status, e.g., "Pending"
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

		public async Task<OrderReadDto> MarkAsDeliveredAsync(Guid orderId)
		{ 
			var order = ChangeOrderStatusAsync(orderId, OrderStatusName.Delivered);
			return await order;
		}

		public async Task<OrderReadDto> MarkAsProcessingAsync(Guid orderId)
		{ 
			var order = ChangeOrderStatusAsync(orderId, OrderStatusName.Processing);
			return await order;
		}

		public async Task<OrderReadDto> MarkAsReturnedAsync(Guid orderId)
		{
			var order = ChangeOrderStatusAsync(orderId, OrderStatusName.Returned);
			return await order;
		}

		public async Task<OrderReadDto> MarkAsShippedAsync(Guid orderId)
		{
			var order = ChangeOrderStatusAsync(orderId, OrderStatusName.Shipped);
			return await order;
		}

		public async Task<OrderReadDto> SetStatusAsync(Guid orderId, Guid orderStatusId)
		{
			var order = await _orderRepository.GetByIdAsync(orderId);
			if (order == null)
				throw new NotFoundException("Order not found.");
			var status = await _orderStatusRepository.GetByIdAsync(orderStatusId);
			if (status == null)
				throw new NotFoundException("Order status not found.");
			order.OrderStatus = status;
			await _unitOfWork.SaveChangesAsync();
			return _mapper.Map<OrderReadDto>(order);

		}
		private async Task<OrderReadDto> ChangeOrderStatusAsync(Guid orderId, OrderStatusName statusName)
		{
			var order = await _orderRepository.GetByIdAsync(orderId);
			if (order == null)
				throw new NotFoundException("Order not found.");

			var status = await _orderStatusRepository.GetByNameAsync(statusName);
			if (status == null)
				throw new NotFoundException($"Order status '{statusName}' not found.");

			order.OrderStatus = status;
			await _unitOfWork.SaveChangesAsync();

			return _mapper.Map<OrderReadDto>(order);
		}
	}
}
