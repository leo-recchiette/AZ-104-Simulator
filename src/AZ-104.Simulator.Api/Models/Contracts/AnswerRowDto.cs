namespace Simulator.Api.Models.Contracts;

public sealed record AnswerRowDto
{
    public required string? Prompt { get; init; }
    public required string Answer { get; init; }
}
