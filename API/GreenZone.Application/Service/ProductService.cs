using AutoMapper;
using FluentValidation;
using GreenZone.Application.Exceptions;
using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Dtos.ProductDtos;
using GreenZone.Domain.Entity;
using GreenZone.Domain.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Application.Service
{
    public class ProductService : GenericService<Product, ProductCreateDto, ProductReadDto, ProductUpdateDto>, IProductService
    {
        private readonly IProductRepository _productRepository;

        public ProductService(IProductRepository productRepository, IMapper mapper, IValidator<ProductCreateDto> createValidator, IValidator<ProductUpdateDto> updateValidator, IUnitOfWork unitOfWork) : base(productRepository, mapper, createValidator, updateValidator, unitOfWork)
        {
            _productRepository = productRepository;
        }

        public async Task<IEnumerable<ProductReadDto>> GetProductsByCategoryAsync(Guid categoryId, int pages, int pageSize)
        {
            var products = await _productRepository.GetProductsByCategoryAsync(categoryId, pages, pageSize);
            var productDtos = _mapper.Map<IEnumerable<ProductReadDto>>(products);
            return productDtos;
        }

        public async Task<ProductReadDto> GetProductWithDocumentsAsync(Guid id)
        {
            if (id == Guid.Empty) { throw new NotNullException(); }
            var data = await _productRepository.GetProductWithDocumentsAsync(id);
            if (data == null) { throw new NotNullException(); }
            var dto = _mapper.Map<ProductReadDto>(data);
            return dto;
        }

        public async Task<IEnumerable<ProductReadDto>> SearchProductsAsync(string keyword, int page, int pageSize)
        {
            if (string.IsNullOrEmpty(keyword))
            {
                throw new NotNullException("Keyword cannot be null or empty");
            }

            var products = await _productRepository.SearchProductsAsync(keyword, page, pageSize);
            var productDtos = _mapper.Map<IEnumerable<ProductReadDto>>(products);
            return productDtos;
        }

        public async Task<ProductReadDto> UploadImageAsync(Guid productId, string imageUrl)
        {
            if (string.IsNullOrEmpty(imageUrl))
            {
                throw new NotNullException("Image URL cannot be null or empty");
            }
            var product = await _productRepository.GetByIdAsync(productId);
            if (product == null)
            {
                throw new NotFoundException("Product not found");
            }
            product.ImageUrl = imageUrl;
            var updatedProduct = await _productRepository.UpdateAsync(product);
            var productDto = _mapper.Map<ProductReadDto>(updatedProduct);
            return productDto;
        }
    }
}