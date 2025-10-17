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
    public class BasketItemConfigurations : IEntityTypeConfiguration<BasketItems>
    {
        public void Configure(EntityTypeBuilder<BasketItems> builder)
        {
            builder.HasOne(ci => ci.Basket)
                   .WithMany(c => c.BasketItems)
                   .HasForeignKey(ci => ci.BasketId)
                   .OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(ci => ci.Product)
                   .WithMany(p => p.BasketItems)
                   .HasForeignKey(ci => ci.ProductId)
                   .OnDelete(DeleteBehavior.Restrict);
            builder.Property(ci => ci.Quantity).HasPrecision(18, 4);
            builder.Ignore(ci => ci.TotalPrice);


        }
    }
    
}
