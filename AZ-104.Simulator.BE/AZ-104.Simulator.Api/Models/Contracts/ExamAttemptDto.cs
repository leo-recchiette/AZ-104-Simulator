namespace Simulator.Api.Models.Contracts;

/// <summary>Un tentativo dello storico: alimenta il grafico "Your progress" della mode-select.</summary>
public sealed record ExamAttemptDto(
    int Id,
    string Mode,
    string DrawMode,
    int QuestionCount,
    double Percentage,
    DateTimeOffset StartTime,
    DateTimeOffset EndTime,
    DateTimeOffset CompletedAt);
