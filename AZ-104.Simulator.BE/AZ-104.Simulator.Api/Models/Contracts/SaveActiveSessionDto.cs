using Simulator.Api.Mapper;

namespace Simulator.Api.Models.Contracts;

/// <summary>
/// Upsert dell'intera sessione, non un merge. Solo i numeri delle domande, non il testo. DrawMode ha un default:
/// un client vecchio che non lo manda pescava comunque a caso.
/// </summary>
public sealed record SaveActiveSessionDto(
    string Mode,
    IReadOnlyList<int> QuestionNumbers,
    IReadOnlyDictionary<int, IReadOnlyList<string>> Answers,
    IReadOnlyList<int> FlaggedIndexes,
    int CurrentIndex,
    int? TimeLimitSeconds,
    bool AutoReveal,
    bool OpenEnded,
    bool LiveScore,
    DateTimeOffset StartedAt,
    DateTimeOffset SavedAt,
    string DrawMode = DrawModeMapper.Default);
