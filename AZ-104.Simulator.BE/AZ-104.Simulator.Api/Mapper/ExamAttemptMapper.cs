using Simulator.Api.Models.Contracts;
using Simulator.Api.Models.Domains;

namespace Simulator.Api.Mapper;

public static class ExamAttemptMapper
{
    public static ExamAttemptDto ToDto(this ExamAttempt attempt) => new(
        attempt.Id, 
        attempt.Mode, 
        attempt.QuestionCount,
        attempt.Percentage,
        attempt.StartTime, 
        attempt.EndTime, 
        attempt.CompletedAt);
}
