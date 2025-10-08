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
    public interface IDeliveryService 
    {       
        Task<DeliveryReadDto?> GetDeliveryByStatusAsync(DeliveryStatusType deliveryStatus);
        Task<Delivery?> ChangeDeliveryStatusAsync(DeliveryStatusType oldStatus, DeliveryStatusType newStatus);
    }
}
