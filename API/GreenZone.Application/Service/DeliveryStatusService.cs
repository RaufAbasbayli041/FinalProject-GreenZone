using AutoMapper;
using FluentValidation;
using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Dtos.DeliveryStatusDtos;
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
    public class DeliveryStatusService : GenericService<DeliveryStatus, DeliveryStatusCreateDto, DeliveryStatusReadDto, DeliveryStatusUpdateDto>, IDeliveryStatusService
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly IDeliveryStatusRepository _deliveryStatusRepository;


        public DeliveryStatusService(
            IGenericRepository<DeliveryStatus> repository,
            IMapper mapper,
            IValidator<DeliveryStatusCreateDto> createValidator,
            IValidator<DeliveryStatusUpdateDto> updateValidator,
            IUnitOfWork unitOfWork,
            IDeliveryStatusRepository deliveryStatusRepository) : base(repository, mapper, createValidator, updateValidator, unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _deliveryStatusRepository = deliveryStatusRepository;
        }

        public async Task<bool> DeleteStatusAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return false;

            if (entity.StatusType == DeliveryStatusType.Delivered)
                throw new InvalidOperationException("Cannot delete status 'Delivered'");

            return await base.DeleteAsync(id);
        }

        public async Task<DeliveryStatusReadDto> UpdateStatusAsync(Guid id, DeliveryStatusUpdateDto dto)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return null;

            if (entity.StatusType == DeliveryStatusType.Delivered)
                throw new InvalidOperationException("Cannot update status 'Delivered'");

            return await base.UpdateAsync(id, dto);
        }
        public async Task<DeliveryStatusReadDto?> GetByTypeAsync(DeliveryStatusType type)
        {
            var entity = await _deliveryStatusRepository.GetByStatusTypeAsync(type);
            if (entity == null) return null;
            return _mapper.Map<DeliveryStatusReadDto>(entity);
        }

    }
}
