namespace Simulator.Api.Models.Domains;

public sealed record Certification
{
    /// <summary>Es. 'microsoft': e' anche la chiave di CertificationByVendor.</summary>
    public required string Vendor { get; init; }

    public required string Id { get; init; }
    public required int QuestionCount { get; init; }
}
