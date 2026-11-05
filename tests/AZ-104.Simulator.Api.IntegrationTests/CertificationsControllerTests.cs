using Microsoft.AspNetCore.Mvc.Testing;

namespace Simulator.Api.IntegrationTests;

[TestClass]
[UsesVerify]
public partial class CertificationsControllerTests : IDisposable
{
    private readonly WebApplicationFactory<Program> _webApplicationFactory = new();
    private readonly HttpClient _httpClient;

    public CertificationsControllerTests()
        => _httpClient = _webApplicationFactory.CreateClient();

    [TestInitialize]
    public Task ResetDatabaseAsync()
        => TestDatabase.ResetAsync(_webApplicationFactory.Services);

    public void Dispose()
        => _webApplicationFactory.Dispose();

    [TestMethod]
    public async Task Should_List_The_Certifications_With_Their_Question_Count()
    {
        await TestDatabase.ExecuteAsync(_webApplicationFactory.Services, """
            INSERT INTO questions (vendor, certification_id, number, type, question, explanation, answer_text, source) VALUES
            ('hashicorp', 'terraform-associate-004', 1, 'multiple_choice', 'Which command initializes a working directory?', 'Explanation', 'A. terraform init', 'text_layer'),
            ('hashicorp', 'terraform-associate-004', 2, 'multiple_choice', 'Which command formats the configuration?', 'Explanation', 'A. terraform fmt', 'text_layer')
            """);

        var actual = await _httpClient.GetStringAsync("api/certifications/getAllCertifications");

        await VerifyJson(actual);
    }
}
