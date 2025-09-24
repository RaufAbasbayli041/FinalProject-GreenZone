using GreenZone.Contracts.Contracts;
using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace GreenZone.Application.Service
{
	public class EmailSenderOpt : IEmailSenderOpt
	{
		private readonly IConfiguration _configuration;

		public EmailSenderOpt(IConfiguration configuration)
		{
			_configuration = configuration;
		}

		public async Task SendEmailAsync(string email, string subject, string htmlMessage)
		{
			var smtpServer = _configuration["EmailSettings:SmtpServer"];
			var port = int.Parse(_configuration["EmailSettings:Port"]);
			var fromEmail = _configuration["EmailSettings:FromEmail"];
			var password = _configuration["EmailSettings:Password"];
			var enableSsl = bool.Parse(_configuration["EmailSettings:EnableSsl"]);

			var mail = new MailMessage
			{
				From = new MailAddress(fromEmail),
				Subject = subject,
				Body = htmlMessage,
				IsBodyHtml = true
			};
			mail.To.Add(email);

			using var client = new SmtpClient(smtpServer, port)
			{
				Credentials = new NetworkCredential(fromEmail, password),
				EnableSsl = enableSsl
			};

			await client.SendMailAsync(mail);
		}
	}
}
