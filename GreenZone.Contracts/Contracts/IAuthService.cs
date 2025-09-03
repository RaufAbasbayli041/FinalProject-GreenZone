using GreenZone.Contracts.Dtos;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Contracts.Contracts
{
    public interface IAuthService
    {
        Task<IdentityResult> LogInAsync (LogInDto logInDto);
        Task<IdentityResult> RegisterAsync( RegisterDto registerDto);
       
    }
}
