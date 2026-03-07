using IncidentPlatform.API.Infrastructure.Data;
using IncidentPlatform.API.Models;
using MongoDB.Driver;

namespace IncidentPlatform.API.Repositories;

public class LogRepository : ILogRepository
{
    private readonly MongoLogContext _context;

    public LogRepository(MongoLogContext context)
    {
        _context = context;
    }

    public async Task AddAsync(LogEntry log)
    {
        await _context.Logs.InsertOneAsync(log);
    }

    public async Task<List<LogEntry>> GetByIncidentIdAsync(Guid incidentId)
    {
        return await _context.Logs
            .Find(x => x.IncidentId == incidentId)
            .SortByDescending(x => x.Timestamp)
            .ToListAsync();
    }
}
