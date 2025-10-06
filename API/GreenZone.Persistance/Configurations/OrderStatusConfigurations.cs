using GreenZone.Domain.Entity;
using GreenZone.Domain.Enum;
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
    public class OrderStatusConfigurations : IEntityTypeConfiguration<OrderStatus>
    {
        public void Configure(EntityTypeBuilder<OrderStatus> builder)
        {

            builder.HasData(
                new OrderStatus { Id = Guid.Parse("11111111-1111-1111-1111-111111111111"), Name = "Pending", StatusName = OrderStatusName.Pending },
                new OrderStatus { Id = Guid.Parse("22222222-2222-2222-2222-222222222222"), Name = "Processing", StatusName = OrderStatusName.Processing },
                new OrderStatus { Id = Guid.Parse("33333333-3333-3333-3333-333333333333"), Name = "Shipped", StatusName = OrderStatusName.Shipped },
                new OrderStatus { Id = Guid.Parse("44444444-4444-4444-4444-444444444444"), Name = "Delivered", StatusName = OrderStatusName.Delivered },
                new OrderStatus { Id = Guid.Parse("55555555-5555-5555-5555-555555555555"), Name = "Cancelled", StatusName = OrderStatusName.Cancelled },
                new OrderStatus { Id = Guid.Parse("66666666-6666-6666-6666-666666666666"), Name = "Returned", StatusName = OrderStatusName.Returned }
            );
            builder.HasMany(os => os.Orders)
                .WithOne(o => o.OrderStatus)
                .HasForeignKey(o => o.OrderStatusId);
        }
    }
}
