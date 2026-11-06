namespace Simulator.Api.Models.Contracts;

/// <summary>
/// La domanda prima della risposta, senza la soluzione. Il campo valorizzato dipende da
/// AnswerLayout, non da Type:
///   Options        - MultipleChoice, con SelectCount lettere da scegliere.
///   DraggableItems - 'ordered_answer', distrattori compresi, con SequenceLength passi.
///   Prompts        - 'selection' e 'yes_no', una riga ciascuno.
/// SelectCount e SequenceLength li dice gia' il testo della domanda ("Which two...").
/// UnorderedAnswer: gli elementi di DraggableItems formano un insieme, l'ordine non conta.
/// VariantGroup serve al client per non riproporre una variante gia' vista quando ripesca il bank.
/// </summary>
public sealed record QuestionDto
{
    public required int Number { get; init; }
    public required string Type { get; init; }
    public required string Text { get; init; }
    public required IReadOnlyList<OptionDto> Options { get; init; }
    public required int SelectCount { get; init; }
    public required IReadOnlyList<string> DraggableItems { get; init; }
    public required int SequenceLength { get; init; }
    public required IReadOnlyList<PromptOptionsDto> Prompts { get; init; }
    public required IReadOnlyList<string> Images { get; init; }
    public required string? GroupId { get; init; }
    public required string? GroupType { get; init; }
    public required string? VariantGroup { get; init; }
    public bool UnorderedAnswer { get; init; }
}
