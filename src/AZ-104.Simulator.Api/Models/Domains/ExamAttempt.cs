namespace Simulator.Api.Models.Domains;

public sealed record ExamAttempt
{
    public int Id { get; init; }

    /// <summary>"practice" | "exam".</summary>
    public required string Mode { get; init; }

    /// <summary>"random" | "least_seen". I tentativi salvati prima della scelta valgono "random".</summary>
    public required string DrawMode { get; init; }

    public required int QuestionCount { get; init; }
    public required double Percentage { get; init; }
    public required DateTimeOffset StartTime { get; init; }
    public required DateTimeOffset EndTime { get; init; }
    public DateTimeOffset CompletedAt { get; init; }
}
