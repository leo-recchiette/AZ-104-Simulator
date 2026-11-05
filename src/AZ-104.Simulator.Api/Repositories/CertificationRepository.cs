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
            SELECT vendor AS "Vendor", certification_id AS "Id", count(*)::int AS "QuestionCount"
            FROM questions
            GROUP BY vendor, certification_id
            ORDER BY vendor, certification_id
            """;
        var command = new CommandDefinition(sql, cancellationToken: cancellationToken);

        await using var connection = await _dataSource.OpenConnectionAsync(cancellationToken);
        var rows = await connection.QueryAsync<Certification>(command);
        return rows.ToList();
    }
}
