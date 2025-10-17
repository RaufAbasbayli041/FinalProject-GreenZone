using GreenZone.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Persistance.Configurations
{
    public class BasketConfigurations : IEntityTypeConfiguration<Basket>
    {
        public void Configure(EntityTypeBuilder<Basket> builder)
        { 
            builder.HasMany(c => c.BasketItems)
                   .WithOne(ci => ci.Basket)
                   .HasForeignKey(ci => ci.BasketId)
                   .OnDelete(DeleteBehavior.Cascade); 
            builder.HasOne(c => c.Customer)
       .WithOne(cu => cu.Basket) 
       .HasForeignKey<Basket>(c => c.CustomerId)
       .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
