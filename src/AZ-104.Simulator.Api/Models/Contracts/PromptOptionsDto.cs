namespace Simulator.Api.Models.Contracts;

/// <summary>
/// Un prompt/riga con le opzioni cliccabili tra cui scegliere. SelectCount e' quanti valori vanno
/// scelti: 1, tranne le righe con piu' risposte corrette (domanda 242).
/// </summary>
public sealed record PromptOptionsDto
{
    public required string Prompt { get; init; }
    public required IReadOnlyList<string> Options { get; init; }
    public required int SelectCount { get; init; }
}
