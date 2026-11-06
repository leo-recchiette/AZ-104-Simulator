namespace Simulator.Api.Mapper;

/// <summary>Le modalita' di una sessione, come i CHECK di exam_attempts e active_session.</summary>
public static class SessionModeMapper
{
    public static readonly IReadOnlyList<string> Values = ["practice", "exam"];

    public static bool IsValid(string? value) => value is not null && Values.Contains(value);
}
