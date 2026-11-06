namespace Simulator.Api.Models.Contracts;

/// <summary>
/// UserAnswers dipende dalla forma della domanda:
///   MultipleChoice -> le lettere scelte, in qualsiasi ordine
///   sequenza       -> gli elementi nell'ordine scelto
///   righe          -> una risposta per riga, nell'ordine dei Prompts
/// </summary>
public sealed record AnswerSubmissionDto
{
    public required int QuestionNumber { get; init; }
    public required IReadOnlyList<string> UserAnswers { get; init; }
}
