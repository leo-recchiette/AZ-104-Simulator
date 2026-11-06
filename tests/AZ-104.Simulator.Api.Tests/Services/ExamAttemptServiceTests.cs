using Simulator.Api.Models.Contracts;
using Simulator.Api.Models.Domains;
using Simulator.Api.Repositories;
using Simulator.Api.Services;
using Simulator.Api.Services.Interfaces;
using FluentAssertions;
using NSubstitute;

namespace Simulator.Api.Tests.Services;

[TestClass]
public sealed class ExamAttemptServiceTests
{
    [TestMethod]
    public async Task Should_Map_Request_Into_Domain_Attempt()
    {
        ExamAttempt? inserted = null;
        var repository = Substitute.For<IExamAttemptRepository>();
        repository
            .InsertAsync(Arg.Do<ExamAttempt>(attempt => inserted = attempt), Arg.Any<IReadOnlyList<ExamAttemptAnswer>>(), Arg.Any<CancellationToken>())
            .Returns(Saved());
        var sut = Sut(repository);

        await sut.SaveAttemptAsync(SaveRequest(), CancellationToken.None);

        // Punteggio e numero di domande li calcola il server dalle risposte.
        var expected = new ExamAttempt
        {
            CertificationId = "az-104",
            Mode = "practice",
            DrawMode = "least_seen",
            QuestionCount = 2,
            Score = 765,
            StartTime = StartTime,
            EndTime = EndTime,
        };

        inserted.Should().BeEquivalentTo(expected);
    }

    [TestMethod]
    public async Task Should_Pass_Answers_To_Repository_In_Submission_Order()
    {
        IReadOnlyList<ExamAttemptAnswer>? inserted = null;
        var repository = Substitute.For<IExamAttemptRepository>();
        repository
            .InsertAsync(Arg.Any<ExamAttempt>(), Arg.Do<IReadOnlyList<ExamAttemptAnswer>>(answers => inserted = answers), Arg.Any<CancellationToken>())
            .Returns(Saved());
        var sut = Sut(repository);

        await sut.SaveAttemptAsync(SaveRequest(), CancellationToken.None);

        // Ordine di presentazione (7 prima di 3), non numerico.
        var expected = new[]
        {
            new ExamAttemptAnswer { QuestionNumber = 7, UserAnswers = ["C"] },
            new ExamAttemptAnswer { QuestionNumber = 3, UserAnswers = [] },
        };

        inserted.Should().BeEquivalentTo(expected, options => options.WithStrictOrdering());
    }

    [TestMethod]
    public async Task Should_Mark_Only_The_Answers_Named_In_StudyLaterQuestions()
    {
        IReadOnlyList<ExamAttemptAnswer>? inserted = null;
        var repository = Substitute.For<IExamAttemptRepository>();
        repository
            .InsertAsync(Arg.Any<ExamAttempt>(), Arg.Do<IReadOnlyList<ExamAttemptAnswer>>(answers => inserted = answers), Arg.Any<CancellationToken>())
            .Returns(Saved());
        var sut = Sut(repository);

        // 99 non e' fra le risposte: si ignora.
        await sut.SaveAttemptAsync(SaveRequest() with { StudyLaterQuestions = [3, 99] }, CancellationToken.None);

        inserted!.Select(a => (a.QuestionNumber, a.StudyLater)).Should().Equal((7, false), (3, true));
    }

    [TestMethod]
    public async Task Should_Score_The_Attempt_From_Its_Own_Answers()
    {
        var repository = Substitute.For<IExamAttemptRepository>();
        repository.InsertAsync(Arg.Any<ExamAttempt>(), Arg.Any<IReadOnlyList<ExamAttemptAnswer>>(), Arg.Any<CancellationToken>()).Returns(Saved());
        var examResultService = ScoringService();
        var sut = new ExamAttemptService(repository, examResultService);
        var request = SaveRequest();

        await sut.SaveAttemptAsync(request, CancellationToken.None);

        await examResultService.Received(1).ScoreAsync("az-104", request.Answers, Arg.Any<CancellationToken>());
    }

    [TestMethod]
    public async Task Should_Save_The_Times_In_UTC()
    {
        // Npgsql scrive su timestamptz solo DateTimeOffset con offset zero.
        ExamAttempt? inserted = null;
        var repository = Substitute.For<IExamAttemptRepository>();
        repository
            .InsertAsync(Arg.Do<ExamAttempt>(attempt => inserted = attempt), Arg.Any<IReadOnlyList<ExamAttemptAnswer>>(), Arg.Any<CancellationToken>())
            .Returns(Saved());
        var sut = Sut(repository);
        var start = new DateTimeOffset(2026, 3, 1, 12, 0, 0, TimeSpan.FromHours(2));

        await sut.SaveAttemptAsync(SaveRequest() with { StartTime = start, EndTime = start.AddHours(1) }, CancellationToken.None);

        inserted!.StartTime.Offset.Should().Be(TimeSpan.Zero);
        inserted.StartTime.Should().Be(start);
        inserted.EndTime.Offset.Should().Be(TimeSpan.Zero);
    }

    [TestMethod]
    public async Task Should_Return_Saved_Attempt_Not_The_Requested_One()
    {
        // Entita' diversa da quella ricevuta, per distinguere richiesta e risultato.
        var repository = Substitute.For<IExamAttemptRepository>();
        repository
            .InsertAsync(Arg.Any<ExamAttempt>(), Arg.Any<IReadOnlyList<ExamAttemptAnswer>>(), Arg.Any<CancellationToken>())
            .Returns(call => call.Arg<ExamAttempt>() with { Id = 7, CompletedAt = CompletedAt });
        var sut = Sut(repository);

        var actual = await sut.SaveAttemptAsync(SaveRequest(), CancellationToken.None);

        // Id e CompletedAt devono venire dalla insert, non dalla richiesta.
        var expected = new ExamAttemptDto
        {
            Id = 7,
            CertificationId = "az-104",
            Mode = "practice",
            DrawMode = "least_seen",
            QuestionCount = 2,
            Score = 765,
            StartTime = StartTime,
            EndTime = EndTime,
            CompletedAt = CompletedAt,
        };

        actual.Should().BeEquivalentTo(expected);
    }

    [TestMethod]
    public async Task Should_Map_All_Attempts_Preserving_Repository_Order()
    {
        var repository = Substitute.For<IExamAttemptRepository>();
        repository
            .GetAllAsync("az-104", Arg.Any<CancellationToken>())
            .Returns([Attempt(1, 500), Attempt(2, 600), Attempt(3, 900)]);
        var sut = Sut(repository);

        var actual = await sut.GetAllAttemptsAsync("az-104", CancellationToken.None);

        // Il service non deve riordinare: il grafico si appoggia all'ordine del repository.
        var expected = new[] { AttemptDto(1, 500), AttemptDto(2, 600), AttemptDto(3, 900) };

        actual.Should().BeEquivalentTo(expected, options => options.WithStrictOrdering());
    }

    [TestMethod]
    public async Task Should_Return_Empty_History_When_No_Attempts_Saved()
    {
        var repository = Substitute.For<IExamAttemptRepository>();
        repository.GetAllAsync(Arg.Any<string>(), Arg.Any<CancellationToken>()).Returns([]);
        var sut = Sut(repository);

        var actual = await sut.GetAllAttemptsAsync("az-104", CancellationToken.None);

        actual.Should().BeEmpty();
    }

    [TestMethod]
    public async Task Should_Forward_CancellationToken_To_Repository()
    {
        var repository = Substitute.For<IExamAttemptRepository>();
        repository.InsertAsync(Arg.Any<ExamAttempt>(), Arg.Any<IReadOnlyList<ExamAttemptAnswer>>(), Arg.Any<CancellationToken>()).Returns(Saved());
        var sut = Sut(repository);
        using var cts = new CancellationTokenSource();

        await sut.SaveAttemptAsync(SaveRequest(), cts.Token);

        await repository.Received(1).InsertAsync(Arg.Any<ExamAttempt>(), Arg.Any<IReadOnlyList<ExamAttemptAnswer>>(), cts.Token);
    }

    [TestMethod]
    public async Task Should_Return_Null_Detail_When_Attempt_Does_Not_Exist()
    {
        var repository = Substitute.For<IExamAttemptRepository>();
        repository.GetDetailAsync(404, Arg.Any<CancellationToken>()).Returns((ExamAttemptDetail?)null);
        var examResultService = Substitute.For<IExamResultService>();
        var sut = new ExamAttemptService(repository, examResultService);

        var actual = await sut.GetAttemptDetailAsync(404, CancellationToken.None);

        actual.Should().BeNull();
        await examResultService.DidNotReceiveWithAnyArgs().ReviewAsync(default!, default!, default);
    }

    [TestMethod]
    public async Task Should_Rebuild_Detail_From_Saved_Question_Numbers()
    {
        var savedAnswers = new[]
        {
            new ExamAttemptAnswer { QuestionNumber = 7, UserAnswers = ["C"] },
            new ExamAttemptAnswer { QuestionNumber = 3, UserAnswers = [] },
        };
        var repository = Substitute.For<IExamAttemptRepository>();
        repository.GetDetailAsync(42, Arg.Any<CancellationToken>()).Returns(new ExamAttemptDetail { Attempt = Saved(), Answers = savedAnswers });

        string? reviewedCertification = null;
        IReadOnlyList<AnswerSubmissionDto>? reviewed = null;
        var examResultService = Substitute.For<IExamResultService>();
        examResultService
            .ReviewAsync(Arg.Do<string>(c => reviewedCertification = c), Arg.Do<IReadOnlyList<AnswerSubmissionDto>>(s => reviewed = s), Arg.Any<CancellationToken>())
            .Returns([ReviewedAnswer(7, ["C"]), ReviewedAnswer(3, [])]);
        var sut = new ExamAttemptService(repository, examResultService);

        var actual = await sut.GetAttemptDetailAsync(42, CancellationToken.None);

        // Le domande si cercano nella certificazione del tentativo.
        reviewedCertification.Should().Be("az-104");
        reviewed.Should().BeEquivalentTo(
            new[] { Submission(7, ["C"]), Submission(3, []) },
            options => options.WithStrictOrdering());
        actual!.Attempt.Id.Should().Be(42);
        actual.Answers.Select(a => a.QuestionNumber).Should().Equal(7, 3);
    }

    [TestMethod]
    public async Task Should_Carry_The_Study_Later_Marks_Into_The_Detail()
    {
        var savedAnswers = new[]
        {
            new ExamAttemptAnswer { QuestionNumber = 7, UserAnswers = ["C"] },
            new ExamAttemptAnswer { QuestionNumber = 3, UserAnswers = [], StudyLater = true },
        };
        var repository = Substitute.For<IExamAttemptRepository>();
        repository.GetDetailAsync(42, Arg.Any<CancellationToken>()).Returns(new ExamAttemptDetail { Attempt = Saved(), Answers = savedAnswers });
        var examResultService = Substitute.For<IExamResultService>();
        examResultService
            .ReviewAsync(Arg.Any<string>(), Arg.Any<IReadOnlyList<AnswerSubmissionDto>>(), Arg.Any<CancellationToken>())
            .Returns([ReviewedAnswer(7, ["C"]), ReviewedAnswer(3, [])]);
        var sut = new ExamAttemptService(repository, examResultService);

        var actual = await sut.GetAttemptDetailAsync(42, CancellationToken.None);

        actual!.Answers.Select(a => (a.QuestionNumber, a.StudyLater)).Should().Equal((7, false), (3, true));
    }

    [TestMethod]
    public async Task Should_Return_Detail_Without_Questions_For_A_Legacy_Attempt()
    {
        // Tentativi salvati prima del dettaglio: vanno mostrati lo stesso.
        var repository = Substitute.For<IExamAttemptRepository>();
        repository.GetDetailAsync(42, Arg.Any<CancellationToken>()).Returns(new ExamAttemptDetail { Attempt = Saved(), Answers = [] });
        var examResultService = Substitute.For<IExamResultService>();
        examResultService.ReviewAsync(Arg.Any<string>(), Arg.Any<IReadOnlyList<AnswerSubmissionDto>>(), Arg.Any<CancellationToken>()).Returns([]);
        var sut = new ExamAttemptService(repository, examResultService);

        var actual = await sut.GetAttemptDetailAsync(42, CancellationToken.None);

        actual!.Attempt.Id.Should().Be(42);
        actual.Answers.Should().BeEmpty();
    }

    #region Utils

    private static readonly DateTimeOffset StartTime = new(2026, 3, 1, 10, 0, 0, TimeSpan.Zero);
    private static readonly DateTimeOffset EndTime = new(2026, 3, 1, 11, 30, 0, TimeSpan.Zero);
    private static readonly DateTimeOffset CompletedAt = new(2026, 3, 1, 11, 30, 5, TimeSpan.Zero);

    private static ExamAttemptService Sut(IExamAttemptRepository repository) => new(repository, ScoringService());

    /// <summary>Il punteggio che ExamResultService darebbe alle risposte: qui fisso, per riconoscerlo nel tentativo.</summary>
    private static IExamResultService ScoringService()
    {
        var service = Substitute.For<IExamResultService>();
        service.ScoreAsync(Arg.Any<string>(), Arg.Any<IReadOnlyList<AnswerSubmissionDto>>(), Arg.Any<CancellationToken>()).Returns(new ExamScoreDto { Score = 765 });
        return service;
    }

    private static SaveExamAttemptDto SaveRequest() => new()
    {
        CertificationId = "az-104",
        Mode = "practice",
        StartTime = StartTime,
        EndTime = EndTime,
        // Anche la domanda in bianco va salvata.
        Answers = [Submission(7, ["C"]), Submission(3, [])],
        DrawMode = "least_seen",
        StudyLaterQuestions = [],
    };

    private static AnswerSubmissionDto Submission(int number, IReadOnlyList<string> userAnswers) => new() { QuestionNumber = number, UserAnswers = userAnswers };

    private static AttemptAnswerDto ReviewedAnswer(int number, IReadOnlyList<string> userAnswers) =>
        new() { QuestionNumber = number, UserAnswers = userAnswers, Question = null, CorrectAnswer = null };

    private static ExamAttempt Saved() => new()
    {
        Id = 42,
        CertificationId = "az-104",
        Mode = "practice",
        DrawMode = "least_seen",
        QuestionCount = 30,
        Score = 765,
        StartTime = StartTime,
        EndTime = EndTime,
        CompletedAt = CompletedAt,
    };

    private static ExamAttempt Attempt(int id, int score) => new()
    {
        Id = id,
        CertificationId = "az-104",
        Mode = "exam",
        DrawMode = "random",
        QuestionCount = 60,
        Score = score,
        StartTime = StartTime.AddDays(id),
        EndTime = EndTime.AddDays(id),
        CompletedAt = CompletedAt.AddDays(id),
    };

    private static ExamAttemptDto AttemptDto(int id, int score) => new()
    {
        Id = id,
        CertificationId = "az-104",
        Mode = "exam",
        DrawMode = "random",
        QuestionCount = 60,
        Score = score,
        StartTime = StartTime.AddDays(id),
        EndTime = EndTime.AddDays(id),
        CompletedAt = CompletedAt.AddDays(id),
    };

    #endregion
}
