namespace Simulator.Api.Models.Domains;

/// <summary>Riga grezza di Dapper: Type e' ancora la stringa del database.</summary>
internal sealed record QuestionRow
{
    public required int Id { get; init; }
    public required string CertificationId { get; init; }
    public required int Number { get; init; }
    public required string Type { get; init; }
    public string? AnswerLayout { get; init; }
    public required string Text { get; init; }
    public required string Explanation { get; init; }
    public required string AnswerText { get; init; }
    public string? Note { get; init; }
    public string? GroupId { get; init; }
    public string? GroupType { get; init; }
    public string? VariantGroup { get; init; }
    public required bool UnorderedAnswer { get; init; }
}
