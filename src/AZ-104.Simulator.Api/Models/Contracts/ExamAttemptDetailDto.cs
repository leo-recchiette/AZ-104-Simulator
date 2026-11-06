namespace Simulator.Api.Models.Contracts;

public sealed record ExamAttemptDetailDto
{
    public required ExamAttemptDto Attempt { get; init; }
    public required IReadOnlyList<AttemptAnswerDto> Answers { get; init; }
}
