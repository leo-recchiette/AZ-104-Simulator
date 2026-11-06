using Simulator.Api.Models.Domains;

namespace Simulator.Api.Repositories;

public interface IActiveSessionRepository
{
    /// <summary>Una sessione per certificazione: questa e' quella di "certificationId".</summary>
    Task<ActiveSession?> GetAsync(string certificationId, CancellationToken cancellationToken);

    /// <summary>Sostituisce la sessione della sua certificazione, lascia le altre.</summary>
    Task SaveAsync(ActiveSession session, CancellationToken cancellationToken);

    Task DeleteAsync(string certificationId, CancellationToken cancellationToken);
}
