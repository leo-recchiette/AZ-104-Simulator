namespace Simulator.Api.Models.Domains;

/// <summary>Riga grezza di Dapper: Type e' ancora la stringa del database.</summary>
internal sealed record QuestionRow(int Id, int Number, string Type, string? AnswerLayout,
    string Text, string Explanation, string AnswerText, string? Note, string Source,
    string? GroupId, string? GroupType, string? VariantGroup);
