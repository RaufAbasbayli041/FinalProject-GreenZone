using GreenZone.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Persistance.Configurations
{
    public class ProductDocumentsConfigurations : IEntityTypeConfiguration<ProductDocuments>
    {
        public void Configure(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<ProductDocuments> builder)
        {
            builder.HasOne(pd => pd.Product)
                   .WithMany(p => p.Documents)
                   .HasForeignKey(pd => pd.ProductId)
                   .IsRequired()
                   .OnDelete(DeleteBehavior.Restrict);
            builder.Property(pd => pd.DocumentName)
                   .IsRequired()
                   .HasMaxLength(200)
                   .HasColumnType("nvarchar(200)");
            builder.Property(pd => pd.OriginalName)
                   .IsRequired(false)
                   .HasMaxLength(200)
                   .HasColumnType("nvarchar(200)");
            builder.Property(pd => pd.DocumentUrl)
                   .IsRequired()
                   .HasMaxLength(500)
                   .HasColumnType("nvarchar(500)");


        }
    }
}
