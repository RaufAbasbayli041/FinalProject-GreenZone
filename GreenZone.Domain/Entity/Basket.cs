using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Domain.Entity
{
    public class Basket : BaseEntity
    {
        public Guid CustomerId { get; set; } 
        public Customer Customer { get; set; } // Navigation property to Customer entity
        public ICollection<BasketItems> BasketItems { get; set; } = new List<BasketItems>();
        public decimal TotalAmount => BasketItems.Sum(x=>x.TotalPrice); 
    }
}
