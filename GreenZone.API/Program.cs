using System.Text;
using GreenZone.Application.Extensions;
using GreenZone.Application.Profiles;
using GreenZone.Application.Validators;
using GreenZone.Domain.Entity;
using GreenZone.Persistance.Database;
using GreenZone.Persistance.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace GreenZone.API
{
	public class Program
	{
		public static async Task Main(string[] args)
		{
			var builder = WebApplication.CreateBuilder(args);


			// Add services to the container.

			builder.Services.AddControllers();
			// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
			builder.Services.AddEndpointsApiExplorer();
			builder.Services.AddSwaggerGen();
			builder.Services.AddDbContext<GreenZoneDBContext>(options =>
			{
				options.UseSqlServer(builder.Configuration.GetConnectionString("Default"));
			});


			builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
			{
				options.SignIn.RequireConfirmedAccount = true;
				options.User.RequireUniqueEmail = false; // Allow non-unique emails
				options.Password.RequiredLength = 8;
				options.Password.RequireDigit = true;
				options.Password.RequireLowercase = false;
				options.Password.RequireUppercase = false;
				options.Password.RequireNonAlphanumeric = false;
			})
			.AddEntityFrameworkStores<GreenZoneDBContext>()
			.AddUserValidator<CustomUserValidator>()
            .AddDefaultTokenProviders();

			 
			//builder.Services.AddScoped<IUserValidator<ApplicationUser>, CustomUserValidator>();

			builder.Services.AddAutoMapper(typeof(CustomProfile).Assembly);

			builder.Services.AddValidatorsRegistration();
			builder.Services.AddDistributedMemoryCache();

			builder.Services.AddSession(opt =>
			{
				opt.IdleTimeout = TimeSpan.FromMinutes(30);
				opt.Cookie.HttpOnly = true;
				opt.Cookie.IsEssential = true;
				opt.Cookie.Path = "/";
			});

			builder.Services.ConfigureApplicationCookie(options =>
			{
				options.LoginPath = "/Account/Login";
				options.LogoutPath = "/Account/Logout";
				options.AccessDeniedPath = "/Account/AccessDenied";
				options.ExpireTimeSpan = TimeSpan.FromMinutes(30);
				options.SlidingExpiration = true;
				options.Cookie.HttpOnly = true;
				options.Cookie.Name = "GreenZoneAuthCookie";
				options.Cookie.IsEssential = true; // Make the cookie essential
				options.Cookie.Path = "/"; // Set the cookie path to root
				options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Ensure the cookie is only sent over HTTPS
				options.Cookie.SameSite = SameSiteMode.Strict; // Adjust SameSite attribute as needed
			});

			builder.Services.AddAuthentication(opt =>
			{
				opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
				opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
			})
				.AddJwtBearer(options =>
				{
					var jwtSettings = builder.Configuration.GetSection("Jwt");
					options.TokenValidationParameters = new TokenValidationParameters
					{
						ValidateIssuer = true,
						ValidateAudience = true,
						ValidateLifetime = true,
						ValidateIssuerSigningKey = true,
						ValidIssuer = jwtSettings["Issuer"],
						ValidAudience = jwtSettings["Audience"],
						IssuerSigningKey = new SymmetricSecurityKey(
							Encoding.UTF8.GetBytes(jwtSettings["Key"]))
					};
				});

			builder.Services.AddRepositoryRegistration();
			builder.Services.AddServiceRegistration();



			var app = builder.Build();

			// Configure the HTTP request pipeline.
			if (app.Environment.IsDevelopment())
			{
				app.UseSwagger();
				app.UseSwaggerUI();
			}

			app.UseHttpsRedirection();

			app.UseAuthentication();
			app.UseAuthorization();

			app.UseSession();

			// Seed Roles
			using (var scope = app.Services.CreateScope())
			{
				var services = scope.ServiceProvider;
				try
				{
					// Ensure the database is created
					var context = services.GetRequiredService<GreenZoneDBContext>();
					await context.Database.MigrateAsync();
					// Set up roles
					await DBHelper.SetRoles(services);
				}
				catch (Exception ex)
				{
					// Handle exceptions (e.g., log them)
					Console.WriteLine($"An error occurred while initializing the database: {ex.Message}");
				}

			}

			app.MapControllers();

			app.Run();
		}
	}
}
