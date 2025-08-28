using GreenZone.Contracts.Dtos.CategoryDtos;
using GreenZone.Contracts.Service;
using GreenZone.Domain.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Contracts.Contracts
{
    public interface ICategoryService : IGenericService<Category, CategoryCreateDto, CategoryReadDto, CategoryUpdateDto>
    {
        Task<List<CategoryReadDto>> GetCategoriesWithProductsAsync();
        Task<CategoryReadDto> GetCategoryWithProductsByIdAsync(Guid id);

    }
}
