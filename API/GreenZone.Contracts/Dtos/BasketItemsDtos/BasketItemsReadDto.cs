using GreenZone.Domain.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Contracts.Dtos.BasketItemsDtos
{
    public record class BasketItemsReadDto : BaseDto
    {
        public Guid ProductId { get; set; }       
        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }

        // Navigation property to Product
        public string ProductTitle { get; set; }
        public string? ProductImageUrl { get; set; }
    }
}
