using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GreenZone.Contracts.Dtos;
using GreenZone.Domain.Entity;
using Microsoft.AspNetCore.Identity;

namespace GreenZone.Contracts.Contracts
{
    public interface IAuthService
    {
        Task<AuthResultDto?> LogInAsync (LogInDto logInDto);
        Task<IdentityResult> RegisterAsync( RegisterDto registerDto); 

        Task LogOutAsync ();
        Task<bool> ConfirmEmailAsync(string userId, string code);
    }
}
