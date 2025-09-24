using GreenZone.Domain.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Contracts.Dtos.CustomerDtos
{
    public record class CustomerReadDto : BaseDto
    {
        public string IdentityCard { get; set; }
        public string UserId { get; set; } // Foreign key to ApplicationUser
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }    
		public string PhoneNumber { get; set; } 


    }
}
