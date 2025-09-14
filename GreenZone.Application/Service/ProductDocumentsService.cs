using AutoMapper;
using FluentValidation;
using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Dtos.ProductDocumentsDto;
using GreenZone.Domain.Entity;
using GreenZone.Domain.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Application.Service
{
    public class ProductDocumentsService : GenericService<ProductDocuments, ProductDocumentsCreateDto, ProductDocumentsReadDto, ProductDocumentsUpdateDto>, IProductDocumentsService
    {
        private readonly IProductDocumentsRepository _productDocumentsRepository;
        public ProductDocumentsService(IGenericRepository<ProductDocuments> repository, IMapper mapper, IValidator<ProductDocumentsCreateDto> createValidator, IValidator<ProductDocumentsUpdateDto> updateValidator, IProductDocumentsRepository productDocumentsRepository, IUnitOfWork unitOfWork) : base(repository, mapper, createValidator, updateValidator, unitOfWork)
        {
            _productDocumentsRepository = productDocumentsRepository;
        }

        public override async Task<ProductDocumentsReadDto> AddAsync(ProductDocumentsCreateDto dto)
        {
            if (dto == null) throw new ArgumentNullException(nameof(dto));

            var existingDocument = await _productDocumentsRepository.GetProductByIdAsync(dto.ProductId);
            if (existingDocument != null)
                throw new InvalidOperationException("A document for this product already exists.");

            var createdDocument = _mapper.Map<ProductDocuments>(dto);
            var addedDocument = _productDocumentsRepository.AddAsync(createdDocument);
            var readDto = _mapper.Map<ProductDocumentsReadDto>(addedDocument);
            return readDto;

        }


    }
}
