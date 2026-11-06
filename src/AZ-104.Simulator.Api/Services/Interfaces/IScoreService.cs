using Simulator.Api.Models.Domains;

namespace Simulator.Api.Services.Interfaces;

public interface IScoreService
{
    (int Earned, int Total) Score(QuestionAggregate question, IReadOnlyList<string> userAnswers);
}
