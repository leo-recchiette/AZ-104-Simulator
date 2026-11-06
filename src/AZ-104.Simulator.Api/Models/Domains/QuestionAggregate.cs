namespace Simulator.Api.Models.Domains;

/// <summary>Una domanda con tutto quello che serve per mostrarla e correggerla: la carica intera QuestionRepository.</summary>
public sealed record QuestionAggregate
{
    public required Question Question { get; init; }

    /// <summary>Le lettere di un MultipleChoice o il pool di un 'ordered_answer'.</summary>
    public required IReadOnlyList<Option> Options { get; init; }

    public required IReadOnlyList<AnswerRow> AnswerRows { get; init; }

    /// <summary>I pool delle righe 'selection', di tutte le righe insieme: si distinguono per AnswerRowId.</summary>
    public required IReadOnlyList<AnswerRowOption> RowOptions { get; init; }

    public required IReadOnlyList<QuestionImage> Images { get; init; }
}
