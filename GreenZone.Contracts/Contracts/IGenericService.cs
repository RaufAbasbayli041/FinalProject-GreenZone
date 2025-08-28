using GreenZone.Domain.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Contracts.Service
{
    public interface IGenericService<TEntity, TCreateDto,TReadDto,TUpdateDto> where TEntity : BaseEntity
    {
        Task<TReadDto> GetByIdAsync(Guid id);
        Task<IEnumerable<TReadDto>> GetAllAsync();
        Task<TReadDto> AddAsync(TCreateDto dto);
        Task<TReadDto> UpdateAsync(Guid id,TUpdateDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
