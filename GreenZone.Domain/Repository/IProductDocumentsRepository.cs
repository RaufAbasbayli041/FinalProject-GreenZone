using GreenZone.Domain.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Domain.Repository
{
    public interface IProductDocumentsRepository : IGenericRepository<ProductDocuments>
    {
        Task <ProductDocuments> GetProductByIdAsync(Guid productId);
    }
}
