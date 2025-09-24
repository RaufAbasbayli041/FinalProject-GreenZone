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
    public class DeliveryStatusConfigurations : IEntityTypeConfiguration<DeliveryStatus>
    {       
        public void Configure(EntityTypeBuilder<DeliveryStatus> builder)
        {
            builder.Property(ds => ds.Name)
                .IsRequired()
                .HasMaxLength(50);
            builder.Property(ds => ds.Description)
                .HasMaxLength(200);
            builder.HasMany(ds => ds.Deliveries)
                .WithOne(d => d.DeliveryStatus)
                .HasForeignKey(d => d.DeliveryStatusId)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
