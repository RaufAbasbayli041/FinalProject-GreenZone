using GreenZone.Contracts.Dtos.BasketDtos;
using GreenZone.Contracts.Dtos.BasketItemsDtos;
using GreenZone.Domain.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Contracts.Contracts
{
	public interface IBasketService
	{
		Task<BasketReadDto> GetBasketByCustomerAsync(Guid customerId);
        Task<BasketReadDto> AddItemstoBasketAsync(Guid customerId, BasketItemsCreateDto basketItemsCreateDto);
        Task<BasketReadDto> UpdateItemsInBasketAsync(Guid customerId, BasketItemsUpdateDto basketItemsUpdateDto);
		Task RemoveItemsFromBasketAsync(Guid customerId, Guid productId, int quantity);
		Task ClearBasketAsync(Guid customerId);
	}
}
