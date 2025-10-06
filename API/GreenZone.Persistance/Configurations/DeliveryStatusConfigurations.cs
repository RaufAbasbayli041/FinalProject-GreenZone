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
            builder.HasData(
                new DeliveryStatus { Id = Guid.Parse("11111111-1111-1111-1111-111111111111"), Name = "Created", StatusType = DeliveryStatusType.Created },
                new DeliveryStatus { Id = Guid.Parse("22222222-2222-2222-2222-222222222222"), Name = "In Transit", StatusType = DeliveryStatusType.InTransit },
                new DeliveryStatus { Id = Guid.Parse("33333333-3333-3333-3333-333333333333"), Name = "Delivered", StatusType = DeliveryStatusType.Delivered },
                new DeliveryStatus { Id = Guid.Parse("44444444-4444-4444-4444-444444444444"), Name = "Cancelled", StatusType = DeliveryStatusType.Cancelled }
           );


            builder.HasMany(ds => ds.Deliveries)
                .WithOne(d => d.DeliveryStatus)
                .HasForeignKey(d => d.DeliveryStatusId)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
