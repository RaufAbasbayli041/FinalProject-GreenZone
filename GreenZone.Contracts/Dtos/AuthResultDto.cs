using GreenZone.Contracts.Dtos.CustomerDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Contracts.Dtos
{
	public class AuthResultDto
	{
		public string Token { get; set; }
		public DateTime Expiration { get; set; }
    }
}
