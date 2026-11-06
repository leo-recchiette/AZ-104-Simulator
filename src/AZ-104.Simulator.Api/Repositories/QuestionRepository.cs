using Dapper;
using Simulator.Api.Mapper;
using Simulator.Api.Models.Domains;
using Npgsql;

namespace Simulator.Api.Repositories;

public sealed class QuestionRepository : IQuestionRepository
{
    private readonly NpgsqlDataSource _dataSource;

    public QuestionRepository(NpgsqlDataSource dataSource)
    {
        _dataSource = dataSource;
    }

    // Le colonne si legano alle proprieta' per nome (MatchNamesWithUnderscores, in Program.cs): l'alias serve solo
    // dove il nome e' diverso.
    private const string SelectColumns = """
        id, certification_id, number, type, answer_layout, question AS text, explanation, answer_text, note,
        group_id, group_type, variant_group, unordered_answer
        """;

    /// <summary>
    /// Un gruppo e una famiglia di varianti sono un'unita' sola. '~' e '#' non compaiono mai in un
    /// group_id, quindi le chiavi non collidono.
    /// </summary>
    private const string UnitKey = "COALESCE(group_id, '~' || variant_group, '#' || number)";

    public async Task<IReadOnlyList<QuestionAggregate>> GetRandomAsync(string certificationId, int count, DrawMode drawMode, CancellationToken cancellationToken)
    {
        // LeastSeen: prima le unita' proposte meno volte nelle sessioni salvate, a caso fra le pari merito.
        // seen conta le sessioni, non le righe: un gruppo ha una riga per domanda in ogni sessione.
        // Una famiglia di varianti conta per intero, e ne esce la variante proposta meno volte.
        // Random: times e' sempre 0 e l'ordine e' solo il sorteggio.
        // Contano solo i tentativi della stessa certificazione: altrove lo stesso numero e' un'altra domanda.
        var leastSeen = drawMode is DrawMode.LeastSeen;
        var seenCte = leastSeen
            ? $"""
              seen AS (
                  SELECT {UnitKey} AS unit_key, count(DISTINCT a.attempt_id) AS times
                  FROM exam_attempt_answers a
                  JOIN exam_attempts t ON t.id = a.attempt_id
                  JOIN questions q ON q.certification_id = t.certification_id AND q.number = a.question_number
                  WHERE t.certification_id = @certificationId
                  GROUP BY 1
              ),
              seen_questions AS (
                  SELECT a.question_number, count(DISTINCT a.attempt_id) AS times
                  FROM exam_attempt_answers a
                  JOIN exam_attempts t ON t.id = a.attempt_id
                  WHERE t.certification_id = @certificationId
                  GROUP BY 1
              ),
              """
            : "";
        var times = leastSeen ? "COALESCE(s.times, 0)" : "0";
        var seenJoin = leastSeen ? "LEFT JOIN seen s ON s.unit_key = u.unit_key" : "";
        var questionTimes = leastSeen ? "COALESCE(sq.times, 0)" : "0";
        var seenQuestionsJoin = leastSeen ? "LEFT JOIN seen_questions sq ON sq.question_number = q.number" : "";

        // candidates: di una famiglia di varianti passa un membro solo, dei gruppi tutti.
        var sql = $"""
            WITH {seenCte}
            candidates AS (
                SELECT question_number, unit_key
                FROM (
                    SELECT q.number AS question_number, {UnitKey} AS unit_key, q.variant_group,
                           row_number() OVER (PARTITION BY q.variant_group ORDER BY {questionTimes}, random()) AS variant_rank
                    FROM questions q
                    {seenQuestionsJoin}
                    WHERE q.certification_id = @certificationId
                ) c
                WHERE variant_group IS NULL OR variant_rank = 1
            ),
            picked AS (
                SELECT u.unit_key, {times} AS times, random() AS draw
                FROM (
                    SELECT DISTINCT unit_key
                    FROM candidates
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
            JOIN candidates c ON c.question_number = q.number
            JOIN units u ON u.unit_key = c.unit_key
            WHERE q.certification_id = @certificationId
            ORDER BY u.ord, q.number
            """;

        await using var connection = await _dataSource.OpenConnectionAsync(cancellationToken);
        var rows = await connection.QueryAsync<QuestionRow>(new CommandDefinition(sql, new { certificationId, count }, cancellationToken: cancellationToken));
        return await LoadAggregatesAsync(rows.Select(r => r.ToQuestion()).ToList(), cancellationToken);
    }

    public async Task<IReadOnlyList<QuestionAggregate>> GetByNumbersAsync(string certificationId, IReadOnlyCollection<int> numbers, CancellationToken cancellationToken)
    {
        if (numbers.Count == 0)
            return [];

        var sql = $"SELECT {SelectColumns} FROM questions WHERE certification_id = @certificationId AND number = ANY(@numbers)";
        var command = new CommandDefinition(sql, new { certificationId, numbers = numbers.ToArray() }, cancellationToken: cancellationToken);

        await using var connection = await _dataSource.OpenConnectionAsync(cancellationToken);
        var rows = await connection.QueryAsync<QuestionRow>(command);
        return await LoadAggregatesAsync(rows.Select(r => r.ToQuestion()).ToList(), cancellationToken);
    }

    /// <summary>Pool, righe di risposta (con i loro pool) e immagini: tutto quello che serve a mostrare e correggere.</summary>
    private async Task<IReadOnlyList<QuestionAggregate>> LoadAggregatesAsync(IReadOnlyList<Question> questions, CancellationToken cancellationToken)
    {
        if (questions.Count == 0)
            return [];

        var ids = questions.Select(q => q.Id).ToArray();
        var options = await QueryAsync<Option>(
            "SELECT question_id, letter, text, is_correct FROM options WHERE question_id = ANY(@ids) ORDER BY question_id, ord",
            new { ids }, cancellationToken);
        var answerRows = await QueryAsync<AnswerRow>(
            "SELECT id, question_id, prompt, answer FROM answer_rows WHERE question_id = ANY(@ids) ORDER BY question_id, ord",
            new { ids }, cancellationToken);
        var rowOptions = await QueryAsync<AnswerRowOption>(
            "SELECT answer_row_id, text FROM answer_row_options WHERE answer_row_id = ANY(@rowIds) ORDER BY answer_row_id, ord",
            new { rowIds = answerRows.Select(r => r.Id).ToArray() }, cancellationToken);
        var images = await QueryAsync<QuestionImage>(
            "SELECT question_id, kind, ord, filename FROM question_images WHERE question_id = ANY(@ids) ORDER BY question_id, kind, ord",
            new { ids }, cancellationToken);

        var optionsByQuestion = options.ToLookup(o => o.QuestionId);
        var rowsByQuestion = answerRows.ToLookup(r => r.QuestionId);
        var rowOptionsByRow = rowOptions.ToLookup(o => o.AnswerRowId);
        var imagesByQuestion = images.ToLookup(i => i.QuestionId);

        return questions
            .Select(q => new QuestionAggregate
            {
                Question = q,
                Options = optionsByQuestion[q.Id].ToList(),
                AnswerRows = rowsByQuestion[q.Id].ToList(),
                RowOptions = rowsByQuestion[q.Id].SelectMany(r => rowOptionsByRow[r.Id]).ToList(),
                Images = imagesByQuestion[q.Id].ToList(),
            })
            .ToList();
    }

    private async Task<IReadOnlyList<T>> QueryAsync<T>(string sql, object parameters, CancellationToken cancellationToken)
    {
        await using var connection = await _dataSource.OpenConnectionAsync(cancellationToken);
        var rows = await connection.QueryAsync<T>(new CommandDefinition(sql, parameters, cancellationToken: cancellationToken));
        return rows.ToList();
    }
}
