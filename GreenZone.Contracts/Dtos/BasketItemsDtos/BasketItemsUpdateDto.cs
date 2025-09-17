using GreenZone.Domain.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Contracts.Dtos.BasketItemsDtos
{
    public record class BasketItemsUpdateDto
    {      
        public Guid ProductId { get; set; }
		public int Quantity { get; set; } 
    }
}
