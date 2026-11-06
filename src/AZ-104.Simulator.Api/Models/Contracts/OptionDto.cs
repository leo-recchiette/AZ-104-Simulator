namespace Simulator.Api.Models.Contracts;

public sealed record OptionDto
{
    public required string Letter { get; init; }
    public required string Text { get; init; }
}
