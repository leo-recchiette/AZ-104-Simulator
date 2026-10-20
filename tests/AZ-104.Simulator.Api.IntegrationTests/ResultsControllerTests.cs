using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;

namespace Simulator.Api.IntegrationTests;

[TestClass]
[UsesVerify]
public partial class ResultsControllerTests : IDisposable
{
    private static readonly DateTimeOffset EndTime = new(2026, 10, 20, 10, 30, 0, TimeSpan.Zero);

    private readonly WebApplicationFactory<Program> _webApplicationFactory = new();
    private readonly HttpClient _httpClient;

    public ResultsControllerTests()
        => _httpClient = _webApplicationFactory.CreateClient();

    [TestInitialize]
    public Task ResetDatabaseAsync()
        => TestDatabase.ResetAsync(_webApplicationFactory.Services);

    public void Dispose()
        => _webApplicationFactory.Dispose();

    [TestMethod]
    public async Task Should_Score_A_Submission_With_Partial_Credit()
    {
        var response = await _httpClient.PostAsJsonAsync("api/results/getScore", Submissions());

        await VerifyJson(await response.Content.ReadAsStringAsync());
    }

    [TestMethod]
    public async Task Should_Reveal_The_Solutions()
    {
        var response = await _httpClient.PostAsJsonAsync("api/results/checkAnswers", Submissions());

        await VerifyJson(await response.Content.ReadAsStringAsync());
    }

    [TestMethod]
    public async Task Should_Return_No_Solution_For_An_Unknown_Question()
    {
        var response = await _httpClient.PostAsJsonAsync("api/results/checkAnswers", new[] { Submission(999, "A") });

        await VerifyJson(await response.Content.ReadAsStringAsync());
    }

    [TestMethod]
    public async Task Should_Save_An_Attempt()
    {
        var response = await SaveAttemptAsync(EndTime);

        await VerifyJson(await response.Content.ReadAsStringAsync());
    }

    [TestMethod]
    public async Task Should_Read_A_Saved_Attempt_With_Its_Questions_And_Study_Later_Marks()
    {
        await SaveAttemptAsync(EndTime);

        var actual = await _httpClient.GetStringAsync("api/results/getAttempt/1");

        await VerifyJson(actual);
    }

    [TestMethod]
    public async Task Should_List_The_Attempts_Oldest_First()
    {
        await SaveAttemptAsync(EndTime);
        await SaveAttemptAsync(EndTime.AddDays(-1));

        var actual = await _httpClient.GetStringAsync("api/results/getAllAttempts");

        await VerifyJson(actual);
    }

    [TestMethod]
    public async Task Should_Not_Save_An_Attempt_Without_A_Single_Answer()
    {
        var blank = new[] { Submission(1), Submission(4, "", "") };

        var response = await _httpClient.PostAsJsonAsync("api/results/saveAttempt", Attempt(blank, EndTime));

        await Verify(await ResponseSnapshot.Of(response));
    }

    [TestMethod]
    public async Task Should_Return_NotFound_For_An_Unknown_Attempt()
    {
        var actual = await _httpClient.GetAsync("api/results/getAttempt/42");

        actual.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    #region Utils

    private Task<HttpResponseMessage> SaveAttemptAsync(DateTimeOffset endTime)
        => _httpClient.PostAsJsonAsync("api/results/saveAttempt", Attempt(Submissions(), endTime));

    private static object Attempt(object[] answers, DateTimeOffset endTime) => new
    {
        mode = "exam",
        drawMode = "least_seen",
        questionCount = answers.Length,
        percentage = 53.8,
        startTime = endTime.AddMinutes(-90),
        endTime,
        answers,
        studyLaterQuestions = new[] { 3, 4 },
    };

    private static object[] Submissions() =>
    [
        Submission(1, "A", "B"),
        Submission(2, "Step one", "Step three", "Step two"),
        Submission(3, "Access policy", "Key vault"),
        Submission(4, "Reader", "Reader"),
        Submission(5, "Yes", "Yes"),
        Submission(6, "A"),
        Submission(7, "A"),
    ];

    private static object Submission(int questionNumber, params string[] userAnswers)
        => new { questionNumber, userAnswers };

    #endregion
}
