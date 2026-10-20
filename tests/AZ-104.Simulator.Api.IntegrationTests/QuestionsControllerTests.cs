using System.Text.Json.Nodes;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;

namespace Simulator.Api.IntegrationTests;

[TestClass]
[UsesVerify]
public partial class QuestionsControllerTests : IDisposable
{
    private readonly WebApplicationFactory<Program> _webApplicationFactory = new();
    private readonly HttpClient _httpClient;

    public QuestionsControllerTests()
        => _httpClient = _webApplicationFactory.CreateClient();

    [TestInitialize]
    public Task ResetDatabaseAsync()
        => TestDatabase.ResetAsync(_webApplicationFactory.Services);

    public void Dispose()
        => _webApplicationFactory.Dispose();

    [TestMethod]
    public async Task Should_Return_Every_Answer_Layout_Without_The_Solutions()
    {
        var questions = await GetExamAsync("count=584");

        // L'estrazione e' casuale: si ordina per numero.
        var actual = new JsonArray(questions.OrderBy(Number).Select(q => q!.DeepClone()).ToArray());

        await VerifyJson(actual.ToJsonString());
    }

    [TestMethod]
    public async Task Should_Count_A_Scenario_Series_As_One_Unit()
    {
        var actual = await GetExamAsync("count=6");

        actual.Should().HaveCount(7);
    }

    [TestMethod]
    public async Task Should_Serve_A_Scenario_Series_Whole_And_Contiguous()
    {
        var numbers = (await GetExamAsync("count=584")).Select(Number).ToList();

        var actual = numbers.Skip(numbers.IndexOf(6)).Take(2);

        actual.Should().Equal(6, 7);
    }

    [TestMethod]
    public async Task Should_Serve_One_Member_Per_Variant_Family()
    {
        await TestDatabase.ExecuteAsync(_webApplicationFactory.Services, """
            INSERT INTO questions (number, type, question, explanation, answer_text, source, variant_group) VALUES
            (8, 'multiple_choice', 'Same question, first option set.', 'Explanation', 'A. Yes', 'text_layer', 'v01'),
            (9, 'multiple_choice', 'Same question, second option set.', 'Explanation', 'A. Yes', 'text_layer', 'v01')
            """);

        var numbers = (await GetExamAsync("count=584")).Select(Number);

        numbers.Count(n => n is 8 or 9).Should().Be(1);
    }

    [TestMethod]
    public async Task Should_Draw_The_Least_Seen_Unit_First()
    {
        // Una sessione salvata ha gia' proposto tutto tranne la domanda 5.
        await TestDatabase.ExecuteAsync(_webApplicationFactory.Services, """
            INSERT INTO exam_attempts (mode, question_count, percentage, start_time, end_time)
            VALUES ('exam', 6, 50, '2026-10-01T09:00:00Z', '2026-10-01T10:00:00Z');
            INSERT INTO exam_attempt_answers (attempt_id, ord, question_number, user_answers)
            SELECT 1, ord, number, '{}' FROM unnest(ARRAY[1, 2, 3, 4, 6, 7]) WITH ORDINALITY AS seen(number, ord);
            """);

        var actual = (await GetExamAsync("count=1&draw=least_seen")).Select(Number);

        actual.Should().Equal(5);
    }

    [TestMethod]
    public async Task Should_Reject_A_Count_Out_Of_Range()
    {
        var response = await _httpClient.GetAsync("api/questions/getExam?count=0");

        await Verify(await ResponseSnapshot.Of(response));
    }

    [TestMethod]
    public async Task Should_Reject_An_Unknown_Draw_Mode()
    {
        var response = await _httpClient.GetAsync("api/questions/getExam?count=5&draw=newest");

        await Verify(await ResponseSnapshot.Of(response));
    }

    #region Utils

    private async Task<JsonArray> GetExamAsync(string query)
        => JsonNode.Parse(await _httpClient.GetStringAsync($"api/questions/getExam?{query}"))!.AsArray();

    private static int Number(JsonNode? question)
        => question!["number"]!.GetValue<int>();

    #endregion
}
