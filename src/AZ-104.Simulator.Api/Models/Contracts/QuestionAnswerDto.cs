namespace Simulator.Api.Models.Contracts;

/// <summary>
/// CorrectLetters solo per MultipleChoice, AnswerRows per gli altri. Images ha la soluzione
/// compilata: da mostrare solo dopo la risposta.
/// </summary>
public sealed record QuestionAnswerDto
{
    public required int Number { get; init; }
    public required string Explanation { get; init; }
    public required string AnswerText { get; init; }
    public required string? Note { get; init; }
    public required IReadOnlyList<string> CorrectLetters { get; init; }
    public required IReadOnlyList<AnswerRowDto> AnswerRows { get; init; }
    public required IReadOnlyList<string> Images { get; init; }
}
