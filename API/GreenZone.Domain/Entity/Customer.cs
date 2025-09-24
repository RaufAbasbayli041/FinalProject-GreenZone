using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Domain.Entity
{
    public class Customer : BaseEntity
    {
        public string IdentityCard { get; set; } 
        public List<Payment> Payments { get; set; } = new List<Payment>(); // Navigation property to Payment entities
        public ICollection<Order> Orders { get; set; } = new List<Order>(); // Navigation property to Order entities
        public string UserId { get; set; } // Foreign key to ApplicationUser
        public ApplicationUser User { get; set; } // Navigation property to ApplicationUser
        public Basket Basket { get; set; } // Navigation property to Cart entity

    }
}
