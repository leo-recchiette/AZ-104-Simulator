using Simulator.Api.Mapper;

namespace Simulator.Api.Models.Contracts;

/// <summary>
/// Answers e' facoltativo: un client vecchio registra comunque il tentativo, senza dettaglio,
/// invece di perderlo. DrawMode ha un default per lo stesso motivo: un client vecchio pescava a caso.
/// </summary>
public sealed record SaveExamAttemptDto(
    string Mode,
    int QuestionCount,
    double Percentage,
    DateTimeOffset StartTime,
    DateTimeOffset EndTime,
    IReadOnlyList<AnswerSubmissionDto>? Answers,
    string DrawMode = DrawModeMapper.Default);
