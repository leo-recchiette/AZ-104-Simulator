using Simulator.Api.Models.Contracts;
using Simulator.Api.Models.Domains;

namespace Simulator.Api.Services.Interfaces;

public interface IQuestionService
{
    Task<IReadOnlyList<QuestionDto>> GetRandomSetAsync(string certificationId, int count, DrawMode drawMode, CancellationToken cancellationToken);

    /// <summary>Nell'ordine richiesto; i numeri che non esistono piu' vengono omessi.</summary>
    Task<IReadOnlyList<QuestionDto>> GetByNumbersAsync(string certificationId, IReadOnlyList<int> numbers, CancellationToken cancellationToken);
}
