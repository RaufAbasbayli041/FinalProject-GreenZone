using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using FluentValidation;
using GreenZone.Contracts.Contracts;
using GreenZone.Contracts.Dtos.PaymentDto;
using GreenZone.Domain.Entity;
using GreenZone.Domain.Enum;
using GreenZone.Domain.Repository;

namespace GreenZone.Application.Service
{
	public class PaymentService : GenericService<Payment, PaymentCreateDto, PaymentReadDto, PaymentUpdateDto>, IPaymentService
	{
		private readonly IPaymentRepository _paymentRepository;

		public PaymentService(IPaymentRepository paymentRepository, IMapper mapper, IValidator<PaymentCreateDto> createValidator, IValidator<PaymentUpdateDto> updateValidator) : base(paymentRepository, mapper, createValidator, updateValidator)
		{
			_paymentRepository = paymentRepository;
		}

		public Task<IEnumerable<PaymentReadDto>> GetPaymentsByCustomerIdAsync(Guid customerId)
		{
			throw new NotImplementedException();
		}

		public Task<IEnumerable<PaymentReadDto>> GetPaymentsByPaymentMethodsAsync(string paymentMethod)
		{
			throw new NotImplementedException();
		}

		public Task<IEnumerable<PaymentReadDto>> GetPaymentsByStatusAsync(PaymentStatus status)
		{
			throw new NotImplementedException();
		}

		public Task<IEnumerable<PaymentReadDto>> GetPaymentsInDateRangeAsync(DateTime startDate, DateTime endDate)
		{
			throw new NotImplementedException();
		}

		public Task<PaymentReadDto> GetPaymentWithDetailsAsync(Guid paymentId)
		{
			throw new NotImplementedException();
		}
	}
}
