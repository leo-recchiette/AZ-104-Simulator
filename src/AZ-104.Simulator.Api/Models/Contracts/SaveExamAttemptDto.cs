namespace Simulator.Api.Models.Contracts;

/// <summary>
/// Punteggio e numero di domande li calcola il server dalle risposte: il client non puo' registrare un punteggio
/// diverso da quello che darebbero. StudyLaterQuestions sono numeri di domanda; quelli che non stanno in Answers
/// si ignorano.
/// </summary>
public sealed record SaveExamAttemptDto
{
    public required string CertificationId { get; init; }
    public required string Mode { get; init; }
    public required DateTimeOffset StartTime { get; init; }
    public required DateTimeOffset EndTime { get; init; }
    public required IReadOnlyList<AnswerSubmissionDto> Answers { get; init; }
    public required string DrawMode { get; init; }
    public required IReadOnlyList<int> StudyLaterQuestions { get; init; }
}
