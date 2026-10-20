namespace Simulator.Api.IntegrationTests;

/// <summary>Gli errori sono testo semplice, non JSON.</summary>
internal static class ResponseSnapshot
{
    public static async Task<object> Of(HttpResponseMessage response)
        => new { response.StatusCode, Body = await response.Content.ReadAsStringAsync() };
}
