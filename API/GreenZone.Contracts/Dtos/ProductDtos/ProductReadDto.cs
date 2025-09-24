using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Contracts.Dtos.ProductDtos
{
    public record class ProductReadDto : BaseDto
    { 
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal PricePerSquareMeter { get; set; }
        public int MinThickness { get; set; } // Minimum thickness in mm
        public int MaxThickness { get; set; } // Maximum thickness in mm
        public string? ImageUrl { get; set; } // URL or path to the product image
        public Guid CategoryId { get; set; }
        public List<Guid> DocumentIds { get; set; }
    }
}
