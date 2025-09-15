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
    public class ProductConfigurations : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.Property(p => p.Title)
                   .IsRequired()
                   .HasMaxLength(50);
            builder.Property(p => p.Description)
                .IsRequired()
                .HasMaxLength(50);
            builder.Property(p => p.PricePerSquareMeter)
                   .IsRequired()
                   .HasColumnType("decimal(18,2()");
            builder.HasOne(p=>p.Category)
                .WithMany(c=>c.Products)
                .HasForeignKey(p=>p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
            builder.HasMany(p => p.Documents)
                .WithOne(d => d.Product)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
            builder.HasMany(p => p.OrderItems)
                .WithOne(oi => oi.Product)
                .HasForeignKey(oi => oi.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
            builder.Property(p => p.ImageUrl)
                .HasMaxLength(500)
                .HasColumnType("nvarchar(500)");
            builder.HasMany(p => p.BasketItems)
                .WithOne(ci => ci.Product)
                .HasForeignKey(ci => ci.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
            builder.Property(p => p.MinThickness)
                .IsRequired();
            builder.Property(p => p.MaxThickness)
                .IsRequired();




        }
    }
}
