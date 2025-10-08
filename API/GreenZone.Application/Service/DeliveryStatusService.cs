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
    public class DeliveryStatusService : IDeliveryStatusService
    {
        private readonly IDeliveryStatusRepository _deliveryStatusRepository;
        private readonly IMapper _mapper;

        public DeliveryStatusService(IDeliveryStatusRepository deliveryStatusRepository, IMapper mapper)
        {

            _deliveryStatusRepository = deliveryStatusRepository;
            _mapper = mapper;
        }
                  
        public async Task<IEnumerable<DeliveryStatusReadDto>?> GetAllAsync()
        {
            var deliveryStatuses = await _deliveryStatusRepository.GetAllAsync();
            var dtos =  _mapper.Map<IEnumerable<DeliveryStatusReadDto>>(deliveryStatuses);
            return dtos;
        }

        public async Task<DeliveryStatusReadDto?> GetDeliveryStatusByTypeAsync(DeliveryStatusType statusType)
        {
            var deliveryStatus = await _deliveryStatusRepository.GetDeliveryStatusByTypeAsync(statusType);
            var dto =  _mapper.Map<DeliveryStatusReadDto>(deliveryStatus);
            return dto; 
        }
    }
}
