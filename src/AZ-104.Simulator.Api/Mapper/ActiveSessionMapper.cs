using System.Text.Json;
using Simulator.Api.Models.Contracts;
using Simulator.Api.Models.Domains;

namespace Simulator.Api.Mapper;

public static class ActiveSessionMapper
{
    /// <summary>
    /// CurrentIndex si riporta dentro le domande (la validazione garantisce che ce ne sia almeno una). Le date
    /// passano in UTC: Npgsql scrive su timestamptz solo DateTimeOffset con offset zero.
    /// </summary>
    public static ActiveSession ToActiveSession(this SaveActiveSessionDto request) => new()
    {
        CertificationId = request.CertificationId,
        Mode = request.Mode,
        QuestionNumbers = request.QuestionNumbers,
        Answers = request.Answers,
        FlaggedIndexes = request.FlaggedIndexes,
        StudyLaterQuestions = request.StudyLaterQuestions,
        CurrentIndex = Math.Clamp(request.CurrentIndex, 0, request.QuestionNumbers.Count - 1),
        TimeLimitSeconds = request.TimeLimitSeconds,
        AutoReveal = request.AutoReveal,
        OpenEnded = request.OpenEnded,
        LiveScore = request.LiveScore,
        DrawMode = request.DrawMode,
        StartedAt = request.StartedAt.ToUniversalTime(),
        SavedAt = request.SavedAt.ToUniversalTime(),
    };

    /// <summary>answers e' il testo della colonna jsonb.</summary>
    internal static ActiveSession ToActiveSession(this ActiveSessionRow row) => new()
    {
        CertificationId = row.CertificationId,
        Mode = row.Mode,
        QuestionNumbers = row.QuestionNumbers,
        Answers = JsonSerializer.Deserialize<Dictionary<int, IReadOnlyList<string>>>(row.Answers) ?? [],
        FlaggedIndexes = row.FlaggedIndexes,
        StudyLaterQuestions = row.StudyLaterQuestions,
        CurrentIndex = row.CurrentIndex,
        TimeLimitSeconds = row.TimeLimitSeconds,
        AutoReveal = row.AutoReveal,
        OpenEnded = row.OpenEnded,
        LiveScore = row.LiveScore,
        DrawMode = row.DrawMode,
        StartedAt = row.StartedAt,
        SavedAt = row.SavedAt,
    };

    public static ActiveSessionDto ToDto(this ActiveSession session, IReadOnlyList<QuestionDto> questions) => new()
    {
        CertificationId = session.CertificationId,
        Mode = session.Mode,
        Questions = questions,
        Answers = session.Answers,
        FlaggedIndexes = session.FlaggedIndexes,
        CurrentIndex = session.CurrentIndex,
        TimeLimitSeconds = session.TimeLimitSeconds,
        AutoReveal = session.AutoReveal,
        OpenEnded = session.OpenEnded,
        LiveScore = session.LiveScore,
        DrawMode = session.DrawMode,
        StartedAt = session.StartedAt,
        SavedAt = session.SavedAt,
        StudyLaterQuestions = session.StudyLaterQuestions,
    };
}
