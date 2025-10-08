using AutoMapper;
using FluentValidation;
using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Dtos.DeliveryDtos;
using GreenZone.Domain.Entity;
using GreenZone.Domain.Enum;
using GreenZone.Domain.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Application.Service
{
    public class DeliveryService : IDeliveryService
    {
        private readonly IDeliveryRepository _deliveryRepository;
        private readonly IDeliveryStatusService _deliveryStatusService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<DeliveryService> _logger;

        public DeliveryService(IDeliveryRepository deliveryRepository, IDeliveryStatusService deliveryStatusService, IUnitOfWork unitOfWork, IMapper mapper, ILogger<DeliveryService> logger)
        {
            _deliveryRepository = deliveryRepository;
            _deliveryStatusService = deliveryStatusService;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }


        public async Task<Delivery?> ChangeDeliveryStatusAsync(DeliveryStatusType oldStatus, DeliveryStatusType newStatus)
        {
            var delivery = await _deliveryRepository.GetDeliveryByStatusAsync(oldStatus);
            if (delivery == null)
                return null;

            var statusDto = await _deliveryStatusService.GetDeliveryStatusByTypeAsync(newStatus);
            if (statusDto == null)
                throw new InvalidOperationException("Invalid delivery status type.");


            delivery.DeliveryStatusId = statusDto.Id;
            if (newStatus == DeliveryStatusType.Delivered)
            {
                delivery.DeliveredAt = DateTime.UtcNow;
            }


            _logger.LogInformation("Changing delivery {DeliveryId} status from {OldStatus} to {NewStatus}", delivery.Id, oldStatus, newStatus);
            await _deliveryRepository.UpdateAsync(delivery);

            await _unitOfWork.SaveChangesAsync();
            return delivery;
        }

        public async Task<DeliveryReadDto?> GetDeliveryByStatusAsync(DeliveryStatusType deliveryStatus)
        {
            var delivery = await _deliveryRepository.GetDeliveryByStatusAsync(deliveryStatus);
            return _mapper.Map<DeliveryReadDto>(delivery);
        }

       
    }


}
