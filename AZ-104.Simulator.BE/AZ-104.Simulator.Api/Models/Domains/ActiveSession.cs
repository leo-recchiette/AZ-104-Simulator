namespace Simulator.Api.Models.Domains;

/// <summary>Solo i numeri delle domande: il testo si rilegge al ripristino.</summary>
public sealed record ActiveSession
{
    /// <summary>"practice" | "exam".</summary>
    public required string Mode { get; init; }

    public required IReadOnlyList<int> QuestionNumbers { get; init; }

    /// <summary>Per questionNumber.</summary>
    public required IReadOnlyDictionary<int, IReadOnlyList<string>> Answers { get; init; }

    /// <summary>Indici in QuestionNumbers.</summary>
    public required IReadOnlyList<int> FlaggedIndexes { get; init; }

    public required int CurrentIndex { get; init; }
    public int? TimeLimitSeconds { get; init; }
    public required bool AutoReveal { get; init; }

    /// <summary>Practice a oltranza: QuestionNumbers sono solo le domande gia' proposte.</summary>
    public required bool OpenEnded { get; init; }

    /// <summary>Practice: percentuale dell'esame aggiornata a ogni risposta.</summary>
    public required bool LiveScore { get; init; }

    /// <summary>"random" | "least_seen": serve a ripescare il bank della Practice a oltranza dopo un ripristino.</summary>
    public required string DrawMode { get; init; }

    /// <summary>Orologio del client: la differenza e' il tempo giocato.</summary>
    public required DateTimeOffset StartedAt { get; init; }

    public required DateTimeOffset SavedAt { get; init; }
}
