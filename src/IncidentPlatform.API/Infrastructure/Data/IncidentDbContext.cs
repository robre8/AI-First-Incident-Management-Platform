using Microsoft.EntityFrameworkCore;
using IncidentPlatform.API.Models;

namespace IncidentPlatform.API.Infrastructure.Data;

public class IncidentDbContext : DbContext
{
    public IncidentDbContext(DbContextOptions<IncidentDbContext> options)
        : base(options) { }

    public DbSet<Incident> Incidents { get; set; }
}
