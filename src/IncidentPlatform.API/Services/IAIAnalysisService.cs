using IncidentPlatform.API.Models;

namespace IncidentPlatform.API.Services;

public interface IAIAnalysisService
{
    Task<AIAnalysisResult> AnalyzeIncidentAsync(Incident incident, List<LogEntry> logs);
}
