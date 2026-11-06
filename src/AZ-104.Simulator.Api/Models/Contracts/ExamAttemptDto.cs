namespace Simulator.Api.Models.Contracts;

/// <summary>Un tentativo dello storico: alimenta il grafico "Your progress" della pagina della certificazione.</summary>
public sealed record ExamAttemptDto
{
    public required int Id { get; init; }
    public required string CertificationId { get; init; }
    public required string Mode { get; init; }
    public required string DrawMode { get; init; }
    public required int QuestionCount { get; init; }
    public required int Score { get; init; }
    public required DateTimeOffset StartTime { get; init; }
    public required DateTimeOffset EndTime { get; init; }
    public required DateTimeOffset CompletedAt { get; init; }
}
