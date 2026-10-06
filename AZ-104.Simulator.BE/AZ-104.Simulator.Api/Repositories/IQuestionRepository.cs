using Simulator.Api.Models.Domains;

namespace Simulator.Api.Repositories;

public interface IQuestionRepository
{
    Task<IReadOnlyList<Question>> GetRandomAsync(int count, QuestionType? type, DrawMode drawMode, CancellationToken cancellationToken);

    Task<IReadOnlyList<Question>> GetByNumbersAsync(IReadOnlyCollection<int> numbers, CancellationToken cancellationToken);

    Task<IReadOnlyList<Option>> GetOptionsAsync(IReadOnlyCollection<int> questionIds, CancellationToken cancellationToken);

    Task<IReadOnlyList<AnswerRow>> GetAnswerRowsAsync(IReadOnlyCollection<int> questionIds, CancellationToken cancellationToken);

    Task<IReadOnlyList<AnswerRowOption>> GetAnswerRowOptionsAsync(IReadOnlyCollection<int> answerRowIds, CancellationToken cancellationToken);

    Task<IReadOnlyList<QuestionImage>> GetImagesAsync(IReadOnlyCollection<int> questionIds, CancellationToken cancellationToken);
}
