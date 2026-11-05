using Simulator.Api.Models.Contracts;

namespace Simulator.Api.Services.Interfaces;

public interface IExamResultService
{
    Task<ExamScoreDto> ScoreAsync(string certificationId, IReadOnlyList<AnswerSubmissionDto> submissions, CancellationToken cancellationToken);

    Task<IReadOnlyList<AnswerCheckResultDto>> CheckAnswersAsync(string certificationId, IReadOnlyList<AnswerSubmissionDto> submissions, CancellationToken cancellationToken);

    /// <summary>Come CheckAnswersAsync, piu' il testo delle domande: per rileggere un tentativo dello storico.</summary>
    Task<IReadOnlyList<AttemptAnswerDto>> ReviewAsync(string certificationId, IReadOnlyList<AnswerSubmissionDto> submissions, CancellationToken cancellationToken);
}
