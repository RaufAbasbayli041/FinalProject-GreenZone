using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenZone.Persistance.Migrations
{
    /// <inheritdoc />
    public partial class fdegt3rt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MaxThickness",
                table: "Products",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MinThickness",
                table: "Products",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaxThickness",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "MinThickness",
                table: "Products");
        }
    }
}
