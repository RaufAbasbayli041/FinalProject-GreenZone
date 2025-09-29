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
    public class DeliveryConfigurations : IEntityTypeConfiguration<Delivery>
    {
        public void Configure(EntityTypeBuilder<Delivery> builder)
        { 
            builder.Property(d => d.DeliveredAt)
                   .IsRequired(false); 
             
            builder.HasOne(d => d.Order)
                   .WithMany(o => o.Deliveries)
                   .HasForeignKey(d => d.OrderId)
                   .OnDelete(DeleteBehavior.Restrict);
             
            builder.HasOne(d => d.DeliveryStatus)
                   .WithMany(ds => ds.Deliveries)
                   .HasForeignKey(d => d.DeliveryStatusId)
                   .OnDelete(DeleteBehavior.Restrict);
             
            builder.HasIndex(d => d.OrderId);
        }
    }
}
