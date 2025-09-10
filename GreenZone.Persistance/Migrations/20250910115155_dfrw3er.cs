using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenZone.Persistance.Migrations
{
    /// <inheritdoc />
    public partial class dfrw3er : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                newName: "IX_AspNetUsers_NormalizedEmail");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameIndex(
                name: "IX_AspNetUsers_NormalizedEmail",
                table: "AspNetUsers",
                newName: "EmailIndex");
        }
    }
}
