using GreenZone.Domain.Entity;
using GreenZone.Domain.Repository;
using GreenZone.Persistance.Database;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Persistance.Repository
{
    public class GenericRepository<TEntity> : IGenericRepository<TEntity> where TEntity : BaseEntity, new()
    {
        protected readonly GreenZoneDBContext _context;
        private readonly DbSet<TEntity> _dbSet;
        public GenericRepository(GreenZoneDBContext context)
        {
            _context = context;
            _dbSet = _context.Set<TEntity>();
        }
        public virtual async Task<TEntity> AddAsync(TEntity entity)
        {
            var addedEntity = await _dbSet.AddAsync(entity);
            
            return entity;
        }
        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _dbSet.FindAsync(id);
            if (entity == null || entity.IsDeleted)
            {
                return false;
            }
            entity.IsDeleted = true;
            _dbSet.Update(entity);
            
            return true;
        }
        public virtual async Task<IEnumerable<TEntity>> GetAllAsync()
        {
            var entities = (await _dbSet.ToListAsync()).Where(x => !x.IsDeleted);
            return entities;
        }
        public virtual async Task<TEntity> GetByIdAsync(Guid id)
        {
            var entity = await _dbSet.FindAsync(id);
            if (entity == null)
            {
                return null;
            }
            return entity;
        }
        public async Task<TEntity> UpdateAsync(TEntity entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity), "Entity cannot be null.");
            }
            entity.UpdatedAt = DateTime.UtcNow;
            _dbSet.Update(entity);
            
            return entity;
        }
    }
}
