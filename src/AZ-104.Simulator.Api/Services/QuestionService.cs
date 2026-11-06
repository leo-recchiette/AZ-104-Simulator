using Simulator.Api.Models.Contracts;
using Simulator.Api.Models.Domains;
using Simulator.Api.Mapper;
using Simulator.Api.Repositories;
using Simulator.Api.Services.Interfaces;

namespace Simulator.Api.Services;

public sealed class QuestionService : IQuestionService
{
    private readonly IQuestionRepository _repository;

    public QuestionService(IQuestionRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<QuestionDto>> GetRandomSetAsync(string certificationId, int count, DrawMode drawMode, CancellationToken cancellationToken)
    {
        var questions = await _repository.GetRandomAsync(certificationId, count, drawMode, cancellationToken);
        return questions.Select(q => q.ToQuestionDto()).ToList();
    }

    public async Task<IReadOnlyList<QuestionDto>> GetByNumbersAsync(string certificationId, IReadOnlyList<int> numbers, CancellationToken cancellationToken)
    {
        var byNumber = (await _repository.GetByNumbersAsync(certificationId, numbers, cancellationToken)).ToDictionary(q => q.Question.Number);
        return numbers
            .Where(byNumber.ContainsKey)
            .Select(n => byNumber[n].ToQuestionDto())
            .ToList();
    }
}
