using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Domain.Entity
{
    public class ProductDocuments : BaseEntity
    {
        public string DocumentUrl { get; set; } // URL or path to the document file
        public Guid ProductId { get; set; } // Foreign key to the Product
        public Product Product { get; set; } // Navigation property to the Product
    }
}
