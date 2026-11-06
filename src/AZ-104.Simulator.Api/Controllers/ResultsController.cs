using Simulator.Api.Extensions;
using Simulator.Api.Mapper;
using Simulator.Api.Models.Contracts;
using Simulator.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Simulator.Api.Controllers;

[ApiController]
[Route("api/results")]
public sealed class ResultsController : ControllerBase
{
    private readonly IExamResultService _examResultService;
    private readonly IExamAttemptService _examAttemptService;

    public ResultsController(IExamResultService examResultService, IExamAttemptService examAttemptService)
    {
        _examResultService = examResultService;
        _examAttemptService = examAttemptService;
    }

    [HttpPost("getScore")]
    public async Task<ActionResult<ExamScoreDto>> GetScoreAsync(
        [FromQuery] string certificationId,
        [FromBody] List<AnswerSubmissionDto> submissions,
        CancellationToken cancellationToken)
    {
        if (submissions.Count == 0)
            return BadRequest("la lista di risposte non puo' essere vuota.");

        var score = await _examResultService.ScoreAsync(certificationId, submissions, cancellationToken);
        return Ok(score);
    }

    [HttpPost("checkAnswers")]
    public async Task<ActionResult<IReadOnlyList<AnswerCheckResultDto>>> CheckAnswersAsync(
        [FromQuery] string certificationId,
        [FromBody] List<AnswerSubmissionDto> submissions,
        CancellationToken cancellationToken)
    {
        if (submissions.Count == 0)
            return BadRequest("la lista di risposte non puo' essere vuota.");

        var results = await _examResultService.CheckAnswersAsync(certificationId, submissions, cancellationToken);
        return Ok(results);
    }

    [HttpPost("saveAttempt")]
    public async Task<ActionResult<ExamAttemptDto>> SaveAttemptAsync(
        [FromBody] SaveExamAttemptDto request,
        CancellationToken cancellationToken)
    {
        var error = request switch
        {
            { Mode: var mode } when !SessionModeMapper.IsValid(mode) => $"mode deve essere uno tra: {string.Join(", ", SessionModeMapper.Values)}.",
            { DrawMode: var draw } when !DrawModeMapper.IsValid(draw) => $"drawMode deve essere uno tra: {string.Join(", ", DrawModeMapper.Values)}.",
            { StartTime: var start, EndTime: var end } when end < start => "endTime non puo' precedere startTime.",
            // All e' vero anche per una lista vuota: senza risposte il tentativo non entra nello storico.
            { Answers: var answers } when answers.All(a => a.IsBlank()) => "un tentativo senza nemmeno una risposta non viene registrato.",
            _ => null,
        };
        if (error is not null)
            return BadRequest(error);

        var saved = await _examAttemptService.SaveAttemptAsync(request, cancellationToken);
        return Ok(saved);
    }

    [HttpGet("getAttempt/{id:int}")]
    public async Task<ActionResult<ExamAttemptDetailDto>> GetAttemptAsync(int id, CancellationToken cancellationToken)
    {
        var detail = await _examAttemptService.GetAttemptDetailAsync(id, cancellationToken);
        if (detail is null)
            return NotFound($"nessun tentativo con id {id}.");

        return Ok(detail);
    }

    /// <summary>Solo i tentativi di "certificationId". Il dettaglio di uno, con getAttempt, non la chiede: la sa gia'.</summary>
    [HttpGet("getAllAttempts")]
    public async Task<ActionResult<IReadOnlyList<ExamAttemptDto>>> GetAllAttemptsAsync(
        [FromQuery] string certificationId,
        CancellationToken cancellationToken)
    {
        var attempts = await _examAttemptService.GetAllAttemptsAsync(certificationId, cancellationToken);
        return Ok(attempts);
    }
}
