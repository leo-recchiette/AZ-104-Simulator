namespace Simulator.Api.Models.Domains;

/// <summary>Prompt e' null per le sequenze: la risposta e' l'ordine stesso.</summary>
public sealed record AnswerRow
{
    public required int Id { get; init; }
    public required int QuestionId { get; init; }
    public string? Prompt { get; init; }
    public required string Answer { get; init; }
}
