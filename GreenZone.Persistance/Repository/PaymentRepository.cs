using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GreenZone.Domain.Entity;
using GreenZone.Domain.Enum;
using GreenZone.Domain.Repository;
using GreenZone.Persistance.Database;
using Microsoft.EntityFrameworkCore;

namespace GreenZone.Persistance.Repository
{
    public class PaymentRepository : GenericRepository<Payment>, IPaymentRepository
	{
		public PaymentRepository(GreenZoneDBContext context) : base(context)
		{
		}

		public async Task<IEnumerable<Payment>> GetPaymentsByCustomerIdAsync(Guid customerId)
		{
			var datas = await _context.Payments
				.Include(p => p.Customer)
				.ThenInclude(c => c.Orders)
				.Where(p => p.CustomerId == customerId)
				.ToListAsync();
			return datas;
		}

		public async Task<IEnumerable<Payment>> GetPaymentsByPaymentMethodsAsync(string paymentMethod)
		{
			var datas = await _context.Payments
				.Include(p => p.PaymentMethod)
				.Where(p => !p.IsDeleted && p.PaymentMethod.Name.ToLower() == paymentMethod.ToLower())
				.ToListAsync();

			return datas;
		}

		public async Task<IEnumerable<Payment>> GetPaymentsByStatusAsync(PaymentStatus status)
		{
			var datas = await _context.Payments
				.Include(p => p.Customer)
				.Where(p => !p.IsDeleted && p.Status == status)
				.ToListAsync();
			return datas;
		}

		public async Task<IEnumerable<Payment>> GetPaymentsInDateRangeAsync(DateTime startDate, DateTime endDate)
		{ 
			var datas = await  _context.Payments
				.Include(p => p.Customer)
				.Where(p => !p.IsDeleted && p.PaymentDate >= startDate && p.PaymentDate <= endDate)
				.ToListAsync();
			return datas;
		}

		public async Task<Payment> GetPaymentWithDetailsAsync(Guid paymentId)
		{
			 var data = await _context.Payments
				.Include(p => p.Customer)
				.Include(p => p.PaymentMethod)
				.FirstOrDefaultAsync(p => p.Id == paymentId && !p.IsDeleted);
			return data;
		}

        public async Task<decimal> GetTotalPaymentsAmountAsync(DateTime start, DateTime end)
        { 
			var total = await _context.Payments
				.Where(p => !p.IsDeleted && p.PaymentDate >= start && p.PaymentDate <= end && p.Status == PaymentStatus.Completed)
				.SumAsync(p => p.Amount);
			return total;
        }

        public async Task<IDictionary<string, decimal>> GetTotalPaymentsByMethodAsync(DateTime start, DateTime end)
        { 
			var result = await _context.Payments
				.Where(p => !p.IsDeleted && p.PaymentDate >= start && p.PaymentDate <= end && p.Status == PaymentStatus.Completed)
				.GroupBy(p => p.PaymentMethod.Name)
				.Select(g => new { PaymentMethod = g.Key, TotalAmount = g.Sum(p => p.Amount) })
				.ToDictionaryAsync(x => x.PaymentMethod, x => x.TotalAmount);
			return result;
        }
    }
}
