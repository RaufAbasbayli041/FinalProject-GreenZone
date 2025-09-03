using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Contracts.Dtos.ProductDocumentsDto
{
    public record class ProductDocumentsCreateDto
    {
        public string DocumentName { get; set; } // Name of the document (e.g., "Insurance", "Registration")
        public string OriginalName { get; set; }
        public string DocumentUrl { get; set; } // URL or path to the document file
        public Guid ProductId { get; set; } // Foreign key to the Product
    }
}
