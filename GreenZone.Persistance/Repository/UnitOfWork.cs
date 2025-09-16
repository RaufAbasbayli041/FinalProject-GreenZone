using GreenZone.Domain.Repository;
using GreenZone.Persistance.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Persistance.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        protected readonly GreenZoneDBContext _context;

        public UnitOfWork(GreenZoneDBContext context)
        {
            _context = context;
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}
