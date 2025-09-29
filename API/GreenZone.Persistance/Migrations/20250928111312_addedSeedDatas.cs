using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace GreenZone.Persistance.Migrations
{
    /// <inheritdoc />
    public partial class addedSeedDatas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.InsertData(
                table: "DeliveryStatuses",
                columns: new[] { "Id", "CreatedAt", "IsDeleted", "Name", "StatusType", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("229b1fab-1d73-4c76-a733-2b4a4a77a680"), new DateTime(2025, 9, 28, 11, 13, 11, 939, DateTimeKind.Utc).AddTicks(4495), false, "Created", 1, new DateTime(2025, 9, 28, 11, 13, 11, 939, DateTimeKind.Utc).AddTicks(4499) },
                    { new Guid("23896158-df8d-4055-9df8-60a395e55ecb"), new DateTime(2025, 9, 28, 11, 13, 11, 939, DateTimeKind.Utc).AddTicks(4516), false, "Delivered", 3, new DateTime(2025, 9, 28, 11, 13, 11, 939, DateTimeKind.Utc).AddTicks(4516) },
                    { new Guid("b1256336-14c1-4cc7-8706-374bd32803e4"), new DateTime(2025, 9, 28, 11, 13, 11, 939, DateTimeKind.Utc).AddTicks(4518), false, "Cancelled", 4, new DateTime(2025, 9, 28, 11, 13, 11, 939, DateTimeKind.Utc).AddTicks(4518) },
                    { new Guid("df3fa1b8-52d8-407a-8ba2-5ab8325892fb"), new DateTime(2025, 9, 28, 11, 13, 11, 939, DateTimeKind.Utc).AddTicks(4504), false, "In Progress", 2, new DateTime(2025, 9, 28, 11, 13, 11, 939, DateTimeKind.Utc).AddTicks(4505) }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "DeliveryStatuses",
                keyColumn: "Id",
                keyValue: new Guid("229b1fab-1d73-4c76-a733-2b4a4a77a680"));

            migrationBuilder.DeleteData(
                table: "DeliveryStatuses",
                keyColumn: "Id",
                keyValue: new Guid("23896158-df8d-4055-9df8-60a395e55ecb"));

            migrationBuilder.DeleteData(
                table: "DeliveryStatuses",
                keyColumn: "Id",
                keyValue: new Guid("b1256336-14c1-4cc7-8706-374bd32803e4"));

            migrationBuilder.DeleteData(
                table: "DeliveryStatuses",
                keyColumn: "Id",
                keyValue: new Guid("df3fa1b8-52d8-407a-8ba2-5ab8325892fb"));

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
    }
}
