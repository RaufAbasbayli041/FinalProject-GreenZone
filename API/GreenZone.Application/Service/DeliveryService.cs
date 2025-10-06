using AutoMapper;
using FluentValidation;
using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Dtos.DeliveryDtos;
using GreenZone.Domain.Entity;
using GreenZone.Domain.Enum;
using GreenZone.Domain.Repository;
using Microsoft.EntityFrameworkCore;
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
        private readonly IDeliveryStatusService _deliveryStatusService;
        private readonly IUnitOfWork _unitOfWork;

        public DeliveryService(
            IGenericRepository<Delivery> repository,
            IMapper mapper,
            IValidator<DeliveryCreateDto> createValidator,
            IValidator<DeliveryUpdateDto> updateValidator,
            IUnitOfWork unitOfWork,
            IDeliveryRepository deliveryRepository,
            IDeliveryStatusService deliveryStatusService
            ) : base(repository, mapper, createValidator, updateValidator, unitOfWork)
        {
            _deliveryRepository = deliveryRepository;
            _unitOfWork = unitOfWork;
            _deliveryStatusService = deliveryStatusService;
        }

        public async Task<Delivery?> ChangeDeliveryStatusAsync(Guid deliveryId, DeliveryStatusType newStatus)
        {
            var delivery = await _deliveryRepository.GetDeliveryByStatusIdAsync(deliveryId);
            if (delivery == null) return null;

            var statusDto = await _deliveryStatusService.GetDeliveryStatusByTypeAsync(newStatus);
            if (statusDto == null)
                throw new InvalidOperationException("Invalid delivery status type.");


            delivery.DeliveryStatusId = statusDto.Id;

            if (newStatus == DeliveryStatusType.Delivered)
                delivery.DeliveredAt = DateTime.UtcNow;

            await _unitOfWork.SaveChangesAsync();
            return delivery;
        }

    }


}
