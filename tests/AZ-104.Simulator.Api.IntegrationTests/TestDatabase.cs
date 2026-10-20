using Dapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;

namespace Simulator.Api.IntegrationTests;

/// <summary>Svuota il database a ogni test: solo simulator_tests, quello di sviluppo contiene lo storico vero.</summary>
internal static class TestDatabase
{
    private const string Name = "simulator_tests";

    public static async Task ResetAsync(IServiceProvider services)
    {
        var connectionString = ConnectionString(services);
        var database = new NpgsqlConnectionStringBuilder(connectionString).Database;
        if (database != Name)
            Assert.Inconclusive($"I test di integrazione girano solo sul database '{Name}', non su '{database}': lanciali con make test.");

        var seed = await File.ReadAllTextAsync(Path.Combine(AppContext.BaseDirectory, "Data", "seed.sql"));

        await using var connection = new NpgsqlConnection(connectionString);
        await connection.ExecuteAsync("TRUNCATE questions, exam_attempts, active_session RESTART IDENTITY CASCADE");
        await connection.ExecuteAsync(seed);
    }

    public static async Task ExecuteAsync(IServiceProvider services, string sql)
    {
        await using var connection = new NpgsqlConnection(ConnectionString(services));
        await connection.ExecuteAsync(sql);
    }

    private static string ConnectionString(IServiceProvider services)
        => services.GetRequiredService<IConfiguration>().GetConnectionString("Default")
           ?? throw new InvalidOperationException("Connection string 'Default' non configurata.");
}
