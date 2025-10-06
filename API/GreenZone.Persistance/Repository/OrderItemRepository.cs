using GreenZone.Domain.Entity;
using GreenZone.Domain.Repository;
using GreenZone.Persistance.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Persistance.Repository
{
    public class OrderItemRepository : GenericRepository<OrderItem>, IOrderItemsRepository
    {
        public OrderItemRepository(GreenZoneDBContext context) : base(context)
        {
        }
    }
}
