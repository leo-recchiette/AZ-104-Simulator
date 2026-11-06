using Simulator.Api.Extensions;
using Simulator.Api.Models.Contracts;
using Simulator.Api.Models.Domains;

namespace Simulator.Api.Mapper;

public static class QuestionMapper
{
    private const string OrderedAnswer = "ordered_answer";
    private const string YesNo = "yes_no";
    private const string QuestionImageKind = "question";
    private static readonly string[] YesNoOptions = ["Yes", "No"];

    public static QuestionDto ToQuestionDto(this QuestionAggregate aggregate)
    {
        var question = aggregate.Question;
        var isMultipleChoice = question.Type == QuestionType.MultipleChoice;
        var isOrderedAnswer = question.AnswerLayout == OrderedAnswer;
        var isYesNo = question.AnswerLayout == YesNo;

        return new QuestionDto
        {
            Number = question.Number,
            Type = QuestionTypeMapper.ToDb(question.Type),
            Text = question.Text,
            Options = isMultipleChoice ? aggregate.Options.Select(o => new OptionDto { Letter = o.Letter!, Text = o.Text }).ToList() : [],
            SelectCount = isMultipleChoice ? aggregate.Options.Count(o => o.IsCorrect) : 0,
            DraggableItems = isOrderedAnswer ? aggregate.Options.Select(o => o.Text).ToList() : [],
            SequenceLength = isOrderedAnswer ? aggregate.AnswerRows.Count : 0,
            Prompts = isMultipleChoice || isOrderedAnswer
                ? []
                : aggregate.AnswerRows.Where(r => r.Prompt is not null).Select(r => new PromptOptionsDto
                {
                    Prompt = r.Prompt!,
                    Options = isYesNo ? YesNoOptions : aggregate.RowOptions.Where(o => o.AnswerRowId == r.Id).Select(o => o.Text).ToList(),
                    SelectCount = r.Answer.CorrectValueCount(),
                }).ToList(),
            Images = aggregate.Images.Where(i => i.Kind == QuestionImageKind).OrderBy(i => i.Ord).Select(i => i.ToPath(question.CertificationId)).ToList(),
            GroupId = question.GroupId,
            GroupType = question.GroupType,
            VariantGroup = question.VariantGroup,
            UnorderedAnswer = isOrderedAnswer && question.UnorderedAnswer,
        };
    }
}
