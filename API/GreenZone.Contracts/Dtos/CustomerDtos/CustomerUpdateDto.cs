using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Contracts.Dtos.CustomerDtos
{
    public record class CustomerUpdateDto
    { 
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string IdentityCard { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
    }
}
