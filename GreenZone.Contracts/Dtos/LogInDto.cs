using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Contracts.Dtos
{
    public record class LogInDto
    { 
        public string UserName { get; set; }
        public string Password { get; set; } 

    }
}
