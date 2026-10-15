namespace Simulator.Api.Models.Contracts;

/// <summary>
/// La domanda prima della risposta, senza la soluzione. Il campo valorizzato dipende da
/// AnswerLayout, non da Type:
///   Options        - MultipleChoice, con SelectCount lettere da scegliere.
///   DraggableItems - 'ordered_answer', distrattori compresi, con SequenceLength passi.
///   Prompts        - 'selection' e 'yes_no', una riga ciascuno.
/// SelectCount e SequenceLength li dice gia' il testo della domanda ("Which two...").
/// VariantGroup serve al client per non riproporre una variante gia' vista quando ripesca il bank.
/// </summary>
public sealed record QuestionDto(
    int Number,
    string Type,
    string Text,
    IReadOnlyList<OptionDto> Options,
    int SelectCount,
    IReadOnlyList<string> DraggableItems,
    int SequenceLength,
    IReadOnlyList<PromptOptionsDto> Prompts,
    IReadOnlyList<string> Images,
    string? GroupId,
    string? GroupType,
    string? VariantGroup);
