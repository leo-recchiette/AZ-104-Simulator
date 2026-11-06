using System.Net;
using System.Net.Http.Json;
using System.Text.Json.Nodes;
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
        var response = await _httpClient.PostAsJsonAsync("api/results/getScore?certificationId=az-104", Submissions());

        await VerifyJson(await response.Content.ReadAsStringAsync());
    }

    [TestMethod]
    public async Task Should_Reveal_The_Solutions()
    {
        var response = await _httpClient.PostAsJsonAsync("api/results/checkAnswers?certificationId=az-104", Submissions());

        await VerifyJson(await response.Content.ReadAsStringAsync());
    }

    [TestMethod]
    public async Task Should_Return_No_Solution_For_An_Unknown_Question()
    {
        var response = await _httpClient.PostAsJsonAsync("api/results/checkAnswers?certificationId=az-104", new[] { Submission(999, "A") });

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

        var actual = await _httpClient.GetStringAsync("api/results/getAllAttempts?certificationId=az-104");

        await VerifyJson(actual);
    }

    [TestMethod]
    public async Task Should_List_Only_The_Attempts_Of_The_Requested_Certification()
    {
        await SaveAttemptAsync(EndTime);
        await SaveAttemptAsync(EndTime.AddDays(1), "terraform-associate-004");

        var actual = await _httpClient.GetFromJsonAsync<JsonArray>("api/results/getAllAttempts?certificationId=terraform-associate-004");

        actual!.Select(a => (a!["id"]!.GetValue<int>(), a["certificationId"]!.GetValue<string>()))
            .Should().Equal((2, "terraform-associate-004"));
    }

    [TestMethod]
    public async Task Should_Not_Mark_Another_Certification_Question_As_Solved()
    {
        // La 1 esiste solo in AZ-104: in Terraform non c'e' niente da correggere.
        var response = await _httpClient.PostAsJsonAsync("api/results/checkAnswers?certificationId=terraform-associate-004", new[] { Submission(1, "A", "C") });

        var actual = await response.Content.ReadFromJsonAsync<JsonArray>();

        actual!.Single()!["correctAnswer"].Should().BeNull();
    }

    [TestMethod]
    public async Task Should_Not_Save_An_Attempt_Without_A_Single_Answer()
    {
        var blank = new[] { Submission(1), Submission(4, "", "") };

        var response = await _httpClient.PostAsJsonAsync("api/results/saveAttempt", Attempt(blank, EndTime));

        await Verify(await ResponseSnapshot.Of(response));
    }

    [TestMethod]
    public async Task Should_Not_Save_An_Attempt_With_No_Answers_At_All()
    {
        var response = await _httpClient.PostAsJsonAsync("api/results/saveAttempt", Attempt([], EndTime));

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        (await response.Content.ReadAsStringAsync()).Should().Be("un tentativo senza nemmeno una risposta non viene registrato.");
    }

    [TestMethod]
    public async Task Should_Save_An_Attempt_Whose_Times_Are_Not_In_UTC()
    {
        // Npgsql rifiuta un DateTimeOffset con offset diverso da zero: il service lo converte prima.
        var attempt = Attempt(Submissions(), EndTime);
        var json = System.Text.Json.JsonSerializer.Serialize(attempt).Replace("+00:00", "+02:00");
        json.Should().Contain("+02:00");

        var response = await _httpClient.PostAsync("api/results/saveAttempt", new StringContent(json, System.Text.Encoding.UTF8, "application/json"));

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [TestMethod]
    public async Task Should_Reject_A_Missing_Required_Field_With_Plain_Text()
    {
        // Come gli altri errori dell'API: testo semplice, non ProblemDetails.
        var response = await _httpClient.PostAsJsonAsync("api/results/getScore?certificationId=az-104", new[] { new { questionNumber = 1 } });

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        response.Content.Headers.ContentType!.MediaType.Should().Be("text/plain");
        (await response.Content.ReadAsStringAsync()).Should().StartWith("richiesta non valida:");
    }

    [TestMethod]
    public async Task Should_Return_NotFound_For_An_Unknown_Attempt()
    {
        var actual = await _httpClient.GetAsync("api/results/getAttempt/42");

        actual.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    #region Utils

    private Task<HttpResponseMessage> SaveAttemptAsync(DateTimeOffset endTime, string certificationId = "az-104")
        => _httpClient.PostAsJsonAsync("api/results/saveAttempt", Attempt(Submissions(), endTime, certificationId));

    private static object Attempt(object[] answers, DateTimeOffset endTime, string certificationId = "az-104") => new
    {
        certificationId,
        mode = "exam",
        drawMode = "least_seen",
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
