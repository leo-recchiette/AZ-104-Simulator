namespace Simulator.Api.Models.Contracts;

/// <summary>Score su 1000 come il punteggio dell'esame, che si supera con 700.</summary>
public sealed record ExamScoreDto(int Score)
{
    public const int MaxScore = 1000;
}
