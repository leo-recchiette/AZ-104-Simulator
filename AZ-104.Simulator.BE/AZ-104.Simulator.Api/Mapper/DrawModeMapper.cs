using Simulator.Api.Models.Domains;

namespace Simulator.Api.Mapper;

/// <summary>Enum C# <-> stringhe di Postgres e del JSON ("random", "least_seen").</summary>
public static class DrawModeMapper
{
    /// <summary>Senza indicazioni l'estrazione non dipende dallo storico.</summary>
    public const string Default = "random";

    public static readonly IReadOnlyList<string> Values = ["random", "least_seen"];

    public static bool IsValid(string? value) => value is not null && Values.Contains(value);

    public static DrawMode FromDb(string value) => value switch
    {
        "random" => DrawMode.Random,
        "least_seen" => DrawMode.LeastSeen,
        _ => throw new ArgumentOutOfRangeException(nameof(value), value, "Modalita' di estrazione sconosciuta."),
    };

    public static string ToDb(DrawMode mode) => mode switch
    {
        DrawMode.Random => "random",
        DrawMode.LeastSeen => "least_seen",
        _ => throw new ArgumentOutOfRangeException(nameof(mode), mode, null),
    };
}
