using Dapper;
using Simulator.Api.Mapper;
using Simulator.Api.Models.Domains;
using Npgsql;

namespace Simulator.Api.Repositories;

/// <summary>Implementazione su Postgres via Dapper.</summary>
public sealed class QuestionRepository : IQuestionRepository
{
    private readonly NpgsqlDataSource _dataSource;

    public QuestionRepository(NpgsqlDataSource dataSource)
    {
        _dataSource = dataSource;
    }

    private const string SelectColumns = """
        id, number, type, answer_layout AS "AnswerLayout", question AS "Text",
        explanation, answer_text AS "AnswerText", note, source,
        group_id AS "GroupId", group_type AS "GroupType"
        """;

    /// <summary>Il '#' non compare mai in un group_id, quindi le chiavi non collidono.</summary>
    private const string UnitKey = "COALESCE(group_id, '#' || number)";

    public async Task<IReadOnlyList<Question>> GetRandomAsync(int count, QuestionType? type, DrawMode drawMode, CancellationToken cancellationToken)
    {
        var typeFilter = type is null ? "" : "WHERE type = @type::question_type";

        // LeastSeen: prima le unita' proposte meno volte nelle sessioni salvate, a caso fra le pari merito.
        // seen conta le sessioni, non le righe: un gruppo ha una riga per domanda in ogni sessione.
        // Random: times e' sempre 0 e l'ordine e' solo il sorteggio.
        var leastSeen = drawMode is DrawMode.LeastSeen;
        var seenCte = leastSeen
            ? $"""
              seen AS (
                  SELECT {UnitKey} AS unit_key, count(DISTINCT a.attempt_id) AS times
                  FROM exam_attempt_answers a
                  JOIN questions q ON q.number = a.question_number
                  GROUP BY 1
              ),
              """
            : "";
        var times = leastSeen ? "COALESCE(s.times, 0)" : "0";
        var seenJoin = leastSeen ? "LEFT JOIN seen s ON s.unit_key = u.unit_key" : "";

        var sql = $"""
            WITH {seenCte}
            picked AS (
                SELECT u.unit_key, {times} AS times, random() AS draw
                FROM (
                    SELECT DISTINCT {UnitKey} AS unit_key
                    FROM questions
                    {typeFilter}
                ) u
                {seenJoin}
                ORDER BY times, draw
                LIMIT @count
            ),
            units AS (
                SELECT unit_key, row_number() OVER (ORDER BY times, draw) AS ord FROM picked
            )
            SELECT {SelectColumns}
            FROM questions q
            JOIN units u ON u.unit_key = COALESCE(q.group_id, '#' || q.number)
            ORDER BY u.ord, q.number
            """;

        var command = type is null
            ? new CommandDefinition(sql, new { count }, cancellationToken: cancellationToken)
            : new CommandDefinition(sql, new { count, type = QuestionTypeMapper.ToDb(type.Value) }, cancellationToken: cancellationToken);

        await using var connection = await _dataSource.OpenConnectionAsync(cancellationToken);
        var rows = await connection.QueryAsync<QuestionRow>(command);
        return rows.Select(r => r.ToQuestion()).ToList();
    }

    public async Task<IReadOnlyList<Question>> GetByNumbersAsync(IReadOnlyCollection<int> numbers, CancellationToken cancellationToken)
    {
        if (numbers.Count == 0)
            return [];

        var sql = $"SELECT {SelectColumns} FROM questions WHERE number = ANY(@numbers)";
        var command = new CommandDefinition(sql, new { numbers = numbers.ToArray() }, cancellationToken: cancellationToken);

        await using var connection = await _dataSource.OpenConnectionAsync(cancellationToken);
        var rows = await connection.QueryAsync<QuestionRow>(command);
        return rows.Select(r => r.ToQuestion()).ToList();
    }

    public async Task<IReadOnlyList<Option>> GetOptionsAsync(IReadOnlyCollection<int> questionIds, CancellationToken cancellationToken)
    {
        if (questionIds.Count == 0)
            return [];

        const string sql = """
            SELECT question_id AS "QuestionId", ord AS "Ord", letter, text, is_correct AS "IsCorrect"
            FROM options
            WHERE question_id = ANY(@questionIds)
            ORDER BY question_id, ord
            """;
        var command = new CommandDefinition(sql, new { questionIds = questionIds.ToArray() }, cancellationToken: cancellationToken);

        await using var connection = await _dataSource.OpenConnectionAsync(cancellationToken);
        var rows = await connection.QueryAsync<Option>(command);
        return rows.ToList();
    }

    public async Task<IReadOnlyList<AnswerRow>> GetAnswerRowsAsync(IReadOnlyCollection<int> questionIds, CancellationToken cancellationToken)
    {
        if (questionIds.Count == 0)
            return [];

        const string sql = """
            SELECT id AS "Id", question_id AS "QuestionId", ord AS "Ord", prompt, answer
            FROM answer_rows
            WHERE question_id = ANY(@questionIds)
            ORDER BY question_id, ord
            """;
        var command = new CommandDefinition(sql, new { questionIds = questionIds.ToArray() }, cancellationToken: cancellationToken);

        await using var connection = await _dataSource.OpenConnectionAsync(cancellationToken);
        var rows = await connection.QueryAsync<AnswerRow>(command);
        return rows.ToList();
    }

    public async Task<IReadOnlyList<AnswerRowOption>> GetAnswerRowOptionsAsync(IReadOnlyCollection<int> answerRowIds, CancellationToken cancellationToken)
    {
        if (answerRowIds.Count == 0)
            return [];

        const string sql = """
            SELECT answer_row_id AS "AnswerRowId", ord AS "Ord", text
            FROM answer_row_options
            WHERE answer_row_id = ANY(@answerRowIds)
            ORDER BY answer_row_id, ord
            """;
        var command = new CommandDefinition(sql, new { answerRowIds = answerRowIds.ToArray() }, cancellationToken: cancellationToken);

        await using var connection = await _dataSource.OpenConnectionAsync(cancellationToken);
        var rows = await connection.QueryAsync<AnswerRowOption>(command);
        return rows.ToList();
    }

    public async Task<IReadOnlyList<QuestionImage>> GetImagesAsync(IReadOnlyCollection<int> questionIds, CancellationToken cancellationToken)
    {
        if (questionIds.Count == 0)
            return [];

        const string sql = """
            SELECT question_id AS "QuestionId", kind AS "Kind", ord AS "Ord", filename AS "Filename"
            FROM question_images
            WHERE question_id = ANY(@questionIds)
            ORDER BY question_id, kind, ord
            """;
        var command = new CommandDefinition(sql, new { questionIds = questionIds.ToArray() }, cancellationToken: cancellationToken);

        await using var connection = await _dataSource.OpenConnectionAsync(cancellationToken);
        var rows = await connection.QueryAsync<QuestionImage>(command);
        return rows.ToList();
    }
}