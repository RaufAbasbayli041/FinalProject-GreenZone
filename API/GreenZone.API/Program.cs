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
using Microsoft.OpenApi.Models;
using Serilog;
using System.Text;

namespace GreenZone.API
{
	public class Program
	{
		public static async Task Main(string[] args)
		{
            // === Serilog Configuration ===
            var logPath = Path.Combine(Directory.GetCurrentDirectory(), "Logs");
            if (!Directory.Exists(logPath))
                Directory.CreateDirectory(logPath);

            Log.Logger = new LoggerConfiguration()
                .WriteTo.File(Path.Combine(logPath, "log-.txt"), rollingInterval: RollingInterval.Day)
                .WriteTo.Console()
                .CreateLogger();

            var builder = WebApplication.CreateBuilder(args);
            builder.Host.UseSerilog();
             

            builder.Services.AddControllers();
			// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
			builder.Services.AddEndpointsApiExplorer();
			builder.Services.AddSwaggerGen();
			builder.Services.AddDbContext<GreenZoneDBContext>(options =>
			{
				options.UseSqlServer(builder.Configuration.GetConnectionString("Default"));
			});

            // === Identity Configuration ===
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

            // === CORS Configuration ===
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                     policy.WithOrigins(
                        "http://localhost:3000",
                        "https://localhost:3000",
                        "http://localhost:3003",
                        "https://localhost:3003")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials());
            });

            //builder.Services.AddScoped<IUserValidator<ApplicationUser>, CustomUserValidator>();

            builder.Services.AddAutoMapper(typeof(CustomProfile).Assembly);

			builder.Services.AddValidatorsRegistration();
			builder.Services.AddDistributedMemoryCache();

            // === Session Configuration ===
            builder.Services.AddSession(opt =>
            {
                opt.IdleTimeout = TimeSpan.FromMinutes(30);
                opt.Cookie.HttpOnly = true;
                opt.Cookie.IsEssential = true;
                opt.Cookie.Path = "/";
                opt.Cookie.SameSite = SameSiteMode.None;
                opt.Cookie.SecurePolicy = CookieSecurePolicy.Always;
            });

            // === Cookie Authentication ===
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

            // === JWT Authentication ===
            builder.Services.AddAuthentication(opt =>
			{
				opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
				opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                
			})
				.AddJwtBearer(options =>
				{
					var jwtSettings = builder.Configuration.GetSection("Jwt");
                    options.SaveToken = true;
                    options.RequireHttpsMetadata = false; //for https change to true
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

            // === Authorization Policies ===
            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("AdminOnly", policy =>
                {
                    policy.RequireRole("Admin");
                });

                options.AddPolicy("Customer", policy =>
                {
                    policy.RequireRole("Customer");
                });

                options.AddPolicy("Employee", policy =>
                {
                    policy.RequireRole("Employee");
                });
            });


            builder.Services.AddRepositoryRegistration();
			builder.Services.AddServiceRegistration();

            // === Swagger + JWT ===
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "GreenZone API", Version = "v1" });
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Введите токен так: *Bearer {your token}*"
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                    {
                        {
                            new OpenApiSecurityScheme
                            {
                                Reference = new OpenApiReference
                                {
                                    Type = ReferenceType.SecurityScheme,
                                    Id = "Bearer"
                                }
                            },
                            Array.Empty<string>()
                        }
                    });
            });

           
            builder.Services.AddHttpContextAccessor();

            var app = builder.Build();
            await DBHelper.SeedDatabaseAsync(app.Services);

            
            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
			{
				app.UseSwagger();
				app.UseSwaggerUI();
			}

			app.UseHttpsRedirection();

			app.UseCors("AllowFrontend");
			app.UseCookiePolicy();
			app.UseAuthentication();
			app.UseAuthorization();

            app.UseSession();

            app.MapControllers();

			app.Run();
		}

		  
    }
}
