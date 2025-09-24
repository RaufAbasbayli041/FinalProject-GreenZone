using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Contracts.Contracts
{
    public interface IEmailSenderOpt
    {
        public Task SendEmailAsync(string email, string subject, string htmlMessage);
    }
}
