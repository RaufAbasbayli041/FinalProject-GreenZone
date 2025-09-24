using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GreenZone.Domain.Entity;
using GreenZone.Domain.Repository;
using GreenZone.Persistance.Database;

namespace GreenZone.Persistance.Repository
{
	public class BasketItemsRepository : GenericRepository<BasketItems>, IBasketItemsRepository
	{
		public BasketItemsRepository(GreenZoneDBContext context) : base(context)
		{
		}

	}
}
