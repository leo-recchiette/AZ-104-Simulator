using Simulator.Api.Models.Domains;
using Simulator.Api.Services;
using FluentAssertions;

namespace Simulator.Api.Tests.Services;

[TestClass]
public sealed class ScoreServiceTests
{
    [TestMethod]
    public void Should_Score_MultipleChoiceAnswer_By_Component()
    {
        var question = MultipleChoice(Option(letter: "B", isCorrect: true), Option(letter: "D", isCorrect: true), Option(letter: "E", isCorrect: true));
        var sut = new ScoreService();

        var actual = sut.Score(question, ["B", "D", "A"]);

        actual.Should().Be((2, 3));
    }

    [TestMethod]
    public void Should_Not_Throw_On_A_Null_Letter()
    {
        // JSON malformato ([null]): una risposta null vale come non data, invece di un 500.
        var question = MultipleChoice(Option(letter: "B", isCorrect: true));
        var sut = new ScoreService();

        var actual = sut.Score(question, [null!, "b"]);

        actual.Should().Be((1, 1));
    }

    [TestMethod]
    public void Should_Score_RowBasedAnswer_Positionally()
    {
        var question = Rows(QuestionType.Hotspot, "Blob", "Container");
        var sut = new ScoreService();

        var actual = sut.Score(question, ["Blob", "Object"]);

        actual.Should().Be((1, 2));
    }

    [TestMethod]
    public void Should_Score_MultiValueRow_Only_On_Exact_Set_Match()
    {
        // Domanda 242: risposta salvata come "{Read,List}", scelte dell'utente unite da "\n".
        var question = Rows(QuestionType.Hotspot, "{Read,List}");
        var sut = new ScoreService();
        var fullMatch = (Earned: 1, Total: 1);
        var noMatch = (Earned: 0, Total: 1);

        sut.Score(question, ["Read\nList"]).Should().Be(fullMatch);
        sut.Score(question, ["List\nRead"]).Should().Be(fullMatch);
        // Come grading.ts: un "\n" in coda non aggiunge una scelta vuota.
        sut.Score(question, ["Read\nList\n"]).Should().Be(fullMatch);
        sut.Score(question, ["Read"]).Should().Be(noMatch);
        sut.Score(question, ["Read\nList\nWrite"]).Should().Be(noMatch);
    }

    [TestMethod]
    public void Should_Score_An_Unordered_Answer_Regardless_Of_Position()
    {
        // Domanda 23: gli oggetti da creare sono un insieme, l'ordine in cui si trascinano non conta.
        var ordered = Rows(QuestionType.DragAndDrop, "Hyper-V site", "Recovery Services vault", "Replication policy");
        var unordered = ordered with { Question = ordered.Question with { UnorderedAnswer = true } };
        var submitted = new[] { "Replication policy", "Hyper-V site", "Endpoint" };
        var sut = new ScoreService();

        sut.Score(unordered, submitted).Should().Be((2, 3));
        sut.Score(ordered, submitted).Should().Be((0, 3));
    }

    [TestMethod]
    public void Should_Not_Throw_When_A_Row_Was_Never_Answered()
    {
        // Regressione: una riga mai toccata arriva come null e mandava in 500 l'intera submission.
        var question = Rows(QuestionType.Hotspot, "Blob", "Container");
        var sut = new ScoreService();

        var actual = sut.Score(question, ["Blob", null!]);

        actual.Should().Be((1, 2));
    }

    #region Utils

    private static QuestionAggregate MultipleChoice(params Option[] options) => TestQuestions.Aggregate(Question(QuestionType.MultipleChoice), options);

    private static QuestionAggregate Rows(QuestionType type, params string[] answers) =>
        TestQuestions.Aggregate(Question(type), answerRows: answers.Select((answer, i) => new AnswerRow { Id = i + 1, QuestionId = 1, Prompt = "", Answer = answer }).ToList());

    private static Question Question(QuestionType type) => new()
    {
        Id = 1,
        CertificationId = "az-104",
        Number = 1,
        Type = type,
        Text = "",
        Explanation = "",
        AnswerText = "",
    };

    private static Option Option(string letter, bool isCorrect) => new()
    {
        QuestionId = 1,
        Letter = letter,
        Text = "",
        IsCorrect = isCorrect,
    };

    #endregion
}
