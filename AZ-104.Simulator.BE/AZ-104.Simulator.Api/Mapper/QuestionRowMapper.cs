using Simulator.Api.Models.Domains;

namespace Simulator.Api.Mapper;

internal static class QuestionRowMapper
{
    internal static Question ToQuestion(this QuestionRow row) => new()
    {
        Id = row.Id,
        Number = row.Number,
        Type = QuestionTypeMapper.FromDb(row.Type),
        AnswerLayout = row.AnswerLayout,
        Text = row.Text,
        Explanation = row.Explanation,
        AnswerText = row.AnswerText,
        Note = row.Note,
        Source = row.Source,
        GroupId = row.GroupId,
        GroupType = row.GroupType,
        VariantGroup = row.VariantGroup,
    };
}
