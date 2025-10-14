using AutoMapper;
using FluentValidation;
using GreenZone.Application.Exceptions;
using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Dtos.DeliveryDtos;
using GreenZone.Contracts.Dtos.OrderDtos;
using GreenZone.Domain.Entity;
using GreenZone.Domain.Enum;
using GreenZone.Domain.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Xml.Linq;

namespace GreenZone.Application.Service
{
    public class OrderService : GenericService<Order, OrderCreateDto, OrderReadDto, OrderUpdateDto>, IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IOrderItemsRepository _orderItemsRepository;
        private readonly IBasketRepository _basketRepository;
        private readonly IOrderStatusRepository _orderStatusRepository;
        private readonly IDeliveryService _deliveryService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<OrderService> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public OrderService(
            IOrderRepository orderRepository,
            IMapper mapper,
            IValidator<OrderCreateDto> createValidator,
            IValidator<OrderUpdateDto> updateValidator,
            IUnitOfWork unitOfWork,
            IBasketRepository basketRepository,
            IOrderStatusRepository orderStatusRepository,
            ILogger<OrderService> logger,
            IDeliveryService deliveryService,
            IOrderItemsRepository orderItemsRepository,
            IHttpContextAccessor httpContextAccessor)
            : base(orderRepository, mapper, createValidator, updateValidator, unitOfWork)
        {
            _orderRepository = orderRepository;
            _basketRepository = basketRepository;
            _unitOfWork = unitOfWork;
            _orderStatusRepository = orderStatusRepository;
            _logger = logger;
            _deliveryService = deliveryService;
            _orderItemsRepository = orderItemsRepository;
            _httpContextAccessor = httpContextAccessor;
        }


        public async Task<OrderReadDto> CreateOrderByBasketIdAsync(Guid basketId, OrderCreateDto orderCreateDto)
        {
            // get excisting Basket
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

            // create order with status Pending
            var pendingStatus = await _orderStatusRepository.GetOrderStatusByType(OrderStatusName.Pending);
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
                TotalAmount = excistingBasket.BasketItems.Sum(bi => bi.Quantity * bi.Product.PricePerSquareMeter),
                OrderStatus = pendingStatus,
            };

            await _orderRepository.AddAsync(order);
            await _unitOfWork.SaveChangesAsync();

            // map basket items to order items
            order.OrderItems = excistingBasket.BasketItems.Select(bi => new OrderItem
            {
                ProductId = bi.ProductId,
                Quantity = bi.Quantity,
                OrderId = order.Id,
            }).ToList();

            // save order items
            foreach (var item in order.OrderItems)
            {
                await _orderItemsRepository.AddAsync(item);
            }

            await _unitOfWork.SaveChangesAsync();

            // creare delivery for order
            var deliveryCreateDto = new DeliveryCreateDto
            {
                OrderId = order.Id,
                Address = orderCreateDto.ShippingAddress,
                DeliveryStatus = DeliveryStatusType.Created,
                CreatedAt = DateTime.UtcNow,
            };


            await _deliveryService.AddAsync(deliveryCreateDto);
            await _unitOfWork.SaveChangesAsync();

            // clear basket
            excistingBasket.BasketItems.Clear();
            await _basketRepository.UpdateAsync(excistingBasket);
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

            EnsureOrderOwnerOrAdmin(data.CustomerId);

            var cancelledStatus = await _orderStatusRepository.GetOrderStatusByType(OrderStatusName.Cancelled);
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
            var datas = await _orderRepository.GetAllAsync();
            _logger.LogInformation("Retrieved all orders. Count: {Count}", datas.Count());
            return _mapper.Map<ICollection<OrderReadDto>>(datas);
        }

        public async Task<ICollection<OrderReadDto>> GetOrdersByOrderStatusIdAsync(Guid? orderStatusId, string? keyword, int pages = 1, int pageSize = 10)
        {
            var datas = await _orderRepository.GetOrdersByOrderStatusAsync(orderStatusId, keyword, pages, pageSize);
            _logger.LogInformation("Retrieved {Count} orders with status {StatusId} and keyword {Keyword}", datas.Count, orderStatusId, keyword);
            return _mapper.Map<ICollection<OrderReadDto>>(datas);
        }

        public async Task<OrderReadDto> GetOrderWithDetailsAsync(Guid orderId)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);

            if (order == null)
            {
                _logger.LogWarning("Attempted to get details for non-existing order {OrderId}", orderId);
                throw new NotFoundException("Order not found.");
            }
            EnsureOrderOwnerOrAdmin(order.CustomerId);
                        
            _logger.LogInformation("Retrieved details for order {OrderId}", orderId);

            return _mapper.Map<OrderReadDto>(order);
        }

        public async Task<OrderReadDto> MarkAsDeliveredAsync(Guid orderId)
        {

            var order = await ChangeOrderStatusAsync(orderId, OrderStatusName.Delivered);
            var delivery = order.Deliveries.FirstOrDefault();
            if (delivery == null)
            {
                _logger.LogError("No delivery found for order {OrderId} when marking as delivered", orderId);
                throw new NotFoundException("Delivery not found for this order.");
            }
            await _deliveryService.ChangeDeliveryStatusAsync(delivery.Id, DeliveryStatusType.Delivered);
            _logger.LogInformation("Order {OrderId} was delivered", orderId);

            return order;

        }

        public async Task<OrderReadDto> MarkAsProcessingAsync(Guid orderId)
        {
            var order = await ChangeOrderStatusAsync(orderId, OrderStatusName.Processing);
            var delivery = order.Deliveries.FirstOrDefault();
            if (delivery == null)
            {
                _logger.LogError("No delivery found for order {OrderId} when marking as processing", orderId);
                throw new NotFoundException("Delivery not found for this order.");
            }
            _logger.LogInformation("Order {OrderId} is processing", orderId);

            await _deliveryService.ChangeDeliveryStatusAsync(delivery.Id, DeliveryStatusType.InTransit);
            return order;
        }

        public async Task<OrderReadDto> MarkAsReturnedAsync(Guid orderId)
        {
            var order = await ChangeOrderStatusAsync(orderId, OrderStatusName.Returned);
            var delivery = order.Deliveries.FirstOrDefault();
            if (delivery == null)
            {
                _logger.LogError("No delivery found for order {OrderId} when marking as returned", orderId);
                throw new NotFoundException("Delivery not found for this order.");
            }
            _logger.LogInformation("Order {OrderId} was returned", orderId);
            await _deliveryService.ChangeDeliveryStatusAsync(delivery.Id, DeliveryStatusType.Cancelled);
            return order;
        }

        public async Task<OrderReadDto> SetStatusAsync(Guid orderId, OrderStatusName name)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null)
            {
                _logger.LogWarning("SetStatus failed. Order {OrderId} not found", orderId);
                throw new NotFoundException("Order not found.");
            }


            var status = await _orderStatusRepository.GetOrderStatusByType(name);
            if (status == null)
            {
                _logger.LogError("SetStatus failed. Order status {OrderStatusName} not found for order {OrderId}", name, orderId);
                throw new NotFoundException("Order status not found.");
            }

            order.OrderStatus = status;
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Order {OrderId} status set to {OrderStatusName}", orderId, name);

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

            var status = await _orderStatusRepository.GetOrderStatusByType(statusName);
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

        private Guid GetCurrentUserId()
        {
            var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst("sub")?.Value;
            if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
            {
                _logger.LogWarning("Failed to retrieve or parse current user ID from claims.");
                throw new UnAuthorizedException("User is not authorized.");
            }
            return userId;
        }

        private void EnsureOrderOwnerOrAdmin(Guid customerId)
        {
            var user = _httpContextAccessor.HttpContext?.User;
            var currentUserId = GetCurrentUserId();
            if (user == null)
                throw new UnAuthorizedException("User not authorized.");

            if (user.IsInRole("Customer") && customerId != currentUserId)
                throw new UnAuthorizedException("You cannot access another user's order.");
                       
        }
    }
}
