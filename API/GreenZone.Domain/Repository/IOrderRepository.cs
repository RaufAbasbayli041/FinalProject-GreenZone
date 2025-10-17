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
        Task<IEnumerable<Order>> GetOrdersByOrderStatusAsync(Guid? orderStatusId, string? keyword, int pages = 1, int pageSize = 10);

		Task<IEnumerable<Order>> GetOrdersByCustomerIdAsync(Guid customerId);
        
        Task<IEnumerable<Order>> GetOrdersByDateRangeAsync(DateTime startDate, DateTime endDate);

        Task<decimal> GetTotalSalesAsync(DateTime startDate, DateTime endDate);
        Task<int> GetOrderCountByStatusAsync(Guid orderStatusId);

	}
}
