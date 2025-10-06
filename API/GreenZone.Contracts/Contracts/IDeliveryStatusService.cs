using GreenZone.Contracts.Dtos.DeliveryStatusDtos;
using GreenZone.Contracts.Service;
using GreenZone.Domain.Entity;
using GreenZone.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Contracts.Contracts
{
    public interface IDeliveryStatusService : IGenericService<DeliveryStatus, DeliveryStatusCreateDto, DeliveryStatusReadDto, DeliveryStatusUpdateDto>
    {
        Task<DeliveryStatusReadDto> UpdateStatusAsync(Guid id, DeliveryStatusUpdateDto dto);
        Task<bool> DeleteStatusAsync(Guid id);
        Task<DeliveryStatusReadDto?> GetDeliveryStatusByTypeAsync(DeliveryStatusType type);

    }
}
