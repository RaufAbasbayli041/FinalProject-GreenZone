using GreenZone.Application.Extensions;
using GreenZone.Application.Profiles;
using GreenZone.Domain.Entity;
using GreenZone.Persistance.Database;
using GreenZone.Persistance.Extensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore; 
using Microsoft.Extensions.DependencyInjection;

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
           
            
            builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
                            .AddEntityFrameworkStores<GreenZoneDBContext>()
                            .AddDefaultTokenProviders();


            builder.Services.AddAutoMapper(typeof(CustomProfile).Assembly);

            builder.Services.AddValidatorsRegistration();


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
