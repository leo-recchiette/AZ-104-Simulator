using Simulator.Api.Models.Contracts;
using Simulator.Api.Models.Domains;
using Simulator.Api.Mapper;
using Simulator.Api.Repositories;
using Simulator.Api.Services.Interfaces;

namespace Simulator.Api.Services;

public sealed class ExamResultService : IExamResultService
{
    private readonly IQuestionRepository _repository;
    private readonly IScoreService _scorer;

    public ExamResultService(IQuestionRepository repository, IScoreService scorer)
    {
        _repository = repository;
        _scorer = scorer;
    }

    public async Task<ExamScoreDto> ScoreAsync(string certificationId, IReadOnlyList<AnswerSubmissionDto> submissions, CancellationToken cancellationToken)
    {
        var questions = await LoadAsync(certificationId, submissions, cancellationToken);

        var earnedTotal = 0;
        var pointsTotal = 0;
        foreach (var submission in submissions)
        {
            // Un numero inesistente non entra ne' nei punti ne' nel totale.
            if (!questions.TryGetValue(submission.QuestionNumber, out var question))
                continue;

            var (earned, total) = _scorer.Score(question, submission.UserAnswers);
            earnedTotal += earned;
            pointsTotal += total;
        }

        // Lineare: quello di Microsoft e' scalato sulla difficolta' delle domande, qui non riproducibile.
        var score = pointsTotal == 0 ? 0 : (int)Math.Round((double)ExamScoreDto.MaxScore * earnedTotal / pointsTotal);
        return new ExamScoreDto { Score = score };
    }

    public async Task<IReadOnlyList<AnswerCheckResultDto>> CheckAnswersAsync(string certificationId, IReadOnlyList<AnswerSubmissionDto> submissions, CancellationToken cancellationToken)
    {
        var questions = await LoadAsync(certificationId, submissions, cancellationToken);

        return submissions
            .Select(submission => new AnswerCheckResultDto
            {
                QuestionNumber = submission.QuestionNumber,
                UserAnswers = submission.UserAnswers,
                CorrectAnswer = questions.GetValueOrDefault(submission.QuestionNumber)?.ToAnswerDto(),
            })
            .ToList();
    }

    public async Task<IReadOnlyList<AttemptAnswerDto>> ReviewAsync(string certificationId, IReadOnlyList<AnswerSubmissionDto> submissions, CancellationToken cancellationToken)
    {
        var questions = await LoadAsync(certificationId, submissions, cancellationToken);

        return submissions
            .Select(submission =>
            {
                // Domanda sparita dopo un reimport: resta solo la risposta data.
                var question = questions.GetValueOrDefault(submission.QuestionNumber);
                return new AttemptAnswerDto
                {
                    QuestionNumber = submission.QuestionNumber,
                    UserAnswers = submission.UserAnswers,
                    Question = question?.ToQuestionDto(),
                    CorrectAnswer = question?.ToAnswerDto(),
                };
            })
            .ToList();
    }

    private async Task<Dictionary<int, QuestionAggregate>> LoadAsync(string certificationId, IReadOnlyList<AnswerSubmissionDto> submissions, CancellationToken cancellationToken)
    {
        var numbers = submissions.Select(s => s.QuestionNumber).Distinct().ToList();
        var questions = await _repository.GetByNumbersAsync(certificationId, numbers, cancellationToken);
        return questions.ToDictionary(q => q.Question.Number);
    }
}
