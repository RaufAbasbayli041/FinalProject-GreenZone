using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GreenZone.Domain.Entity;
using GreenZone.Domain.Enum;

namespace GreenZone.Domain.Repository
{
	public interface IPaymentRepository : IGenericRepository<Payment>
	{
		Task<IEnumerable<Payment>> GetPaymentsByCustomerIdAsync(Guid customerId);
		Task<IEnumerable<Payment>> GetPaymentsByStatusAsync(PaymentStatus status);
		Task<IEnumerable<Payment>> GetPaymentsInDateRangeAsync(DateTime startDate, DateTime endDate);
		Task<IEnumerable<Payment>> GetPaymentsByPaymentMethodsAsync(string paymentMethod);
		Task<Payment> GetPaymentWithDetailsAsync(Guid paymentId);
        Task<IDictionary<string, decimal>> GetTotalPaymentsByMethodAsync(DateTime start, DateTime end);
		Task<decimal> GetTotalPaymentsAmountAsync(DateTime start, DateTime end);
    }
}
