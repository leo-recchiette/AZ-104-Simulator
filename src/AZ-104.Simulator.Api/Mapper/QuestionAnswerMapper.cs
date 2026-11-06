using Simulator.Api.Models.Contracts;
using Simulator.Api.Models.Domains;

namespace Simulator.Api.Mapper;

internal static class QuestionAnswerMapper
{
    private const string AnswerImageKind = "answer";

    internal static QuestionAnswerDto ToAnswerDto(this QuestionAggregate aggregate)
    {
        var question = aggregate.Question;
        return new QuestionAnswerDto
        {
            Number = question.Number,
            Explanation = question.Explanation,
            AnswerText = question.AnswerText,
            Note = question.Note,
            // Options e' non vuota anche per 'ordered_answer', ma li' e' il pool, non la risposta.
            CorrectLetters = question.Type == QuestionType.MultipleChoice
                ? aggregate.Options.Where(o => o.IsCorrect).Select(o => o.Letter!).ToList()
                : [],
            AnswerRows = aggregate.AnswerRows.Select(r => new AnswerRowDto { Prompt = r.Prompt, Answer = r.Answer }).ToList(),
            Images = aggregate.Images.Where(i => i.Kind == AnswerImageKind).OrderBy(i => i.Ord).Select(i => i.ToPath(question.CertificationId)).ToList(),
        };
    }
}
