using Simulator.Api.Mapper;
using Simulator.Api.Models.Contracts;
using Simulator.Api.Models.Domains;
using FluentAssertions;

namespace Simulator.Api.Tests.Mapper;

[TestClass]
public sealed class QuestionAnswerMapperTests
{
    [TestMethod]
    public void Should_Map_QuestionAggregate_Into_QuestionAnswerDto()
    {
        var question = Question();
        var options = Array.Empty<Option>();
        var answerRows = new[]
        {
            AnswerRow(id: 1, prompt: "Statement 1", answer: "Yes"),
            AnswerRow(id: 2, prompt: "Statement 2", answer: "No"),
        };
        var input = TestQuestions.Aggregate(question, options, answerRows);

        var sut = input.ToAnswerDto();

        var expected = QuestionAnswerDto(
            answerRows: [
                new AnswerRowDto { Prompt = "Statement 1", Answer = "Yes" },
                new AnswerRowDto { Prompt = "Statement 2", Answer = "No" }]);

        sut.Should().BeEquivalentTo(expected);
    }

    [TestMethod]
    public void Should_Not_Populate_CorrectLetters_For_NonMultipleChoice_Even_When_Options_Is_Not_Empty()
    {
        // Il pool di un 'ordered_answer' non sono lettere corrette: la risposta sta in AnswerRows.
        var question = Question() with { Type = QuestionType.DragAndDrop };
        var options = new[]
        {
            new Option { QuestionId = 1, Letter = null, Text = "An Azure Key Vault", IsCorrect = true },
            new Option { QuestionId = 1, Letter = null, Text = "An Azure Storage account", IsCorrect = false },
        };
        var answerRows = new[] { AnswerRow(id: 1, prompt: null, answer: "An Azure Key Vault") };
        var input = TestQuestions.Aggregate(question, options, answerRows);

        var sut = input.ToAnswerDto();

        sut.CorrectLetters.Should().BeEmpty();
    }

    [TestMethod]
    public void Should_Map_Only_AnswerKind_Images_Not_QuestionKind()
    {
        // Nella risposta corretta contano solo le immagini 'answer'.
        var question = Question();
        var images = new[]
        {
            new QuestionImage { QuestionId = 1, Kind = "question", Ord = 0, Filename = "q063_pre0.png" },
            new QuestionImage { QuestionId = 1, Kind = "answer", Ord = 1, Filename = "q063_post1.png" },
            new QuestionImage { QuestionId = 1, Kind = "answer", Ord = 0, Filename = "q063_post0.png" },
        };
        var input = TestQuestions.Aggregate(question, images: images);

        var sut = input.ToAnswerDto();

        sut.Images.Should().Equal("az-104/q063_post0.png", "az-104/q063_post1.png");
    }

    #region Utils

    private static Question Question() => new()
    {
        Id = 1,
        CertificationId = "az-104",
        Number = 63,
        Type = QuestionType.HotspotYesNo,
        Text = "Domanda di prova",
        Explanation = "Spiegazione",
        AnswerText = "Statement 1 -> Yes | Statement 2 -> No",
    };

    private static AnswerRow AnswerRow(int id = 1, string? prompt = null, string answer = "") => new()
    {
        Id = id,
        QuestionId = 1,
        Prompt = prompt,
        Answer = answer,
    };

    private static QuestionAnswerDto QuestionAnswerDto(
        int number = 63,
        string explanation = "Spiegazione",
        string answerText = "Statement 1 -> Yes | Statement 2 -> No",
        string? note = null,
        IReadOnlyList<string>? correctLetters = null,
        IReadOnlyList<AnswerRowDto>? answerRows = null,
        IReadOnlyList<string>? images = null) => new()
    {
        Number = number,
        Explanation = explanation,
        AnswerText = answerText,
        Note = note,
        CorrectLetters = correctLetters ?? [],
        AnswerRows = answerRows ?? [],
        Images = images ?? [],
    };

    #endregion
}
