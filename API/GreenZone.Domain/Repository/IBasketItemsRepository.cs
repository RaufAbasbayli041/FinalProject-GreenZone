using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GreenZone.Domain.Entity;

namespace GreenZone.Domain.Repository
{
	public interface  IBasketItemsRepository : IGenericRepository<BasketItems>
	{
		Task<BasketItems> GetItemsByProductIdAsync(Guid basketId,Guid productId);
		Task<bool> DeleteAsync(BasketItems basketItem);
    }
}
