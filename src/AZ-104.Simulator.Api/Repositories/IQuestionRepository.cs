using Simulator.Api.Models.Domains;

namespace Simulator.Api.Repositories;

/// <summary>Restituisce domande intere (QuestionAggregate): chi le legge deve sempre mostrarle o correggerle.</summary>
public interface IQuestionRepository
{
    Task<IReadOnlyList<QuestionAggregate>> GetRandomAsync(string certificationId, int count, DrawMode drawMode, CancellationToken cancellationToken);

    /// <summary>In ordine qualsiasi; i numeri che non esistono non compaiono.</summary>
    Task<IReadOnlyList<QuestionAggregate>> GetByNumbersAsync(string certificationId, IReadOnlyCollection<int> numbers, CancellationToken cancellationToken);
}
