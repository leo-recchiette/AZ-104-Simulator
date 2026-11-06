using Simulator.Api.Mapper;
using Simulator.Api.Models.Contracts;
using Simulator.Api.Models.Domains;
using FluentAssertions;

namespace Simulator.Api.Tests.Mapper;

[TestClass]
public sealed class QuestionMapperTests
{
    [TestMethod]
    public void Should_Map_MultipleChoice_Into_Options()
    {
        var input = Question(type: QuestionType.MultipleChoice, answerLayout: null);
        var options = new[]
        {
            Option(letter: "A", text: "Opzione sbagliata", isCorrect: false),
            Option(letter: "C", text: "Opzione corretta", isCorrect: true),
        };

        var sut = TestQuestions.Aggregate(input, options).ToQuestionDto();

        var expected = new QuestionDto
        {
            Number = 1,
            Type = "multiple_choice",
            Text = "Domanda di prova",
            Options = [new OptionDto { Letter = "A", Text = "Opzione sbagliata" }, new OptionDto { Letter = "C", Text = "Opzione corretta" }],
            SelectCount = 1,
            DraggableItems = [],
            SequenceLength = 0,
            Prompts = [],
            Images = [],
            GroupId = null,
            GroupType = null,
            VariantGroup = null,
        };

        sut.Should().BeEquivalentTo(expected);
    }

    [TestMethod]
    public void Should_Count_Every_Correct_Option_In_SelectCount()
    {
        var input = Question(type: QuestionType.MultipleChoice, answerLayout: null);
        var options = new[]
        {
            Option(letter: "A", isCorrect: true),
            Option(letter: "B", isCorrect: false),
            Option(letter: "C", isCorrect: true),
            Option(letter: "D", isCorrect: false),
        };

        var sut = TestQuestions.Aggregate(input, options).ToQuestionDto();

        sut.SelectCount.Should().Be(2);
    }

    [TestMethod]
    public void Should_Map_OrderedAnswer_Into_DraggableItems()
    {
        var input = Question(type: QuestionType.DragAndDrop, answerLayout: "ordered_answer");
        var options = new[]
        {
            Option(letter: null, text: "An Azure Key Vault", isCorrect: true),
            Option(letter: null, text: "An Azure Storage account", isCorrect: false),
            Option(letter: null, text: "An access policy", isCorrect: true),
        };
        var sequence = new[]
        {
            AnswerRow(id: 30, prompt: null, answer: "An Azure Key Vault"),
            AnswerRow(id: 31, prompt: null, answer: "An access policy"),
        };

        var sut = TestQuestions.Aggregate(input, options, sequence).ToQuestionDto();

        var expected = new QuestionDto
        {
            Number = 1,
            Type = "drag_and_drop",
            Text = "Domanda di prova",
            Options = [],
            SelectCount = 0,
            DraggableItems = ["An Azure Key Vault", "An Azure Storage account", "An access policy"],
            SequenceLength = 2,
            Prompts = [],
            Images = [],
            GroupId = null,
            GroupType = null,
            VariantGroup = null,
        };

        sut.Should().BeEquivalentTo(expected);
    }

    [TestMethod]
    public void Should_Expose_UnorderedAnswer_Only_For_An_Ordered_Answer()
    {
        var sequence = Question(type: QuestionType.DragAndDrop, answerLayout: "ordered_answer") with { UnorderedAnswer = true };
        var hotspot = Question(type: QuestionType.Hotspot, answerLayout: "selection") with { UnorderedAnswer = true };

        TestQuestions.Aggregate(sequence).ToQuestionDto().UnorderedAnswer.Should().BeTrue();
        TestQuestions.Aggregate(hotspot).ToQuestionDto().UnorderedAnswer.Should().BeFalse();
    }

    [TestMethod]
    public void Should_Map_Selection_Into_Prompts_With_Their_Own_Options()
    {
        var input = Question(type: QuestionType.Hotspot, answerLayout: "selection");
        var row1 = AnswerRow(id: 10, prompt: "To add a backend pool to LB1", answer: "Network Contributor on LB1");
        var row2 = AnswerRow(id: 11, prompt: "To add a health probe to LB2", answer: "Network Contributor on LB2");
        var rowOptions = new[]
        {
            RowOption(answerRowId: 10, text: "Contributor on LB1"),
            RowOption(answerRowId: 10, text: "Network Contributor on LB1"),
            RowOption(answerRowId: 11, text: "Contributor on LB2"),
            RowOption(answerRowId: 11, text: "Network Contributor on LB2"),
        };

        var images = new[]
        {
            Image(kind: "question", ord: 1, filename: "q001_pre1.png"),
            Image(kind: "question", ord: 0, filename: "q001_pre0.png"),
            Image(kind: "answer", ord: 0, filename: "q001_post0.png"),
        };

        var sut = TestQuestions.Aggregate(input, answerRows: [row1, row2], rowOptions: rowOptions, images: images).ToQuestionDto();

        var expected = new QuestionDto
        {
            Number = 1,
            Type = "hotspot",
            Text = "Domanda di prova",
            Options = [],
            SelectCount = 0,
            DraggableItems = [],
            SequenceLength = 0,
            Prompts = [
                new PromptOptionsDto { Prompt = "To add a backend pool to LB1", Options = ["Contributor on LB1", "Network Contributor on LB1"], SelectCount = 1 },
                new PromptOptionsDto { Prompt = "To add a health probe to LB2", Options = ["Contributor on LB2", "Network Contributor on LB2"], SelectCount = 1 },
            ],
            Images = ["az-104/q001_pre0.png", "az-104/q001_pre1.png"],
            GroupId = null,
            GroupType = null,
            VariantGroup = null,
        };

        sut.Should().BeEquivalentTo(expected);
    }

    [TestMethod]
    public void Should_Count_Every_Correct_Value_Of_A_MultiValue_Row()
    {
        // Domanda 242: "Allowed permissions" vuole Read e List insieme.
        var input = Question(type: QuestionType.Hotspot, answerLayout: "selection");
        var row = AnswerRow(id: 40, prompt: "Allowed permissions", answer: "{Read,List}");
        var rowOptions = new[]
        {
            RowOption(answerRowId: 40, text: "Read"),
            RowOption(answerRowId: 40, text: "Write"),
            RowOption(answerRowId: 40, text: "List"),
        };

        var sut = TestQuestions.Aggregate(input, answerRows: [row], rowOptions: rowOptions).ToQuestionDto();

        sut.Prompts.Single().SelectCount.Should().Be(2);
    }

    [TestMethod]
    public void Should_Map_YesNo_Into_Prompts_With_Constant_YesNo_Options()
    {
        var input = Question(type: QuestionType.HotspotYesNo, answerLayout: "yes_no");
        var row = AnswerRow(id: 20, prompt: "Statement 1", answer: "Yes");

        var sut = TestQuestions.Aggregate(input, answerRows: [row]).ToQuestionDto();

        var expected = new QuestionDto
        {
            Number = 1,
            Type = "hotspot_yes_no",
            Text = "Domanda di prova",
            Options = [],
            SelectCount = 0,
            DraggableItems = [],
            SequenceLength = 0,
            Prompts = [new PromptOptionsDto { Prompt = "Statement 1", Options = ["Yes", "No"], SelectCount = 1 }],
            Images = [],
            GroupId = null,
            GroupType = null,
            VariantGroup = null,
        };

        sut.Should().BeEquivalentTo(expected);
    }

    [TestMethod]
    public void Should_Expose_The_VariantGroup()
    {
        // Il client lo usa per non riproporre una variante gia' vista quando ripesca il bank.
        var input = Question(type: QuestionType.MultipleChoice, answerLayout: null) with { VariantGroup = "v17" };

        var sut = TestQuestions.Aggregate(input).ToQuestionDto();

        sut.VariantGroup.Should().Be("v17");
    }

    #region Utils

    private static Question Question(QuestionType type, string? answerLayout) => new()
    {
        Id = 1,
        CertificationId = "az-104",
        Number = 1,
        Type = type,
        AnswerLayout = answerLayout,
        Text = "Domanda di prova",
        Explanation = "Spiegazione",
        AnswerText = "risposta",
    };

    private static Option Option(string? letter = "A", string text = "", bool isCorrect = false) => new()
    {
        QuestionId = 1,
        Letter = letter,
        Text = text,
        IsCorrect = isCorrect,
    };

    private static AnswerRow AnswerRow(int id = 0, string? prompt = null, string answer = "") => new()
    {
        Id = id,
        QuestionId = 1,
        Prompt = prompt,
        Answer = answer,
    };

    private static AnswerRowOption RowOption(int answerRowId, string text) => new()
    {
        AnswerRowId = answerRowId,
        Text = text,
    };

    private static QuestionImage Image(string kind, int ord, string filename) => new()
    {
        QuestionId = 1,
        Kind = kind,
        Ord = ord,
        Filename = filename,
    };

    #endregion
}
