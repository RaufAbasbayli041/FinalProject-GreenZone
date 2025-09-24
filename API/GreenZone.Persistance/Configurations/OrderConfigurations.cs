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
    public class OrderConfigurations : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.Property(o => o.TotalAmount)
                   .IsRequired()
                   .HasColumnType("decimal(18,2)");
            builder.Property(o => o.ShippingAddress)
                     .IsRequired()
                     .HasMaxLength(500);
            builder.Property(o => o.OrderDate)
                     .IsRequired()
                     .HasDefaultValueSql("GETUTCDATE()");
            builder.HasOne(o => o.Customer)
                     .WithMany(c => c.Orders)
                     .HasForeignKey(o => o.CustomerId)
                     .OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(o => o.OrderStatus)
                        .WithMany(os => os.Orders)
                        .HasForeignKey(o => o.OrderStatusId)
                        .OnDelete(DeleteBehavior.Restrict);
            builder.HasMany(o => o.OrderItems)
                     .WithOne(oi => oi.Order)
                     .HasForeignKey(oi => oi.OrderId)
                     .OnDelete(DeleteBehavior.Restrict);
            builder.HasMany(o => o.Deliveries)
                        .WithOne(d => d.Order)
                        .HasForeignKey(d => d.OrderId)
                        .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
