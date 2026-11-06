using Simulator.Api.Models.Contracts;

namespace Simulator.Api.Services.Interfaces;

/// <summary>Le sessioni non ancora inviate, una per certificazione, per riprenderle dopo un reload.</summary>
public interface IActiveSessionService
{
    /// <summary>Null anche se non e' piu' ricostruibile.</summary>
    Task<ActiveSessionDto?> GetAsync(string certificationId, CancellationToken cancellationToken);

    Task SaveAsync(SaveActiveSessionDto request, CancellationToken cancellationToken);

    Task DeleteAsync(string certificationId, CancellationToken cancellationToken);
}
