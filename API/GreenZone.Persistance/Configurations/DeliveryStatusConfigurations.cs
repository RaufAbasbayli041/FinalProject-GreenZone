using GreenZone.Domain.Entity;
using GreenZone.Domain.Enum;
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
            builder. HasData(
                new DeliveryStatus { Id = Guid.NewGuid(), Name = "Created", StatusType = DeliveryStatusType.Created },
                new DeliveryStatus { Id = Guid.NewGuid(), Name = "In Progress", StatusType = DeliveryStatusType.InProgress },
                new DeliveryStatus { Id = Guid.NewGuid(), Name = "Delivered", StatusType = DeliveryStatusType.Delivered },
                new DeliveryStatus { Id = Guid.NewGuid(), Name = "Cancelled", StatusType = DeliveryStatusType.Cancelled }
            );
            
             
            builder.HasMany(ds => ds.Deliveries)
                .WithOne(d => d.DeliveryStatus)
                .HasForeignKey(d => d.DeliveryStatusId)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
