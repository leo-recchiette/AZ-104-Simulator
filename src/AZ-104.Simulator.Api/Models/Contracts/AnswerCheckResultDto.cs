namespace Simulator.Api.Models.Contracts;

/// <summary>CorrectAnswer e' null se QuestionNumber non esiste: non fa fallire l'intera batch.</summary>
public sealed record AnswerCheckResultDto
{
    public required int QuestionNumber { get; init; }
    public required IReadOnlyList<string> UserAnswers { get; init; }
    public required QuestionAnswerDto? CorrectAnswer { get; init; }
}
