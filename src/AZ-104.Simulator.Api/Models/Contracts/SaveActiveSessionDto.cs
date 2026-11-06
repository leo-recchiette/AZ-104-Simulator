namespace Simulator.Api.Models.Contracts;

/// <summary>Upsert dell'intera sessione, non un merge. Solo i numeri delle domande, non il testo.</summary>
public sealed record SaveActiveSessionDto
{
    public required string CertificationId { get; init; }
    public required string Mode { get; init; }
    public required IReadOnlyList<int> QuestionNumbers { get; init; }
    public required IReadOnlyDictionary<int, IReadOnlyList<string>> Answers { get; init; }
    public required IReadOnlyList<int> FlaggedIndexes { get; init; }
    public required int CurrentIndex { get; init; }
    public required int? TimeLimitSeconds { get; init; }
    public required bool AutoReveal { get; init; }
    public required bool OpenEnded { get; init; }
    public required bool LiveScore { get; init; }
    public required DateTimeOffset StartedAt { get; init; }
    public required DateTimeOffset SavedAt { get; init; }
    public required string DrawMode { get; init; }
    public required IReadOnlyList<int> StudyLaterQuestions { get; init; }
}
