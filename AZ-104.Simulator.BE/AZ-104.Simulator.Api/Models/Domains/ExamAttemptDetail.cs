namespace Simulator.Api.Models.Domains;

public sealed record ExamAttemptDetail(ExamAttempt Attempt, IReadOnlyList<ExamAttemptAnswer> Answers);
