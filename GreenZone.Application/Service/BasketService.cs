using AutoMapper;
using GreenZone.Application.Exceptions;
using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Dtos.BasketDtos;
using GreenZone.Contracts.Dtos.BasketItemsDtos;
using GreenZone.Domain.Entity;
using GreenZone.Domain.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Application.Service
{
	public class BasketService : IBasketService
	{
		private readonly IBasketRepository _basketRepository;
		private readonly IBasketItemsRepository _basketItemsRepository;
		private readonly IUnitOfWork _unitOfWork;
		private readonly IMapper _mapper;

		public BasketService(IBasketRepository basketRepository, IUnitOfWork unitOfWork, IMapper mapper, IBasketItemsRepository basketItemsRepository)
		{
			_basketRepository = basketRepository;
			_unitOfWork = unitOfWork;
			_mapper = mapper;
			_basketItemsRepository = basketItemsRepository;
		}

		public async Task AddItemstoBasketAsync(Guid customerId,BasketItemsCreateDto basketItemsCreateDto)
		{
			var basket = await _basketRepository.GetBasketByCustomerAsync(customerId);
			if (basket == null)
			{
				throw new NotFoundException("Basket not found for the customer.");
			}
			var basketItem = basket.BasketItems.FirstOrDefault(bi => bi.ProductId == basketItemsCreateDto.ProductId);
			if (basketItem != null)
			{
				basketItem.Quantity += basketItemsCreateDto.Quantity;
			}
			else
			{
				 basketItem = new BasketItems
				{
					Id = Guid.NewGuid(),
					ProductId = basketItemsCreateDto.ProductId,
					Quantity = basketItemsCreateDto.Quantity,
					BasketId = basket.Id
				};
			await _basketItemsRepository.AddAsync(basketItem);
			} 
			await _unitOfWork.SaveChangesAsync();
		}

		public async Task ClearBasketAsync(Guid customerId)
		{
			await _basketRepository.ClearBasketAsync(customerId);
		}

		public async Task<BasketReadDto> GetBasketByCustomerAsync(Guid customerId)
		{
			var basket = await _basketRepository.GetBasketByCustomerAsync(customerId);
			if (basket == null)
			{
				throw new NotFoundException("Basket not found for the customer.");
			}
			var basketDto = _mapper.Map<BasketReadDto>(basket);
			return basketDto;

		}

		public async Task RemoveItemsFromBasketAsync(Guid customerId, Guid productId, int quantity)
		{
			if (quantity <= 0)
			{
				throw new ArgumentException("Quantity must be greater than zero.");
			}
			if (productId == Guid.Empty)
			{
				throw new ArgumentException("Invalid product ID.");
			}
			if (customerId == Guid.Empty)
			{
				throw new ArgumentException("Invalid customer ID.");
			}

			var basket = await _basketRepository.GetBasketByCustomerAsync(customerId);

			if (basket == null)
			{
				throw new NotFoundException("Basket not found for the customer.");
			}
			if (!basket.BasketItems.Any())
			{
				throw new InvalidOperationException("Basket is empty.");
			}
			var basketItem = basket.BasketItems.FirstOrDefault(bi => bi.ProductId == productId);
			if (basketItem == null)
			{
				throw new NotFoundException("product not found in the basket.");
			}
			basketItem.Quantity -= quantity;
			if (basketItem.Quantity <= 0)
			{
				basket.BasketItems.Remove(basketItem);
			}
			await _unitOfWork.SaveChangesAsync();

		}

		public async Task UpdateItemsInBasketAsync(Guid customerId, BasketItemsUpdateDto basketItemsUpdateDto)
		{ 
			if (customerId == Guid.Empty)
			{
			 throw new NotFoundException ("CustomerId not found.");
			}
			if (basketItemsUpdateDto.Quantity <= 0)
			{
				throw new ArgumentException("Quantity must be greater than zero.");
			}
			var existingBasket = await _basketRepository.GetBasketByCustomerAsync(customerId);
			if (existingBasket == null)
			{
				throw new NotFoundException("Basket not found for the customer.");
			}
			var basketItem = existingBasket.BasketItems.FirstOrDefault(bi => bi.ProductId == basketItemsUpdateDto.ProductId);
			if (basketItem == null)
			{
				throw new NotFoundException("Product not found in the basket.");
			}
			basketItem.Quantity = basketItemsUpdateDto.Quantity;
			await _basketItemsRepository.UpdateAsync(basketItem);
			await _unitOfWork.SaveChangesAsync();


		}
	}
}
