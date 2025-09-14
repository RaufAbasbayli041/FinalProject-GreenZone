using AutoMapper;
using FluentValidation;
using GreenZone.Application.Validations.Category;
using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Dtos.CategoryDtos;
using GreenZone.Domain.Entity;
using GreenZone.Domain.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Application.Service
{
    public class CategoryService : GenericService<Category, CategoryCreateDto, CategoryReadDto, CategoryUpdateDto>, ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;


        public CategoryService(ICategoryRepository categoryRepository, IMapper mapper, IValidator<CategoryCreateDto> createValidator, IValidator<CategoryUpdateDto> updateValidator , IUnitOfWork unitOfWork)
          : base(categoryRepository, mapper, createValidator, updateValidator, unitOfWork)
        {
            _categoryRepository = categoryRepository;
        }
        public async Task<List<CategoryReadDto>> GetCategoriesWithProductsAsync()
        {
            var categories = await _categoryRepository.GetCategoriesWithProductsAsync();
            var categoryDtos = _mapper.Map<List<CategoryReadDto>>(categories);
            return categoryDtos;
        }

        public async Task<CategoryReadDto> GetCategoryWithProductsByIdAsync(Guid id)
        {
            var category = await _categoryRepository.GetCategoryWithProductsByIdAsync(id);
            var categoryDto = _mapper.Map<CategoryReadDto>(category);
            return categoryDto;
        }
        //public async Task<CategoryReadDto> UpdateAsync(Guid id, CategoryUpdateDto dto)
        //{
        //    var entity = await _categoryRepository.GetByIdAsync(id);
        //    if (entity == null)
        //        throw new Exception("Category not found");

        //    if (dto.Name != null)
        //        entity.Name = dto.Name;

        //    if (dto.Description != null)
        //        entity.Description = dto.Description;

        //   var updatedEntity =   await _categoryRepository.UpdateAsync(entity);
        //    var updatedDto = _mapper.Map<CategoryReadDto>(updatedEntity);

        //    return updatedDto;

        //}

    }
    
    
}
