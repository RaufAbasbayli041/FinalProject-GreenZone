using GreenZone.Domain.Entity;
using GreenZone.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Domain.Repository
{
    public interface IOrderRepository : IGenericRepository<Order>
    {
        Task<ICollection<Order>> GetOrdersByOrderStatusAsync(Guid? orderStatusId, string? keyword, int pages = 1, int pageSize = 10);

		Task<ICollection<Order>> GetOrdersByCustomerIdAsync(Guid customerId);
        
        Task<ICollection<Order>> GetOrdersByDateRangeAsync(DateTime startDate, DateTime endDate);

        Task <decimal> GetTotalSalesAsync(DateTime startDate, DateTime endDate);
        Task<int> GetOrderCountByStatusAsync (Guid orderStatusId);

	}
}
