using Simulator.Api.Mapper;
using Simulator.Api.Models.Contracts;
using Simulator.Api.Models.Domains;
using Simulator.Api.Repositories;
using Simulator.Api.Services.Interfaces;

namespace Simulator.Api.Services;

public sealed class ExamAttemptService : IExamAttemptService
{
    private readonly IExamAttemptRepository _repository;
    private readonly IExamResultService _examResultService;

    public ExamAttemptService(IExamAttemptRepository repository, IExamResultService examResultService)
    {
        _repository = repository;
        _examResultService = examResultService;
    }

    public async Task<ExamAttemptDto> SaveAttemptAsync(SaveExamAttemptDto request, CancellationToken cancellationToken)
    {
        var attempt = new ExamAttempt
        {
            Mode = request.Mode,
            DrawMode = request.DrawMode,
            QuestionCount = request.QuestionCount,
            Percentage = request.Percentage,
            StartTime = request.StartTime,
            EndTime = request.EndTime,
        };
        // Ordine di presentazione: per i gruppi non coincide con quello dei numeri.
        var answers = (request.Answers ?? [])
            .Select(a => new ExamAttemptAnswer
            {
                QuestionNumber = a.QuestionNumber,
                UserAnswers = a.UserAnswers ?? [],
            })
            .ToList();

        var saved = await _repository.InsertAsync(attempt, answers, cancellationToken);
        return saved.ToDto();
    }

    public async Task<IReadOnlyList<ExamAttemptDto>> GetAllAttemptsAsync(CancellationToken cancellationToken)
    {
        var attempts = await _repository.GetAllAsync(cancellationToken);
        return attempts.Select(a => a.ToDto()).ToList();
    }

    public async Task<ExamAttemptDetailDto?> GetAttemptDetailAsync(int id, CancellationToken cancellationToken)
    {
        var detail = await _repository.GetDetailAsync(id, cancellationToken);
        if (detail is null)
            return null;

        var submissions = detail.Answers
            .Select(a => new AnswerSubmissionDto(a.QuestionNumber, a.UserAnswers))
            .ToList();
        IReadOnlyList<AttemptAnswerDto> answers = submissions.Count == 0
            ? []
            : await _examResultService.ReviewAsync(submissions, cancellationToken);

        return new ExamAttemptDetailDto(detail.Attempt.ToDto(), answers);
    }
}
