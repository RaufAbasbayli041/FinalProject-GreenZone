using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Contracts.Contracts
{
    public interface IAuthService
    {
        Task<string> LogInAsync (string email, string password);
        Task<string> RegisterAsync(string userName, string email, string password);
        Task <bool> ChangePasswordAsync (string email, string currentPassword, string newPassword);
        Task<bool> ForgotPasswordAsync(string email);
        Task<bool> ResetPasswordAsync(string email, string newPassword);


    }
}
