using System.Text.Json;
using Dapper;
using Simulator.Api.Models.Domains;
using Npgsql;

namespace Simulator.Api.Repositories;

public sealed class ActiveSessionRepository : IActiveSessionRepository
{
    private readonly NpgsqlDataSource _dataSource;

    public ActiveSessionRepository(NpgsqlDataSource dataSource)
    {
        _dataSource = dataSource;
    }

    public async Task<ActiveSession?> GetAsync(CancellationToken cancellationToken)
    {
        const string sql = """
            SELECT mode AS "Mode", question_numbers AS "QuestionNumbers", answers::text AS "Answers",
                   flagged_indexes AS "FlaggedIndexes", current_index AS "CurrentIndex",
                   time_limit_seconds AS "TimeLimitSeconds", auto_reveal AS "AutoReveal",
                   open_ended AS "OpenEnded", live_score AS "LiveScore", draw_mode AS "DrawMode",
                   started_at AS "StartedAt", saved_at AS "SavedAt"
            FROM active_session
            WHERE id = 1
            """;

        await using var connection = await _dataSource.OpenConnectionAsync(cancellationToken);
        var row = await connection.QuerySingleOrDefaultAsync<ActiveSessionRow>(
            new CommandDefinition(sql, cancellationToken: cancellationToken));
        if (row is null)
            return null;

        var answers = JsonSerializer.Deserialize<Dictionary<int, IReadOnlyList<string>>>(row.Answers) ?? [];
        return new ActiveSession
        {
            Mode = row.Mode,
            QuestionNumbers = row.QuestionNumbers,
            Answers = answers,
            FlaggedIndexes = row.FlaggedIndexes,
            CurrentIndex = row.CurrentIndex,
            TimeLimitSeconds = row.TimeLimitSeconds,
            AutoReveal = row.AutoReveal,
            OpenEnded = row.OpenEnded,
            LiveScore = row.LiveScore,
            DrawMode = row.DrawMode,
            StartedAt = row.StartedAt,
            SavedAt = row.SavedAt,
        };
    }

    public async Task SaveAsync(ActiveSession session, CancellationToken cancellationToken)
    {
        const string sql = """
            INSERT INTO active_session (
                id, mode, question_numbers, answers, flagged_indexes, current_index,
                time_limit_seconds, auto_reveal, open_ended, live_score, draw_mode, started_at, saved_at, updated_at)
            VALUES (
                1, @Mode, @QuestionNumbers, @Answers::jsonb, @FlaggedIndexes, @CurrentIndex,
                @TimeLimitSeconds, @AutoReveal, @OpenEnded, @LiveScore, @DrawMode, @StartedAt, @SavedAt, now())
            ON CONFLICT (id) DO UPDATE SET
                mode = EXCLUDED.mode,
                question_numbers = EXCLUDED.question_numbers,
                answers = EXCLUDED.answers,
                flagged_indexes = EXCLUDED.flagged_indexes,
                current_index = EXCLUDED.current_index,
                time_limit_seconds = EXCLUDED.time_limit_seconds,
                auto_reveal = EXCLUDED.auto_reveal,
                open_ended = EXCLUDED.open_ended,
                live_score = EXCLUDED.live_score,
                draw_mode = EXCLUDED.draw_mode,
                started_at = EXCLUDED.started_at,
                saved_at = EXCLUDED.saved_at,
                updated_at = now()
            """;

        var parameters = new
        {
            session.Mode,
            QuestionNumbers = session.QuestionNumbers.ToArray(),
            Answers = JsonSerializer.Serialize(session.Answers),
            FlaggedIndexes = session.FlaggedIndexes.ToArray(),
            session.CurrentIndex,
            session.TimeLimitSeconds,
            session.AutoReveal,
            session.OpenEnded,
            session.LiveScore,
            session.DrawMode,
            session.StartedAt,
            session.SavedAt,
        };

        await using var connection = await _dataSource.OpenConnectionAsync(cancellationToken);
        await connection.ExecuteAsync(new CommandDefinition(sql, parameters, cancellationToken: cancellationToken));
    }

    public async Task DeleteAsync(CancellationToken cancellationToken)
    {
        const string sql = "DELETE FROM active_session WHERE id = 1";
        await using var connection = await _dataSource.OpenConnectionAsync(cancellationToken);
        await connection.ExecuteAsync(new CommandDefinition(sql, cancellationToken: cancellationToken));
    }
}
