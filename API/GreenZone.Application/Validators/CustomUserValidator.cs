using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GreenZone.Domain.Entity;
using Microsoft.AspNetCore.Identity;

namespace GreenZone.Application.Validators
{
	public class CustomUserValidator : IUserValidator<ApplicationUser>
	{
		public Task<IdentityResult> ValidateAsync(UserManager<ApplicationUser> manager, ApplicationUser user)
		{
			var errors = new List<IdentityError>();

			if (string.IsNullOrWhiteSpace(user.UserName))
			{
				errors.Add(new IdentityError
				{
					Code = "UserNameRequired",
					Description = "UserName cannot be empty."
				});
			}

			// Email проверяем только на корректность формата, но не на уникальность
			if (!string.IsNullOrWhiteSpace(user.Email) && !user.Email.Contains("@"))
			{
				errors.Add(new IdentityError
				{
					Code = "EmailInvalid",
					Description = "Email format is invalid."
				});
			}

			return Task.FromResult(errors.Count == 0
				? IdentityResult.Success
				: IdentityResult.Failed(errors.ToArray()));
		}
	}
}
