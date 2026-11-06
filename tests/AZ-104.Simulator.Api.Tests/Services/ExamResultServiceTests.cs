using Simulator.Api.Models.Contracts;
using Simulator.Api.Models.Domains;
using Simulator.Api.Repositories;
using Simulator.Api.Services;
using FluentAssertions;
using NSubstitute;

namespace Simulator.Api.Tests.Services;

[TestClass]
public sealed class ExamResultServiceTests
{
    private readonly ExamResultService _sut = Sut(MultipleChoice(1, "Domanda di prova", correctLetter: "C"));

    private readonly ExamResultService _sutWithTenQuestions = Sut(Enumerable.Range(1, 10).Select(n => MultipleChoice(n, $"Domanda {n}", correctLetter: "A")).ToArray());

    [TestMethod]
    public async Task Should_Calculate_Score_Ignoring_Unknown_Questions()
    {
        var submissions = new[] { Submission(1, "C"), Submission(999, "X") };

        var actual = await _sut.ScoreAsync("az-104", submissions, CancellationToken.None);

        actual.Should().BeEquivalentTo(new ExamScoreDto { Score = 1000 });
    }

    [TestMethod]
    public async Task Should_Map_Answers_Into_CheckResults()
    {
        var actual = await _sut.CheckAnswersAsync("az-104", [Submission(1, "A")], CancellationToken.None);

        var expected = new AnswerCheckResultDto { QuestionNumber = 1, UserAnswers = ["A"], CorrectAnswer = ExpectedAnswer() };
        actual.Should().BeEquivalentTo([expected]);
    }

    [TestMethod]
    public async Task Should_Calculate_Score_When_Two_Of_Ten_Are_Wrong()
    {
        var actual = await _sutWithTenQuestions.ScoreAsync("az-104", Submissions(wrongNumbers: [9, 10]), CancellationToken.None);

        actual.Should().BeEquivalentTo(new ExamScoreDto { Score = 800 });
    }

    [TestMethod]
    public async Task Should_Calculate_Score_When_Three_Of_Ten_Are_Correct()
    {
        var actual = await _sutWithTenQuestions.ScoreAsync("az-104", Submissions(wrongNumbers: [4, 5, 6, 7, 8, 9, 10]), CancellationToken.None);

        actual.Should().BeEquivalentTo(new ExamScoreDto { Score = 300 });
    }

    [TestMethod]
    public async Task Should_Include_Question_Text_In_Review()
    {
        var actual = await _sut.ReviewAsync("az-104", [Submission(1, "A")], CancellationToken.None);

        actual.Should().ContainSingle();
        actual[0].UserAnswers.Should().BeEquivalentTo(["A"]);
        actual[0].Question!.Text.Should().Be("Domanda di prova");
        actual[0].Question!.Options.Should().BeEquivalentTo([new OptionDto { Letter = "C", Text = "Opzione corretta" }]);
        actual[0].CorrectAnswer.Should().BeEquivalentTo(ExpectedAnswer());
    }

    [TestMethod]
    public async Task Should_Review_Unknown_Question_Without_Text_Nor_Solution()
    {
        var actual = await _sut.ReviewAsync("az-104", [Submission(999, "B")], CancellationToken.None);

        var expected = new AttemptAnswerDto { QuestionNumber = 999, UserAnswers = ["B"], Question = null, CorrectAnswer = null };
        actual.Should().BeEquivalentTo([expected]);
    }

    [TestMethod]
    public async Task Should_Keep_Submission_Order_In_Review()
    {
        var submissions = new[] { 3, 1, 2 }.Select(n => Submission(n, "A")).ToList();

        var actual = await _sutWithTenQuestions.ReviewAsync("az-104", submissions, CancellationToken.None);

        // Ordine di presentazione, non numerico: conta per i gruppi.
        actual.Select(a => a.QuestionNumber).Should().Equal(3, 1, 2);
    }

    #region Utils

    /// <summary>Il repository ignora i numeri chiesti e restituisce sempre le domande passate.</summary>
    private static ExamResultService Sut(params QuestionAggregate[] questions)
    {
        var repository = Substitute.For<IQuestionRepository>();
        repository.GetByNumbersAsync("az-104", Arg.Any<IReadOnlyCollection<int>>(), Arg.Any<CancellationToken>()).Returns(questions);
        return new ExamResultService(repository, new ScoreService());
    }

    private static QuestionAggregate MultipleChoice(int number, string text, string correctLetter) => TestQuestions.Aggregate(
        new Question
        {
            Id = number,
            CertificationId = "az-104",
            Number = number,
            Type = QuestionType.MultipleChoice,
            Text = text,
            Explanation = "Spiegazione",
            AnswerText = $"{correctLetter}. Opzione corretta",
        },
        [new Option { QuestionId = number, Letter = correctLetter, Text = "Opzione corretta", IsCorrect = true }]);

    private static QuestionAnswerDto ExpectedAnswer() => new()
    {
        Number = 1,
        Explanation = "Spiegazione",
        AnswerText = "C. Opzione corretta",
        Note = null,
        CorrectLetters = ["C"],
        AnswerRows = [],
        Images = [],
    };

    private static AnswerSubmissionDto Submission(int number, string answer) => new() { QuestionNumber = number, UserAnswers = [answer] };

    private static IReadOnlyList<AnswerSubmissionDto> Submissions(IReadOnlyCollection<int> wrongNumbers) =>
        Enumerable.Range(1, 10).Select(n => Submission(n, wrongNumbers.Contains(n) ? "B" : "A")).ToList();

    #endregion
}
