using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;

namespace GreenZone.Persistance.Database
{
    public class GreenZoneDbContextFactory : IDesignTimeDbContextFactory<GreenZoneDBContext>
    {
        public GreenZoneDBContext CreateDbContext(string[] args)
        {
            // Строим конфигурацию, чтобы получить connection string
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory()) // путь к текущему каталогу проекта
                .AddJsonFile("appsettings.json") // читаем файл конфигурации
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<GreenZoneDBContext>();
            var connectionString = configuration.GetConnectionString("Default");

            optionsBuilder.UseSqlServer(connectionString);

            return new GreenZoneDBContext(optionsBuilder.Options);
        }
    }
}
