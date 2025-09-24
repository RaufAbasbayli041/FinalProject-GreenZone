using GreenZone.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Domain.Entity
{
    public class Payment : BaseEntity
    {
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; }
        public DateTime? RefundDate { get; set; } // New property for refund date
        public PaymentStatus Status { get; set; } 
        public Guid PaymentMethodId { get; set; }
        public PaymentMethod PaymentMethod { get; set; } // Navigation property to PaymentMethod
        public Guid CustomerId { get; set; } // Foreign key to Customer
        public Customer Customer { get; set; } // Navigation property to Customer
    }
}
