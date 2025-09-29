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
        private readonly IDeliveryStatusRepository _statusRepository;
        private readonly IUnitOfWork _unitOfWork;

        public DeliveryService(
            IGenericRepository<Delivery> repository,
            IMapper mapper,
            IValidator<DeliveryCreateDto> createValidator,
            IValidator<DeliveryUpdateDto> updateValidator,
            IUnitOfWork unitOfWork,
            IDeliveryRepository deliveryRepository,
            IDeliveryStatusRepository statusRepository
            ) : base(repository, mapper, createValidator, updateValidator, unitOfWork)
        {
            _deliveryRepository = deliveryRepository;
            _statusRepository = statusRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Delivery?> ChangeStatusAsync(Guid deliveryId, DeliveryStatusType newStatus)
        {
            var delivery = await _deliveryRepository.GetWithStatusByIdAsync(deliveryId);
            if (delivery == null) return null;

            var statuses = await _statusRepository.GetAllAsync();
            var newStatusEntity = statuses.FirstOrDefault(s => s.StatusType == newStatus);
            if (newStatusEntity == null) throw new Exception("Invalid status");

            delivery.DeliveryStatusId = newStatusEntity.Id;

            if (newStatus == DeliveryStatusType.Delivered)
                delivery.DeliveredAt = DateTime.UtcNow;

            await _unitOfWork.SaveChangesAsync();
            return delivery;
        }
    }


}
