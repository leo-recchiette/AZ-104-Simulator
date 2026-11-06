using Simulator.Api.Extensions;
using Simulator.Api.Models.Domains;
using Simulator.Api.Services.Interfaces;

namespace Simulator.Api.Services;

public sealed class ScoreService : IScoreService
{
    /// <summary>
    /// Credito parziale come nell'esame Microsoft: un punto per componente giusto, niente tolto per
    /// quelli sbagliati. MultipleChoice e le sequenze senza ordine (unordered) confrontano per insieme,
    /// gli altri per posizione. Allineato a grading.ts. Una risposta null (JSON malformato) vale come non data.
    /// </summary>
    public (int Earned, int Total) Score(QuestionAggregate question, IReadOnlyList<string> userAnswers)
    {
        var rows = question.AnswerRows;

        if (question.Question.Type is QuestionType.MultipleChoice)
        {
            var correctLetters = question.Options.Where(o => o.IsCorrect).Select(o => o.Letter!).ToHashSet(StringComparer.OrdinalIgnoreCase);
            var chosen = Chosen(userAnswers);
            return (correctLetters.Count(chosen.Contains), correctLetters.Count);
        }

        if (question.Question.UnorderedAnswer)
        {
            // Riga per riga, come gradeUnordered: ogni elemento della soluzione vale se e' fra quelli scelti.
            var chosen = Chosen(userAnswers);
            return (rows.Count(r => chosen.Contains(r.Answer.Trim())), rows.Count);
        }

        var earned = rows.Where((row, i) => i < userAnswers.Count && userAnswers[i] is { } given && given.Trim().HasRowMatches(row.Answer)).Count();
        return (earned, rows.Count);
    }

    private static HashSet<string> Chosen(IReadOnlyList<string> userAnswers) =>
        userAnswers.OfType<string>().Select(a => a.Trim()).ToHashSet(StringComparer.OrdinalIgnoreCase);
}
