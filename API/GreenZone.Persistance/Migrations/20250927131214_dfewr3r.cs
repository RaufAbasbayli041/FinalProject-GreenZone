using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace GreenZone.Persistance.Migrations
{
    /// <inheritdoc />
    public partial class dfewr3r : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "DeliveryStatuses");

            migrationBuilder.DropColumn(
                name: "ActualDate",
                table: "Deliveries");

            migrationBuilder.DropColumn(
                name: "InstallerName",
                table: "Deliveries");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "Deliveries");

            migrationBuilder.DropColumn(
                name: "ScheduledDate",
                table: "Deliveries");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "DeliveryStatuses",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.AddColumn<int>(
                name: "StatusType",
                table: "DeliveryStatuses",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeliveredAt",
                table: "Deliveries",
                type: "datetime2",
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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
                name: "StatusType",
                table: "DeliveryStatuses");

            migrationBuilder.DropColumn(
                name: "DeliveredAt",
                table: "Deliveries");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "DeliveryStatuses",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "DeliveryStatuses",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "ActualDate",
                table: "Deliveries",
                type: "datetime2",
                nullable: true,
                defaultValueSql: "GETUTCDATE()");

            migrationBuilder.AddColumn<string>(
                name: "InstallerName",
                table: "Deliveries",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "Deliveries",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "ScheduledDate",
                table: "Deliveries",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()");
        }
    }
}
