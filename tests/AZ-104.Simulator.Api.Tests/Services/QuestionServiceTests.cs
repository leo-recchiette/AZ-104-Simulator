using Simulator.Api.Models.Contracts;
using Simulator.Api.Models.Domains;
using Simulator.Api.Repositories;
using Simulator.Api.Services;
using FluentAssertions;
using NSubstitute;

namespace Simulator.Api.Tests.Services;

[TestClass]
public sealed class QuestionServiceTests
{
    [TestMethod]
    public async Task Should_Map_RandomQuestions_Into_QuestionDtos()
    {
        var sut = new QuestionService(Repository(TestQuestions.Aggregate(Question(), [Option()])));

        var actual = await sut.GetRandomSetAsync("az-104", count: 1, DrawMode.Random, CancellationToken.None);

        var expected = new QuestionDto
        {
            Number = 1,
            Type = "multiple_choice",
            Text = "Domanda di prova",
            Options = [new OptionDto { Letter = "C", Text = "Opzione corretta" }],
            SelectCount = 1,
            DraggableItems = [],
            SequenceLength = 0,
            Prompts = [],
            Images = [],
            GroupId = null,
            GroupType = null,
            VariantGroup = null,
        };
        actual.Should().BeEquivalentTo([expected]);
    }

    [TestMethod]
    public async Task Should_Preserve_The_Order_Returned_By_The_Repository()
    {
        // L'ordine lo decide la query: il service non deve rimescolare.
        var sut = new QuestionService(Repository(
            TestQuestions.Aggregate(Question()),
            TestQuestions.Aggregate(Grouped(2, "ss01")),
            TestQuestions.Aggregate(Grouped(3, "ss01")),
            TestQuestions.Aggregate(Grouped(50, "ss09"))));

        var actual = await sut.GetRandomSetAsync("az-104", count: 3, DrawMode.Random, CancellationToken.None);

        actual.Select(q => q.Number).Should().Equal(1, 2, 3, 50);
    }

    [TestMethod]
    public async Task Should_Forward_The_DrawMode_To_The_Repository()
    {
        // Come pescare lo decide la query: il service deve solo inoltrarlo.
        var repository = Repository(TestQuestions.Aggregate(Question()));
        var sut = new QuestionService(repository);

        await sut.GetRandomSetAsync("az-104", count: 5, DrawMode.LeastSeen, CancellationToken.None);

        await repository.Received(1).GetRandomAsync("az-104", 5, DrawMode.LeastSeen, Arg.Any<CancellationToken>());
    }

    [TestMethod]
    public async Task Should_Return_The_Questions_In_The_Requested_Order_Skipping_The_Missing_Ones()
    {
        var repository = Substitute.For<IQuestionRepository>();
        repository.GetByNumbersAsync("az-104", Arg.Any<IReadOnlyCollection<int>>(), Arg.Any<CancellationToken>())
            .Returns([TestQuestions.Aggregate(Grouped(2, "ss01")), TestQuestions.Aggregate(Grouped(3, "ss01"))]);
        var sut = new QuestionService(repository);

        var actual = await sut.GetByNumbersAsync("az-104", [3, 999, 2], CancellationToken.None);

        actual.Select(q => q.Number).Should().Equal(3, 2);
    }

    #region Utils

    private static IQuestionRepository Repository(params QuestionAggregate[] questions)
    {
        var repository = Substitute.For<IQuestionRepository>();
        repository.GetRandomAsync(Arg.Any<string>(), Arg.Any<int>(), Arg.Any<DrawMode>(), Arg.Any<CancellationToken>()).Returns(questions);
        return repository;
    }

    private static Question Grouped(int number, string groupId) => Question() with
    {
        Id = number,
        Number = number,
        Text = $"Domanda {number}",
        GroupId = groupId,
        GroupType = "scenario_series",
    };

    private static Question Question() => new()
    {
        Id = 1,
        CertificationId = "az-104",
        Number = 1,
        Type = QuestionType.MultipleChoice,
        Text = "Domanda di prova",
        Explanation = "Spiegazione",
        AnswerText = "C. Opzione corretta",
    };

    private static Option Option() => new()
    {
        QuestionId = 1,
        Letter = "C",
        Text = "Opzione corretta",
        IsCorrect = true,
    };

    #endregion
}
