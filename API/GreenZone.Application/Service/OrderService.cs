using AutoMapper;
using FluentValidation;
using GreenZone.Application.Exceptions;
using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Dtos.OrderDtos;
using GreenZone.Domain.Entity;
using GreenZone.Domain.Enum;
using GreenZone.Domain.Repository;
using Microsoft.Extensions.Logging;

namespace GreenZone.Application.Service
{
    public class OrderService : GenericService<Order, OrderCreateDto, OrderReadDto, OrderUpdateDto>, IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IBasketRepository _basketRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOrderStatusRepository _orderStatusRepository;
        private readonly ILogger<OrderService> _logger;

        public OrderService(
            IOrderRepository orderRepository,
            IMapper mapper,
            IValidator<OrderCreateDto> createValidator,
            IValidator<OrderUpdateDto> updateValidator,
            IUnitOfWork unitOfWork,
            IBasketRepository basketRepository,
            IOrderStatusRepository orderStatusRepository,
            ILogger<OrderService> logger)
            : base(orderRepository, mapper, createValidator, updateValidator, unitOfWork)
        {
            _orderRepository = orderRepository;
            _basketRepository = basketRepository;
            _unitOfWork = unitOfWork;
            _orderStatusRepository = orderStatusRepository;
            _logger = logger;
        }

        public async Task<OrderReadDto> CreateOrderByBasketIdAsync(Guid basketId, OrderCreateDto orderCreateDto)
        {
            if (basketId == Guid.Empty)
                throw new NotFoundException("Basket Id cannot be empty.");

            var excistingBasket = await _basketRepository.GetByIdAsync(basketId);

            if (excistingBasket == null)
            {
                _logger.LogWarning("Attempted to create order for non-existing basket {BasketId}", basketId);
                throw new NotFoundException("Basket not found.");
            }

            if (excistingBasket.BasketItems == null || !excistingBasket.BasketItems.Any())
            {
                _logger.LogWarning("Attempted to create order from empty basket {BasketId}", basketId);
                throw new InvalidOperationException("Cannot create an order from an empty basket.");
            }

            var pendingStatus = await _orderStatusRepository.GetByNameAsync(OrderStatusName.Pending);
            if (pendingStatus == null)
            {
                _logger.LogError("Order status 'Pending' not found in DB when creating order for basket {BasketId}", basketId);
                throw new NotFoundException("Order status 'Pending' not found. Please ensure it exists in the database.");
            }

            var order = new Order
            {
                Id = Guid.NewGuid(),
                CustomerId = excistingBasket.CustomerId,
                OrderDate = DateTime.UtcNow,
                ShippingAddress = orderCreateDto.ShippingAddress,
                TotalAmount = excistingBasket.TotalAmount,
                OrderStatus = pendingStatus,
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

            _logger.LogInformation("Order {OrderId} created successfully from basket {BasketId}", order.Id, basketId);

            return _mapper.Map<OrderReadDto>(order);
        }

        public async Task<OrderReadDto> CancelOrderAsync(Guid orderId)
        {
            var data = await _orderRepository.GetByIdAsync(orderId);
            if (data == null)
            {
                _logger.LogWarning("Cancel attempt failed. Order {OrderId} not found", orderId);
                throw new NotFoundException("Order not found.");
            }

            var cancelledStatus = await _orderStatusRepository.GetByNameAsync(OrderStatusName.Cancelled);
            if (cancelledStatus == null)
            {
                _logger.LogError("Cancelled status not found when canceling order {OrderId}", orderId);
                throw new NotFoundException("Cancelled status not found. Please ensure it exists in the database.");
            }

            data.OrderStatus = cancelledStatus;
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Order {OrderId} was canceled", orderId);

            return _mapper.Map<OrderReadDto>(data);
        }

        public async Task<ICollection<OrderReadDto>> GetAllOrdersFullData()
        {
            var datas = await _orderRepository.GetAllOrdersFullData();
            _logger.LogInformation("Retrieved {Count} orders with full data", datas.Count);
            return _mapper.Map<ICollection<OrderReadDto>>(datas);
        }

        public async Task<ICollection<OrderReadDto>> GetOrdersByOrderStatusIdAsync(Guid? orderStatusId, string? keyword, int pages = 1, int pageSize = 10)
        {
            var datas = await _orderRepository.GetOrdersByOrderStatusIdAsync(orderStatusId, keyword, pages, pageSize);
            _logger.LogInformation("Retrieved {Count} orders with status {StatusId} and keyword {Keyword}", datas.Count, orderStatusId, keyword);
            return _mapper.Map<ICollection<OrderReadDto>>(datas);
        }

        public async Task<OrderReadDto> GetOrderWithDetailsAsync(Guid orderId)
        {
            if (orderId == Guid.Empty)
                throw new ArgumentException("Order ID cannot be empty.", nameof(orderId));

            var data = await _orderRepository.GetByIdAsync(orderId);

            if (data == null)
            {
                _logger.LogWarning("Attempted to get details for non-existing order {OrderId}", orderId);
                throw new NotFoundException("Order not found.");
            }

            _logger.LogInformation("Retrieved details for order {OrderId}", orderId);

            return _mapper.Map<OrderReadDto>(data);
        }

        public async Task<OrderReadDto> MarkAsDeliveredAsync(Guid orderId)
        {
            var order = await ChangeOrderStatusAsync(orderId, OrderStatusName.Delivered);
            _logger.LogInformation("Order {OrderId} was delivered", orderId);
            return order;
        }

        public async Task<OrderReadDto> MarkAsProcessingAsync(Guid orderId)
        {
            var order = await ChangeOrderStatusAsync(orderId, OrderStatusName.Processing);
            _logger.LogInformation("Order {OrderId} is processing", orderId);
            return order;
        }

        public async Task<OrderReadDto> MarkAsReturnedAsync(Guid orderId)
        {
            var order = await ChangeOrderStatusAsync(orderId, OrderStatusName.Returned);
            _logger.LogInformation("Order {OrderId} was returned", orderId);
            return order;
        }

        public async Task<OrderReadDto> MarkAsShippedAsync(Guid orderId)
        {
            var order = await ChangeOrderStatusAsync(orderId, OrderStatusName.Shipped);
            _logger.LogInformation("Order {OrderId} was shipped", orderId);
            return order;
        }

        public async Task<OrderReadDto> SetStatusAsync(Guid orderId, Guid orderStatusId)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null)
            {
                _logger.LogWarning("SetStatus failed. Order {OrderId} not found", orderId);
                throw new NotFoundException("Order not found.");
            }

            var status = await _orderStatusRepository.GetByIdAsync(orderStatusId);
            if (status == null)
            {
                _logger.LogError("SetStatus failed. Order status {OrderStatusId} not found for order {OrderId}", orderStatusId, orderId);
                throw new NotFoundException("Order status not found.");
            }

            order.OrderStatus = status;
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Order {OrderId} status set to {OrderStatusId}", orderId, orderStatusId);

            return _mapper.Map<OrderReadDto>(order);
        }

        private async Task<OrderReadDto> ChangeOrderStatusAsync(Guid orderId, OrderStatusName statusName)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null)
            {
                _logger.LogWarning("ChangeOrderStatus failed. Order {OrderId} not found", orderId);
                throw new NotFoundException("Order not found.");
            }

            var status = await _orderStatusRepository.GetByNameAsync(statusName);
            if (status == null)
            {
                _logger.LogError("ChangeOrderStatus failed. Status {StatusName} not found for order {OrderId}", statusName, orderId);
                throw new NotFoundException($"Order status '{statusName}' not found.");
            }

            order.OrderStatus = status;
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Order {OrderId} status changed to {StatusName}", orderId, statusName);

            return _mapper.Map<OrderReadDto>(order);
        }
    }
}
