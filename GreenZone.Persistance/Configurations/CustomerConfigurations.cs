using GreenZone.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Persistance.Configurations
{
    public class CustomerConfigurations : IEntityTypeConfiguration<Customer>
    {
        public void Configure(EntityTypeBuilder<Customer> builder)
        {
            builder.Property(c => c.IdentityCard).IsRequired().HasMaxLength(100);
            builder.HasMany(c => c.Orders)
                      .WithOne(o => o.Customer)
                      .HasForeignKey(o => o.CustomerId)
                      .OnDelete(DeleteBehavior.Restrict);
            builder.HasMany(c => c.Payments)
                        .WithOne(p => p.Customer)
                        .HasForeignKey(p => p.CustomerId)
                        .OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(c => c.User)
                        .WithOne()
                        .HasForeignKey<Customer>(c => c.UserId)
                        .OnDelete(DeleteBehavior.Restrict); 

        }
    }
}
