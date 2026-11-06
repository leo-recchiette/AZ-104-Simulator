using Simulator.Api.Models.Domains;

namespace Simulator.Api.Tests;

/// <summary>Un QuestionAggregate con le sole parti che il test valorizza.</summary>
internal static class TestQuestions
{
    public static QuestionAggregate Aggregate(
        Question question,
        IReadOnlyList<Option>? options = null,
        IReadOnlyList<AnswerRow>? answerRows = null,
        IReadOnlyList<AnswerRowOption>? rowOptions = null,
        IReadOnlyList<QuestionImage>? images = null) => new()
    {
        Question = question,
        Options = options ?? [],
        AnswerRows = answerRows ?? [],
        RowOptions = rowOptions ?? [],
        Images = images ?? [],
    };
}
