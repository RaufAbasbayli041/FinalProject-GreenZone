using GreenZone.Domain.Entity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Persistance.Database
{
    public static class DBHelper
    {
        public static async Task SetRoles(IServiceProvider serviceProvider, ILogger logger = null)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            string[] roleNames = { "Admin", "Customer", "Employee" };
            foreach (var roleName in roleNames)
            {
                var roleExist = await roleManager.RoleExistsAsync(roleName);
                if (!roleExist)
                {
                    await roleManager.CreateAsync(new IdentityRole(roleName));
                    logger?.LogInformation($"Created role: {roleName}");
                }
            }

        }

        // method for adding admin 

        public static async Task CreateAdminUser(IServiceProvider serviceProvider, ILogger logger = null)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var config = serviceProvider.GetRequiredService<IConfiguration>();
            string adminUserEmail = "admin@greenzone.com";
            string adminUserPassword = "Admin123!";

            var adminUser = await userManager.FindByEmailAsync(adminUserEmail);
            if (adminUser == null)
            {
                var newAdminUser = new ApplicationUser
                {
                    UserName = adminUserEmail,
                    Email = adminUserEmail,
                    EmailConfirmed = true,
                    FirstName = "User",
                    LastName = "Admin", 
                };
                var createAdminResult = await userManager.CreateAsync(newAdminUser, adminUserPassword);
                if (createAdminResult.Succeeded)
                {
                    await userManager.AddToRoleAsync(newAdminUser, "Admin");
                    logger?.LogInformation($"Created admin user: {adminUserEmail}");
                }
                else
                {
                    var errors = string.Join(", ", createAdminResult.Errors.Select(e => e.Description));
                    logger?.LogError($"Failed to create admin user: {errors}");
                }
            }
            else
            {
                logger?.LogInformation($"Admin user already exists: {adminUserEmail}");
            }
        }

        // method for seeding the database
        public static async Task SeedDatabaseAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var services = scope.ServiceProvider;
            var loggerFactory = services.GetRequiredService<ILoggerFactory>();
            var logger = loggerFactory.CreateLogger("DatabaseSeed");

            try
            {
                var context = services.GetRequiredService<GreenZoneDBContext>();
                await context.Database.MigrateAsync(); // Apply migrations
                logger.LogInformation("Migrations applied");

                await SetRoles(services, logger);      // create roles
                await CreateAdminUser(services, logger);    // create admin user
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error seeding database");
            }
        }
    }
}
