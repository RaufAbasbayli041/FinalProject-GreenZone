using GreenZone.Application.Extensions;
using GreenZone.Application.Profiles;
using GreenZone.Persistance.Database;
using GreenZone.Persistance.Extensions;
using Microsoft.EntityFrameworkCore; 
using Microsoft.Extensions.DependencyInjection;

namespace GreenZone.API
{
    public class Program
    {
        public static void Main(string[] args)
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

            app.UseAuthorization();
            app.UseAuthentication();


            app.MapControllers();

            app.Run();
        }
    }
}
