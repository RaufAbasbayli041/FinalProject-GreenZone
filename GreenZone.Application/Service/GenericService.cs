using AutoMapper;
using FluentValidation;
using GreenZone.Contracts.Service;
using GreenZone.Domain.Entity;
using GreenZone.Domain.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Application.Service
{
    public class GenericService<TEntity, TCreateDto, TReadDto, TUpdateDto> : IGenericService<TEntity, TCreateDto, TReadDto, TUpdateDto>
         where TEntity : BaseEntity, new()
         where TCreateDto : class, new()
            where TReadDto : class, new()
            where TUpdateDto : class, new()
    {
        protected readonly IGenericRepository<TEntity> _repository;
        protected readonly IMapper _mapper;
         private readonly IValidator<TCreateDto> _createValidator;
        private readonly IValidator<TUpdateDto> _updateValidator;
        private readonly IUnitOfWork _unitOfWork;
        public GenericService(IGenericRepository<TEntity> repository, IMapper mapper, IValidator<TCreateDto> createValidator, IValidator<TUpdateDto> updateValidator, IUnitOfWork unitOfWork)
        {
            _repository = repository;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
            _unitOfWork = unitOfWork;
        }

        public async Task<TReadDto> GetByIdAsync(Guid id)
        {
            var data = await _repository.GetByIdAsync(id);
            if (data == null) return null;
            var dto = _mapper.Map<TReadDto>(data);
            return dto;

        }

        public virtual async Task<IEnumerable<TReadDto>> GetAllAsync()
        {
            var datas = await _repository.GetAllAsync();
            var dtos = _mapper.Map<IEnumerable<TReadDto>>(datas);
            return dtos;
        }

        public virtual async Task<TReadDto> AddAsync(TCreateDto dto)
        {
            var validationResult = await _createValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            var entity = _mapper.Map<TEntity>(dto);
            var addedData = await _repository.AddAsync(entity);
            var readDto = _mapper.Map<TReadDto>(addedData);
            await _unitOfWork.SaveChangesAsync();
            return readDto;
        }

        public virtual async Task<TReadDto> UpdateAsync(Guid id, TUpdateDto dto)
        {
            var validationResult = await _updateValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return null;
            _mapper.Map(dto, entity);
            var updatedData = await _repository.UpdateAsync(entity);
            var readDto = _mapper.Map<TReadDto>(updatedData);
            await _unitOfWork.SaveChangesAsync();

            return readDto;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var result = await _repository.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();

            return result;
        }
    }
}
