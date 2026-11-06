namespace Simulator.Api.Models.Contracts;

/// <summary>Question e CorrectAnswer sono null se la domanda non esiste piu' dopo un reimport.</summary>
public sealed record AttemptAnswerDto
{
    public required int QuestionNumber { get; init; }
    public required IReadOnlyList<string> UserAnswers { get; init; }
    public required QuestionDto? Question { get; init; }
    public required QuestionAnswerDto? CorrectAnswer { get; init; }
    public bool StudyLater { get; init; }
}
