// Data/AppDbContext.cs
using Microsoft.EntityFrameworkCore;
using ReactApp2.Server.Models; 

namespace ReactApp2.Server.Data 
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        public DbSet<Animal> Animais { get; set; }
        public DbSet<Cuidado> Cuidados { get; set; }

    }
}

