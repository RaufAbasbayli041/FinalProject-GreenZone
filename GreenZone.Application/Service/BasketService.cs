using AutoMapper;
using GreenZone.Application.Exceptions;
using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Dtos.BasketDtos;
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
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public BasketService(IBasketRepository basketRepository, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _basketRepository = basketRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task AddItemstoBasketAsync(Guid customerId, Guid productId, int quantity)
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
                basket = new Basket
                {
                    CustomerId = customerId,
                    BasketItems = new List<BasketItems>()
                };
                await _basketRepository.AddAsync(basket);
            }
            var basketItem = basket.BasketItems.FirstOrDefault(bi => bi.ProductId == productId);
            if (basketItem != null)
            {
                basketItem.Quantity += quantity;
            }
            else
            {
                basketItem = new BasketItems
                {
                    ProductId = productId,
                    Quantity = quantity,
                    BasketId = basket.Id
                };
                basket.BasketItems.Add(basketItem);
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
                throw new InvalidOperationException("product not found in the basket.");
            }
            basketItem.Quantity -= quantity;
            if (basketItem.Quantity <= 0)
            {
                basket.BasketItems.Remove(basketItem);
            }
            await _unitOfWork.SaveChangesAsync();

        }
    }
}
