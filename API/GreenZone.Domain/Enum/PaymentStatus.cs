using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Domain.Enum
{
    public enum PaymentStatus
    {
        Pending,    // Payment is pending
        Completed,  // Payment has been completed
        Failed,     // Payment has failed
        Refunded,   // Payment has been refunded
        Cancelled   // Payment has been cancelled
    }
}
