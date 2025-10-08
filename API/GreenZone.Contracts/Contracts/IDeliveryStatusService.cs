using GreenZone.Contracts.Dtos.DeliveryStatusDtos;
using GreenZone.Contracts.Service;
using GreenZone.Domain.Entity;
using GreenZone.Domain.Enum;
using GreenZone.Domain.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Contracts.Contracts
{
    public interface IDeliveryStatusService
    { 
        Task<DeliveryStatusReadDto?> GetDeliveryStatusByTypeAsync(DeliveryStatusType type);
        Task<IEnumerable<DeliveryStatusReadDto>?> GetAllAsync();


    }
}
