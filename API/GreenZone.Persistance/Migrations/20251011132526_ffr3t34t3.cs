using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace GreenZone.Persistance.Migrations
{
    /// <inheritdoc />
    public partial class ffr3t34t3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.DropColumn(
                name: "Description",
                table: "OrderStatuses");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "OrderStatuses",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldMaxLength: 100);

            migrationBuilder.AddColumn<int>(
                name: "StatusName",
                table: "OrderStatuses",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.InsertData(
                table: "DeliveryStatuses",
                columns: new[] { "Id", "CreatedAt", "IsDeleted", "Name", "StatusType", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), new DateTime(2025, 10, 11, 13, 25, 26, 9, DateTimeKind.Utc).AddTicks(9408), false, "Created", 1, new DateTime(2025, 10, 11, 13, 25, 26, 9, DateTimeKind.Utc).AddTicks(9410) },
                    { new Guid("22222222-2222-2222-2222-222222222222"), new DateTime(2025, 10, 11, 13, 25, 26, 9, DateTimeKind.Utc).AddTicks(9421), false, "In Transit", 2, new DateTime(2025, 10, 11, 13, 25, 26, 9, DateTimeKind.Utc).AddTicks(9422) },
                    { new Guid("33333333-3333-3333-3333-333333333333"), new DateTime(2025, 10, 11, 13, 25, 26, 9, DateTimeKind.Utc).AddTicks(9424), false, "Delivered", 3, new DateTime(2025, 10, 11, 13, 25, 26, 9, DateTimeKind.Utc).AddTicks(9424) },
                    { new Guid("44444444-4444-4444-4444-444444444444"), new DateTime(2025, 10, 11, 13, 25, 26, 9, DateTimeKind.Utc).AddTicks(9426), false, "Cancelled", 4, new DateTime(2025, 10, 11, 13, 25, 26, 9, DateTimeKind.Utc).AddTicks(9426) }
                });

            migrationBuilder.InsertData(
                table: "OrderStatuses",
                columns: new[] { "Id", "CreatedAt", "IsDeleted", "Name", "StatusName", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), new DateTime(2025, 10, 11, 13, 25, 26, 10, DateTimeKind.Utc).AddTicks(4395), false, "Pending", 1, new DateTime(2025, 10, 11, 13, 25, 26, 10, DateTimeKind.Utc).AddTicks(4395) },
                    { new Guid("22222222-2222-2222-2222-222222222222"), new DateTime(2025, 10, 11, 13, 25, 26, 10, DateTimeKind.Utc).AddTicks(4401), false, "Processing", 2, new DateTime(2025, 10, 11, 13, 25, 26, 10, DateTimeKind.Utc).AddTicks(4401) },
                    { new Guid("33333333-3333-3333-3333-333333333333"), new DateTime(2025, 10, 11, 13, 25, 26, 10, DateTimeKind.Utc).AddTicks(4403), false, "Shipped", 3, new DateTime(2025, 10, 11, 13, 25, 26, 10, DateTimeKind.Utc).AddTicks(4403) },
                    { new Guid("44444444-4444-4444-4444-444444444444"), new DateTime(2025, 10, 11, 13, 25, 26, 10, DateTimeKind.Utc).AddTicks(4409), false, "Delivered", 4, new DateTime(2025, 10, 11, 13, 25, 26, 10, DateTimeKind.Utc).AddTicks(4409) },
                    { new Guid("55555555-5555-5555-5555-555555555555"), new DateTime(2025, 10, 11, 13, 25, 26, 10, DateTimeKind.Utc).AddTicks(4411), false, "Cancelled", 5, new DateTime(2025, 10, 11, 13, 25, 26, 10, DateTimeKind.Utc).AddTicks(4411) },
                    { new Guid("66666666-6666-6666-6666-666666666666"), new DateTime(2025, 10, 11, 13, 25, 26, 10, DateTimeKind.Utc).AddTicks(4413), false, "Returned", 6, new DateTime(2025, 10, 11, 13, 25, 26, 10, DateTimeKind.Utc).AddTicks(4414) }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "DeliveryStatuses",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"));

            migrationBuilder.DeleteData(
                table: "DeliveryStatuses",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"));

            migrationBuilder.DeleteData(
                table: "DeliveryStatuses",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"));

            migrationBuilder.DeleteData(
                table: "DeliveryStatuses",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"));

            migrationBuilder.DeleteData(
                table: "OrderStatuses",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"));

            migrationBuilder.DeleteData(
                table: "OrderStatuses",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"));

            migrationBuilder.DeleteData(
                table: "OrderStatuses",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"));

            migrationBuilder.DeleteData(
                table: "OrderStatuses",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"));

            migrationBuilder.DeleteData(
                table: "OrderStatuses",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"));

            migrationBuilder.DeleteData(
                table: "OrderStatuses",
                keyColumn: "Id",
                keyValue: new Guid("66666666-6666-6666-6666-666666666666"));

            migrationBuilder.DropColumn(
                name: "StatusName",
                table: "OrderStatuses");

            migrationBuilder.AlterColumn<int>(
                name: "Name",
                table: "OrderStatuses",
                type: "int",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "OrderStatuses",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

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
    }
}
