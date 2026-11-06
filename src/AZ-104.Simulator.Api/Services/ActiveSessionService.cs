using Simulator.Api.Mapper;
using Simulator.Api.Models.Contracts;
using Simulator.Api.Repositories;
using Simulator.Api.Services.Interfaces;

namespace Simulator.Api.Services;

public sealed class ActiveSessionService : IActiveSessionService
{
    private readonly IActiveSessionRepository _repository;
    private readonly IQuestionService _questionService;

    public ActiveSessionService(IActiveSessionRepository repository, IQuestionService questionService)
    {
        _repository = repository;
        _questionService = questionService;
    }

    public async Task<ActiveSessionDto?> GetAsync(string certificationId, CancellationToken cancellationToken)
    {
        var session = await _repository.GetAsync(certificationId, cancellationToken);
        if (session is null)
            return null;

        var questions = await _questionService.GetByNumbersAsync(session.CertificationId, session.QuestionNumbers, cancellationToken);

        if (questions.Count != session.QuestionNumbers.Count)
        {
            await _repository.DeleteAsync(certificationId, cancellationToken);
            return null;
        }

        return session.ToDto(questions);
    }

    public Task SaveAsync(SaveActiveSessionDto request, CancellationToken cancellationToken)
    {
        // Senza risposte non c'e' niente da riprendere. Si cancella, non si salta: una sessione gia'
        // salvata e poi svuotata non deve restare sul server.
        if (!HasAnyAnswer(request.Answers))
            return _repository.DeleteAsync(request.CertificationId, cancellationToken);

        return _repository.SaveAsync(request.ToActiveSession(), cancellationToken);
    }

    public Task DeleteAsync(string certificationId, CancellationToken cancellationToken)
        => _repository.DeleteAsync(certificationId, cancellationToken);

    // answer null: JSON malformato, vale come nessuna risposta.
    private static bool HasAnyAnswer(IReadOnlyDictionary<int, IReadOnlyList<string>> answers)
        => answers.Values.Any(answer => answer is not null && answer.Any(value => !string.IsNullOrWhiteSpace(value)));
}
