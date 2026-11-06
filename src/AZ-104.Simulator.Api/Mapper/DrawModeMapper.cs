using Simulator.Api.Models.Domains;

namespace Simulator.Api.Mapper;

/// <summary>Stringhe di Postgres e del JSON ("random", "least_seen") -> enum C#.</summary>
public static class DrawModeMapper
{
    /// <summary>Senza indicazioni l'estrazione non dipende dallo storico.</summary>
    public const string Default = "random";

    public static readonly IReadOnlyList<string> Values = ["random", "least_seen"];

    public static bool TryFromDb(string? value, out DrawMode mode)
    {
        (var valid, mode) = value switch
        {
            "random" => (true, DrawMode.Random),
            "least_seen" => (true, DrawMode.LeastSeen),
            _ => (false, default),
        };
        return valid;
    }

    public static bool IsValid(string? value) => TryFromDb(value, out _);
}
