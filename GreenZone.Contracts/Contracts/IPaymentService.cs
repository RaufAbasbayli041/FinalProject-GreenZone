using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GreenZone.Contracts.Dtos.PaymentDto;
using GreenZone.Contracts.Service;
using GreenZone.Domain.Entity;
using GreenZone.Domain.Enum;

namespace GreenZone.Contracts.Contracts
{
    public interface IPaymentService : IGenericService<Payment, PaymentCreateDto, PaymentReadDto, PaymentUpdateDto>
    {
        // business specific methods
        Task<PaymentReadDto> ProcessPaymentAsync(PaymentCreateDto paymentCreateDto); // New method for processing a payment
        Task RefundPaymentAsync (Guid paymentId); // New method for refunding a payment
        Task<PaymentReadDto> GetPaymentWithDetailsAsync(Guid paymentId);

        // fiter methods
        Task<IEnumerable<PaymentReadDto>> GetPaymentsByCustomerIdAsync(Guid customerId);
        Task<IEnumerable<PaymentReadDto>> GetPaymentsByStatusAsync(PaymentStatus status);
        Task<IEnumerable<PaymentReadDto>> GetPaymentsInDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<PaymentReadDto>> GetPaymentsByPaymentMethodsAsync(string paymentMethod);

        // 
        Task<decimal> GetTotalPaymentsAmountAsync( DateTime start, DateTime end);
        Task<IDictionary<string, decimal>> GetTotalPaymentsByMethodAsync(DateTime start, DateTime end);
    }
}
