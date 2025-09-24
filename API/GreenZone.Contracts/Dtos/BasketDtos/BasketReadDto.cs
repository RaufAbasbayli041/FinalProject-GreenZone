using GreenZone.Contracts.Dtos.BasketItemsDtos;
using GreenZone.Domain.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Contracts.Dtos.BasketDtos
{
    public record class BasketReadDto : BaseDto
    {
        public Guid CustomerId { get; set; }       
        public ICollection<BasketItemsReadDto> BasketItems { get; set; } = new List<BasketItemsReadDto>();
    }
}
