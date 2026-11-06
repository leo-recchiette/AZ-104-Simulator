namespace Simulator.Api.Models.Domains;

/// <summary>Nessun IsCorrect: la risposta della riga e' in AnswerRow.Answer.</summary>
public sealed record AnswerRowOption
{
    public required int AnswerRowId { get; init; }
    public required string Text { get; init; }
}
