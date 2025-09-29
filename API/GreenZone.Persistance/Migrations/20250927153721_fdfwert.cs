using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace GreenZone.Persistance.Migrations
{
    /// <inheritdoc />
    public partial class fdfwert : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "DeliveryStatuses",
                keyColumn: "Id",
                keyValue: new Guid("9f7d1ecc-45a6-4385-9a7f-97ffff4bbc94"));

            migrationBuilder.DeleteData(
                table: "DeliveryStatuses",
                keyColumn: "Id",
                keyValue: new Guid("ab0780e5-7530-4030-91ef-a0901ce5f63c"));

            migrationBuilder.DeleteData(
                table: "DeliveryStatuses",
                keyColumn: "Id",
                keyValue: new Guid("cc5e551a-b837-456c-854f-88f03051265e"));

            migrationBuilder.DeleteData(
                table: "DeliveryStatuses",
                keyColumn: "Id",
                keyValue: new Guid("f20b1051-1992-4315-8a67-03c192cbcea1"));

            migrationBuilder.DropColumn(
                name: "DocumentName",
                table: "ProductDocuments");

            migrationBuilder.DropColumn(
                name: "OriginalName",
                table: "ProductDocuments");

            migrationBuilder.InsertData(
                table: "DeliveryStatuses",
                columns: new[] { "Id", "CreatedAt", "IsDeleted", "Name", "StatusType", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("6db64785-df8d-4be4-9478-991d0e2b2e1f"), new DateTime(2025, 9, 27, 15, 37, 21, 160, DateTimeKind.Utc).AddTicks(3630), false, "In Progress", 2, new DateTime(2025, 9, 27, 15, 37, 21, 160, DateTimeKind.Utc).AddTicks(3630) },
                    { new Guid("912b816b-1228-442b-a93d-54636324d66b"), new DateTime(2025, 9, 27, 15, 37, 21, 160, DateTimeKind.Utc).AddTicks(3632), false, "Delivered", 3, new DateTime(2025, 9, 27, 15, 37, 21, 160, DateTimeKind.Utc).AddTicks(3632) },
                    { new Guid("cd3dd85a-ce8e-4108-afd6-0edc0cc9fed8"), new DateTime(2025, 9, 27, 15, 37, 21, 160, DateTimeKind.Utc).AddTicks(3642), false, "Cancelled", 4, new DateTime(2025, 9, 27, 15, 37, 21, 160, DateTimeKind.Utc).AddTicks(3642) },
                    { new Guid("e0a68d4f-3527-4d51-b889-13495ec405f2"), new DateTime(2025, 9, 27, 15, 37, 21, 160, DateTimeKind.Utc).AddTicks(3624), false, "Created", 1, new DateTime(2025, 9, 27, 15, 37, 21, 160, DateTimeKind.Utc).AddTicks(3626) }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "DeliveryStatuses",
                keyColumn: "Id",
                keyValue: new Guid("6db64785-df8d-4be4-9478-991d0e2b2e1f"));

            migrationBuilder.DeleteData(
                table: "DeliveryStatuses",
                keyColumn: "Id",
                keyValue: new Guid("912b816b-1228-442b-a93d-54636324d66b"));

            migrationBuilder.DeleteData(
                table: "DeliveryStatuses",
                keyColumn: "Id",
                keyValue: new Guid("cd3dd85a-ce8e-4108-afd6-0edc0cc9fed8"));

            migrationBuilder.DeleteData(
                table: "DeliveryStatuses",
                keyColumn: "Id",
                keyValue: new Guid("e0a68d4f-3527-4d51-b889-13495ec405f2"));

            migrationBuilder.AddColumn<string>(
                name: "DocumentName",
                table: "ProductDocuments",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "OriginalName",
                table: "ProductDocuments",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.InsertData(
                table: "DeliveryStatuses",
                columns: new[] { "Id", "CreatedAt", "IsDeleted", "Name", "StatusType", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("9f7d1ecc-45a6-4385-9a7f-97ffff4bbc94"), new DateTime(2025, 9, 27, 13, 12, 14, 446, DateTimeKind.Utc).AddTicks(23), false, "Delivered", 3, new DateTime(2025, 9, 27, 13, 12, 14, 446, DateTimeKind.Utc).AddTicks(24) },
                    { new Guid("ab0780e5-7530-4030-91ef-a0901ce5f63c"), new DateTime(2025, 9, 27, 13, 12, 14, 446, DateTimeKind.Utc).AddTicks(25), false, "Cancelled", 4, new DateTime(2025, 9, 27, 13, 12, 14, 446, DateTimeKind.Utc).AddTicks(26) },
                    { new Guid("cc5e551a-b837-456c-854f-88f03051265e"), new DateTime(2025, 9, 27, 13, 12, 14, 446, DateTimeKind.Utc).AddTicks(13), false, "Created", 1, new DateTime(2025, 9, 27, 13, 12, 14, 446, DateTimeKind.Utc).AddTicks(16) },
                    { new Guid("f20b1051-1992-4315-8a67-03c192cbcea1"), new DateTime(2025, 9, 27, 13, 12, 14, 446, DateTimeKind.Utc).AddTicks(21), false, "In Progress", 2, new DateTime(2025, 9, 27, 13, 12, 14, 446, DateTimeKind.Utc).AddTicks(21) }
                });
        }
    }
}
