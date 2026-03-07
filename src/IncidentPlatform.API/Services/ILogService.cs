using IncidentPlatform.API.Models;

namespace IncidentPlatform.API.Services;

public interface ILogService
{
    Task<LogEntry> CreateLogAsync(Guid incidentId, LogEntry log);
    Task<List<LogEntry>> GetLogsByIncidentIdAsync(Guid incidentId);
}
