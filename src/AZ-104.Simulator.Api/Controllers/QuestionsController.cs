using Simulator.Api.Models.Contracts;
using Simulator.Api.Mapper;
using Simulator.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Simulator.Api.Controllers;

[ApiController]
[Route("api/questions")]
public sealed class QuestionsController : ControllerBase
{
    private readonly IQuestionService _questionService;

    public QuestionsController(IQuestionService questionService)
    {
        _questionService = questionService;
    }

    /// <summary>Pesca "count" unita' dentro "certificationId"; "draw" sceglie come pescare.</summary>
    [HttpGet("getExam")]
    public async Task<ActionResult<IReadOnlyList<QuestionDto>>> GetExamAsync(
        [FromQuery] string certificationId,
        [FromQuery] int count = 40,
        [FromQuery] string draw = DrawModeMapper.Default,
        CancellationToken cancellationToken = default)
    {
        // Nessun massimo: oltre la dimensione del bank il LIMIT restituisce semplicemente tutto.
        if (count < 1)
            return BadRequest("count deve essere almeno 1.");

        if (!DrawModeMapper.TryFromDb(draw, out var drawMode))
            return BadRequest($"draw deve essere uno tra: {string.Join(", ", DrawModeMapper.Values)}.");

        var questions = await _questionService.GetRandomSetAsync(certificationId, count, drawMode, cancellationToken);
        return Ok(questions);
    }
}
