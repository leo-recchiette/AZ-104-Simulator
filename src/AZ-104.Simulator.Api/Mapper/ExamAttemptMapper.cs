using Simulator.Api.Models.Contracts;
using Simulator.Api.Models.Domains;

namespace Simulator.Api.Mapper;

public static class ExamAttemptMapper
{
    public static ExamAttemptDto ToDto(this ExamAttempt attempt) => new()
    {
        Id = attempt.Id,
        CertificationId = attempt.CertificationId,
        Mode = attempt.Mode,
        DrawMode = attempt.DrawMode,
        QuestionCount = attempt.QuestionCount,
        Score = attempt.Score,
        StartTime = attempt.StartTime,
        EndTime = attempt.EndTime,
        CompletedAt = attempt.CompletedAt,
    };
}
