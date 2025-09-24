using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Contracts.Dtos.CategoryDtos
{
    public record class CategoryCreateDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
