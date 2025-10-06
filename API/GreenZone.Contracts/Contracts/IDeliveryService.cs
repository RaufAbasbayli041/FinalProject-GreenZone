using GreenZone.Contracts.Dtos.DeliveryDtos;
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
    public interface IDeliveryService : IGenericService<Delivery, DeliveryCreateDto, DeliveryReadDto, DeliveryUpdateDto>
    {
        Task<Delivery?> ChangeDeliveryStatusAsync(Guid deliveryId, DeliveryStatusType newStatus);
       
    }
}
