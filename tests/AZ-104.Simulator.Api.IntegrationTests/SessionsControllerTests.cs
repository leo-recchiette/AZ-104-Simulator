using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;

namespace Simulator.Api.IntegrationTests;

[TestClass]
[UsesVerify]
public partial class SessionsControllerTests : IDisposable
{
    private static readonly DateTimeOffset StartedAt = new(2026, 10, 20, 9, 0, 0, TimeSpan.Zero);

    private readonly WebApplicationFactory<Program> _webApplicationFactory = new();
    private readonly HttpClient _httpClient;

    public SessionsControllerTests()
        => _httpClient = _webApplicationFactory.CreateClient();

    [TestInitialize]
    public Task ResetDatabaseAsync()
        => TestDatabase.ResetAsync(_webApplicationFactory.Services);

    public void Dispose()
        => _webApplicationFactory.Dispose();

    [TestMethod]
    public async Task Should_Return_NoContent_When_There_Is_No_Session()
    {
        var actual = await _httpClient.GetAsync("api/sessions/getCurrentSession");

        actual.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [TestMethod]
    public async Task Should_Restore_The_Saved_Session_With_Its_Questions_In_Order()
    {
        await SaveAsync(Session());

        var actual = await _httpClient.GetStringAsync("api/sessions/getCurrentSession");

        await VerifyJson(actual);
    }

    [TestMethod]
    public async Task Should_Drop_The_Session_When_Every_Answer_Is_Erased()
    {
        await SaveAsync(Session());
        await SaveAsync(Session(answers: new Dictionary<int, string[]> { [6] = [""] }));

        var actual = await _httpClient.GetAsync("api/sessions/getCurrentSession");

        actual.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [TestMethod]
    public async Task Should_Delete_The_Session()
    {
        await SaveAsync(Session());

        var deleted = await _httpClient.DeleteAsync("api/sessions/deleteCurrentSession");
        var actual = await _httpClient.GetAsync("api/sessions/getCurrentSession");

        deleted.StatusCode.Should().Be(HttpStatusCode.NoContent);
        actual.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [TestMethod]
    public async Task Should_Discard_A_Session_Whose_Questions_No_Longer_Exist()
    {
        await SaveAsync(Session(questionNumbers: [6, 7, 999]));

        var actual = await _httpClient.GetAsync("api/sessions/getCurrentSession");

        actual.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [TestMethod]
    public async Task Should_Reject_An_Unknown_Mode()
    {
        var response = await SaveAsync(Session(mode: "quiz"));

        await Verify(await ResponseSnapshot.Of(response));
    }

    #region Utils

    private Task<HttpResponseMessage> SaveAsync(object session)
        => _httpClient.PutAsJsonAsync("api/sessions/saveCurrentSession", session);

    private static object Session(
        string mode = "practice",
        int[]? questionNumbers = null,
        Dictionary<int, string[]>? answers = null) => new
    {
        mode,
        questionNumbers = questionNumbers ?? [6, 7, 1],
        answers = answers ?? new Dictionary<int, string[]> { [6] = ["A"], [1] = ["A", "C"] },
        flaggedIndexes = new[] { 2 },
        currentIndex = 1,
        timeLimitSeconds = (int?)null,
        autoReveal = true,
        openEnded = false,
        liveScore = true,
        drawMode = "least_seen",
        startedAt = StartedAt,
        savedAt = StartedAt.AddMinutes(12),
        studyLaterQuestions = new[] { 7 },
    };

    #endregion
}
