using AutoMapper;
using FluentValidation;
using GreenZone.Application.Exceptions;
using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Dtos.DeliveryDtos;
using GreenZone.Domain.Entity;
using GreenZone.Domain.Enum;
using GreenZone.Domain.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Application.Service
{
    public class DeliveryService : GenericService<Delivery, DeliveryCreateDto, DeliveryReadDto, DeliveryUpdateDto>, IDeliveryService
    {
        private readonly IDeliveryRepository _deliveryRepository;
        private readonly IDeliveryStatusRepository _deliveryStatusRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<DeliveryService> _logger;

        public DeliveryService(IDeliveryRepository deliveryRepository, IDeliveryStatusRepository deliveryStatusRepository, IMapper mapper, IValidator<DeliveryCreateDto> createValidator, IValidator<DeliveryUpdateDto> updateValidator, IUnitOfWork unitOfWork, ILogger<DeliveryService> logger) : base(deliveryRepository, mapper, createValidator, updateValidator, unitOfWork)
        {
            _deliveryRepository = deliveryRepository;
            _deliveryStatusRepository = deliveryStatusRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<Delivery?> ChangeDeliveryStatusAsync(Guid deliveryId, DeliveryStatusType newStatus)
        {

            var delivery = await _deliveryRepository.GetByIdAsync(deliveryId);
            if (delivery == null)
                return null;
             

            var newStatusEntity = await _deliveryStatusRepository.GetDeliveryStatusByTypeAsync(newStatus);
            if (newStatusEntity == null)
                throw new InvalidOperationException("Invalid delivery status type.");

            delivery.DeliveryStatusId = newStatusEntity.Id;
            if (newStatus == DeliveryStatusType.Delivered)
            {
                delivery.DeliveredAt = DateTime.UtcNow;
            }


            _logger.LogInformation("Changing delivery {DeliveryId} status to {NewStatus}", delivery.Id, newStatus);
            await _deliveryRepository.UpdateAsync(delivery);

            await _unitOfWork.SaveChangesAsync();
            return delivery;
        }

        public async Task<IEnumerable<DeliveryReadDto>> GetAllDeliveriesByStatusAsync(DeliveryStatusType deliveryStatus)
        {
            var deliveries = await _deliveryRepository.GetAllDeliveriesByStatusAsync(deliveryStatus);
            var deliveryReadDtos = _mapper.Map<IEnumerable<DeliveryReadDto>>(deliveries);
            return deliveryReadDtos;
        }

        public async Task<DeliveryReadDto?> GetDeliveryByStatusAsync(DeliveryStatusType deliveryStatus)
        {
            var delivery = await _deliveryRepository.GetDeliveryByStatusAsync(deliveryStatus);
            return _mapper.Map<DeliveryReadDto>(delivery);
        }

        public async Task<DeliveryReadDto?> CreateDeliveryAsync(DeliveryCreateDto deliveryCreateDto)
        {
             
            var createdStatus = await _deliveryStatusRepository.GetDeliveryStatusByTypeAsync(DeliveryStatusType.Created);
            if (createdStatus == null)
            {
                throw new NotFoundException("Delivery status not found.");
            }
            var delivery = _mapper.Map<Delivery>(deliveryCreateDto);

            delivery.DeliveryStatusId = createdStatus.Id;
            delivery.CreatedAt = DateTime.UtcNow;

            var createdDelivery = await _deliveryRepository.AddAsync(delivery);
            await _unitOfWork.SaveChangesAsync();
            _logger.LogInformation("Created new delivery with ID {DeliveryId} for Order ID {OrderId}", createdDelivery.Id, createdDelivery.OrderId);

            return _mapper.Map<DeliveryReadDto>(createdDelivery);
        }

        public async Task<IEnumerable<DeliveryReadDto>> GetDeliveriesByCustomerIdAsync(Guid customerId)
        {
            if (customerId == Guid.Empty)
            {
               throw new NotFoundException("Customer ID cannot be null or empty");
            }

            var deliveries = await _deliveryRepository.GetDeliveriesByCustomerIdAsync(customerId);
            return _mapper.Map<IEnumerable<DeliveryReadDto>>(deliveries);
        }

        public override async Task<IEnumerable<DeliveryReadDto>> GetAllAsync()
        {
            var deliveries =await _deliveryRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<DeliveryReadDto>>(deliveries);
        }
    }


}
