namespace Simulator.Api.Models.Domains;

public sealed record Certification
{
    /// <summary>Es. 'microsoft': e' anche la chiave di CertificationByVendor.</summary>
    public required string Vendor { get; init; }

    public required string Id { get; init; }

    /// <summary>Es. 'AZ-104'.</summary>
    public required string Code { get; init; }

    /// <summary>Es. 'Microsoft Certified: Azure Administrator Associate'.</summary>
    public required string Name { get; init; }

    public required int QuestionCount { get; init; }

    /// <summary>Unita' della simulazione d'esame: una scenario series conta come una.</summary>
    public required int ExamQuestionCount { get; init; }

    public required int ExamTimeLimitMinutes { get; init; }
}
