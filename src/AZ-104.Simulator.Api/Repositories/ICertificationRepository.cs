using Simulator.Api.Models.Domains;

namespace Simulator.Api.Repositories;

public interface ICertificationRepository
{
    /// <summary>Le certificazioni che hanno almeno una domanda, in ordine di vendor e di id.</summary>
    Task<IReadOnlyList<Certification>> GetAllAsync(CancellationToken cancellationToken);
}
