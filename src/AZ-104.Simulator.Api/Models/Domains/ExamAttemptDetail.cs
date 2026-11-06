namespace Simulator.Api.Models.Domains;

public sealed record ExamAttemptDetail
{
    public required ExamAttempt Attempt { get; init; }
    public required IReadOnlyList<ExamAttemptAnswer> Answers { get; init; }
}
