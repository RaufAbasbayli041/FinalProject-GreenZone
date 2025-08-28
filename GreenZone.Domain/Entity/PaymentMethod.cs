using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Domain.Entity
{
    public class PaymentMethod : BaseEntity
    {
        public string Name { get; set; } // E.g., Cash, Card
        public ICollection<Payment> Payments { get; set; } = new List<Payment>(); // Collection of payments made using this method
    }
}
