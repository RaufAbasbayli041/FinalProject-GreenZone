using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Contracts.Dtos
{
    public record class FileUploadDto 
    {
        public IFormFile Image { get; set; }
    }
}
