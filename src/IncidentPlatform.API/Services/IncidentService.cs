using IncidentPlatform.API.Models;
using IncidentPlatform.API.Repositories;

namespace IncidentPlatform.API.Services;

public interface IIncidentService
{
    Task<Incident> CreateIncidentAsync(IncidentDTO dto);
    Task<IEnumerable<Incident>> GetAllIncidentsAsync();
    Task<Incident?> GetIncidentByIdAsync(Guid id);
    Task<Incident?> UpdateIncidentAsync(Guid id, IncidentDTO dto);
    Task<bool> DeleteIncidentAsync(Guid id);
}

public class IncidentService : IIncidentService
{
    private readonly IIncidentRepository _repo;
    public IncidentService(IIncidentRepository repo) => _repo = repo;

    public async Task<Incident> CreateIncidentAsync(IncidentDTO dto)
    {
        var incident = new Incident
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Description = dto.Description
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

        await _repo.UpdateAsync(incident);

        return incident;
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
