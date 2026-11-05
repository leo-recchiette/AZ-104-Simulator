using Dapper;
using Simulator.Api.Models.Domains;
using Npgsql;

namespace Simulator.Api.Repositories;

public sealed class CertificationRepository : ICertificationRepository
{
    private readonly NpgsqlDataSource _dataSource;

    public CertificationRepository(NpgsqlDataSource dataSource)
    {
        _dataSource = dataSource;
    }

    public async Task<IReadOnlyList<Certification>> GetAllAsync(CancellationToken cancellationToken)
    {
        const string sql = """
            SELECT c.vendor AS "Vendor", c.id AS "Id", count(*)::int AS "QuestionCount",
                   c.exam_question_count AS "ExamQuestionCount", c.exam_time_limit_minutes AS "ExamTimeLimitMinutes"
            FROM certifications c
            JOIN questions q ON q.certification_id = c.id
            GROUP BY c.id
            ORDER BY c.vendor, c.id
            """;
        var command = new CommandDefinition(sql, cancellationToken: cancellationToken);

        await using var connection = await _dataSource.OpenConnectionAsync(cancellationToken);
        var rows = await connection.QueryAsync<Certification>(command);
        return rows.ToList();
    }
}
