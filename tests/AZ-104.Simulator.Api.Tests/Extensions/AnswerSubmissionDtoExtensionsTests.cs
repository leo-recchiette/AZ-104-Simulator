using Simulator.Api.Extensions;
using Simulator.Api.Models.Contracts;
using FluentAssertions;

namespace Simulator.Api.Tests.Extensions;

[TestClass]
public sealed class AnswerSubmissionDtoExtensionsTests
{
    [TestMethod]
    public void Should_Treat_An_Empty_Answer_List_As_Blank()
    {
        Submission([]).IsBlank().Should().BeTrue();
    }

    [TestMethod]
    public void Should_Treat_Untouched_Rows_As_Blank()
    {
        // Le righe non compilate arrivano come stringhe vuote.
        Submission(["", "  "]).IsBlank().Should().BeTrue();
    }

    [TestMethod]
    public void Should_Not_Be_Blank_When_A_Single_Row_Was_Filled()
    {
        // Una riga su tre basta a non scartare il tentativo.
        Submission(["", "Yes", ""]).IsBlank().Should().BeFalse();
    }

    [TestMethod]
    public void Should_Not_Be_Blank_When_Letters_Were_Selected()
    {
        Submission(["B", "D"]).IsBlank().Should().BeFalse();
    }

    private static AnswerSubmissionDto Submission(string[] userAnswers) => new() { QuestionNumber = 1, UserAnswers = userAnswers };
}
