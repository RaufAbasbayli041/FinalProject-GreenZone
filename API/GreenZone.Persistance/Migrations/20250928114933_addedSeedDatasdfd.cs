using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace GreenZone.Persistance.Migrations
{
    /// <inheritdoc />
    public partial class addedSeedDatasdfd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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
                    { new Guid("0d12e2fa-d2fc-407a-bd3a-c9188e67c4bf"), new DateTime(2025, 9, 28, 11, 49, 33, 425, DateTimeKind.Utc).AddTicks(4731), false, "Delivered", 3, new DateTime(2025, 9, 28, 11, 49, 33, 425, DateTimeKind.Utc).AddTicks(4732) },
                    { new Guid("668a9789-37ec-46f1-9304-ae91534a1184"), new DateTime(2025, 9, 28, 11, 49, 33, 425, DateTimeKind.Utc).AddTicks(4721), false, "Created", 1, new DateTime(2025, 9, 28, 11, 49, 33, 425, DateTimeKind.Utc).AddTicks(4722) },
                    { new Guid("a189cecc-91ca-48b1-9791-faae15b0956f"), new DateTime(2025, 9, 28, 11, 49, 33, 425, DateTimeKind.Utc).AddTicks(4733), false, "Cancelled", 4, new DateTime(2025, 9, 28, 11, 49, 33, 425, DateTimeKind.Utc).AddTicks(4733) },
                    { new Guid("fb8687a0-a312-44c2-ae11-5f1c02dabc45"), new DateTime(2025, 9, 28, 11, 49, 33, 425, DateTimeKind.Utc).AddTicks(4730), false, "In Progress", 2, new DateTime(2025, 9, 28, 11, 49, 33, 425, DateTimeKind.Utc).AddTicks(4730) }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "DeliveryStatuses",
                keyColumn: "Id",
                keyValue: new Guid("0d12e2fa-d2fc-407a-bd3a-c9188e67c4bf"));

            migrationBuilder.DeleteData(
                table: "DeliveryStatuses",
                keyColumn: "Id",
                keyValue: new Guid("668a9789-37ec-46f1-9304-ae91534a1184"));

            migrationBuilder.DeleteData(
                table: "DeliveryStatuses",
                keyColumn: "Id",
                keyValue: new Guid("a189cecc-91ca-48b1-9791-faae15b0956f"));

            migrationBuilder.DeleteData(
                table: "DeliveryStatuses",
                keyColumn: "Id",
                keyValue: new Guid("fb8687a0-a312-44c2-ae11-5f1c02dabc45"));

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
    }
}
