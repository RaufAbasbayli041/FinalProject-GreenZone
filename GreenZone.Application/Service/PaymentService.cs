using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using FluentValidation;
using GreenZone.Application.Exceptions;
using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Dtos.PaymentDto;
using GreenZone.Domain.Entity;
using GreenZone.Domain.Enum;
using GreenZone.Domain.Repository;
using Microsoft.Extensions.Logging;

namespace GreenZone.Application.Service
{
    public class PaymentService : GenericService<Payment, PaymentCreateDto, PaymentReadDto, PaymentUpdateDto>, IPaymentService
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly ILogger<PaymentService> _logger;

        public PaymentService(IPaymentRepository paymentRepository, IMapper mapper, IValidator<PaymentCreateDto> createValidator, IValidator<PaymentUpdateDto> updateValidator, ILogger<PaymentService> logger, IUnitOfWork unitOfWork) : base(paymentRepository, mapper, createValidator, updateValidator, unitOfWork)
        {
            _paymentRepository = paymentRepository;
            _logger = logger;
        }

        public async Task<IEnumerable<PaymentReadDto>> GetPaymentsByCustomerIdAsync(Guid customerId)
        {
            if (customerId == Guid.Empty) throw new ArgumentException("Customer ID cannot be empty.", nameof(customerId));
            var payments = await _paymentRepository.GetPaymentsByCustomerIdAsync(customerId);
            return _mapper.Map<IEnumerable<PaymentReadDto>>(payments);
        }

        public async Task<IEnumerable<PaymentReadDto>> GetPaymentsByPaymentMethodsAsync(string paymentMethod)
        {
            if (string.IsNullOrWhiteSpace(paymentMethod)) throw new NotNullException("Payment method cannot be null or empty.");

            var payments = await _paymentRepository.GetPaymentsByPaymentMethodsAsync(paymentMethod.ToLower().Trim());
            return _mapper.Map<IEnumerable<PaymentReadDto>>(payments);
        }

        public async Task<IEnumerable<PaymentReadDto>> GetPaymentsByStatusAsync(PaymentStatus status)
        {
            if (!Enum.IsDefined(typeof(PaymentStatus), status)) throw new ArgumentException("Invalid payment status.", nameof(status));
            var payments = await _paymentRepository.GetPaymentsByStatusAsync(status);
            return _mapper.Map<IEnumerable<PaymentReadDto>>(payments);
        }

        public async Task<IEnumerable<PaymentReadDto>> GetPaymentsInDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            if (startDate > endDate) throw new ArgumentException("Start date must be earlier than or equal to end date.");
            var payments = await _paymentRepository.GetPaymentsInDateRangeAsync(startDate, endDate);
            return _mapper.Map<IEnumerable<PaymentReadDto>>(payments);
        }

        public async Task<PaymentReadDto> GetPaymentWithDetailsAsync(Guid paymentId)
        {
            if (paymentId == Guid.Empty) throw new ArgumentException("Payment ID cannot be empty.", nameof(paymentId));
            var payment = await _paymentRepository.GetPaymentWithDetailsAsync(paymentId);
            if (payment == null) throw new KeyNotFoundException($"Payment with ID {paymentId} not found.");
            return _mapper.Map<PaymentReadDto>(payment);
        }

        public async Task<decimal> GetTotalPaymentsAmountAsync(DateTime start, DateTime end)
        {
            var total = await _paymentRepository.GetTotalPaymentsAmountAsync(start, end);
            return total;
        }

        public async Task<IDictionary<string, decimal>> GetTotalPaymentsByMethodAsync(DateTime start, DateTime end)
        {
            var totals = await _paymentRepository.GetTotalPaymentsByMethodAsync(start, end);
            return totals;
        }

        public async Task<PaymentReadDto> ProcessPaymentAsync(PaymentCreateDto paymentCreateDto)
        {
            if (paymentCreateDto.Amount <= 0) throw new ArgumentException("Payment amount must be greater than zero.", nameof(paymentCreateDto.Amount));
            // Simulate payment processing logic
            var payment = _mapper.Map<Payment>(paymentCreateDto);
            payment.Status = PaymentStatus.Completed; // Assume payment is successful
            payment.PaymentDate = DateTime.UtcNow;
            var createdPayment = await _paymentRepository.AddAsync(payment);
            _logger.LogInformation(
                "Payment {PaymentId} created for customer {CustomerId} with amount {Amount}",
                payment.Id,
                payment.CustomerId,
                payment.Amount);
            return _mapper.Map<PaymentReadDto>(createdPayment);
        }

        public async Task RefundPaymentAsync(Guid paymentId)
        {
            var payment = await _paymentRepository.GetByIdAsync(paymentId);
            if (payment == null) throw new NotFoundException($"Payment with ID {paymentId} not found.");
            if (payment.Status != PaymentStatus.Completed) throw new InvalidOperationException("Only completed payments can be refunded.");
            payment.Status = PaymentStatus.Refunded;
            payment.RefundDate = DateTime.UtcNow;
            _logger.LogInformation(
              "Payment {PaymentId} refunded on {RefundDate} (original date {PaymentDate})",
              payment.Id,
              payment.RefundDate,
              payment.PaymentDate);
            await _paymentRepository.UpdateAsync(payment);
        }
    }
}
