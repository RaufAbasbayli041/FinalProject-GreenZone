using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenZone.Persistance.Migrations
{
    /// <inheritdoc />
    public partial class dsgffgh45t6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "RefundDate",
                table: "Payments",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RefundDate",
                table: "Payments");
        }
    }
}
