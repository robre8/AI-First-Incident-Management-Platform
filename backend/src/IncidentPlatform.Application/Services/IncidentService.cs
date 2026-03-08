using IncidentPlatform.Application.Interfaces;
using IncidentPlatform.Domain.Entities;

namespace IncidentPlatform.Application.Services;

public class IncidentService : IIncidentService
{
    private readonly IIncidentRepository _repo;
    private static readonly HashSet<string> AllowedStatuses =
    [
        "Open",
        "In Progress",
        "Resolved",
        "Closed"
    ];

    public IncidentService(IIncidentRepository repo) => _repo = repo;

    public async Task<Incident> CreateIncidentAsync(IncidentDTO dto)
    {
        var incident = new Incident
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Description = dto.Description,
            Status = NormalizeStatus(dto.Status, "Open")
        };
        await _repo.AddAsync(incident);
        return incident;
    }

    public Task<IEnumerable<Incident>> GetAllIncidentsAsync() => _repo.GetAllAsync();

    public Task<Incident?> GetIncidentByIdAsync(Guid id) => _repo.GetByIdAsync(id);

    public async Task<Incident?> UpdateIncidentAsync(Guid id, IncidentDTO dto)
    {
        var incident = await _repo.GetByIdAsync(id);

        if (incident == null)
            return null;

        incident.Title = dto.Title;
        incident.Description = dto.Description;
        incident.Status = NormalizeStatus(dto.Status, incident.Status);

        await _repo.UpdateAsync(incident);
        return incident;
    }

    private static string NormalizeStatus(string? status, string fallback)
    {
        if (string.IsNullOrWhiteSpace(status))
            return fallback;

        var trimmed = status.Trim();

        return AllowedStatuses.Contains(trimmed) ? trimmed : fallback;
    }

    public async Task<bool> DeleteIncidentAsync(Guid id)
    {
        var incident = await _repo.GetByIdAsync(id);

        if (incident == null)
            return false;

        await _repo.DeleteAsync(incident);
        return true;
    }
}
