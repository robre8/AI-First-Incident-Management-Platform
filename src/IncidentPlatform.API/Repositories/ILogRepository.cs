using IncidentPlatform.API.Models;

namespace IncidentPlatform.API.Repositories;

public interface ILogRepository
{
    Task AddAsync(LogEntry log);
    Task<List<LogEntry>> GetByIncidentIdAsync(Guid incidentId);
}
