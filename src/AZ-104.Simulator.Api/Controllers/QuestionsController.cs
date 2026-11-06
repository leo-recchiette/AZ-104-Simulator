using Simulator.Api.Models.Contracts;
using Simulator.Api.Models.Domains;
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

    /// <summary>Pesca dentro "certificationId"; "type" filtra opzionalmente su uno dei 4 tipi; "draw" sceglie come pescare.</summary>
    [HttpGet("getExam")]
    public async Task<ActionResult<IReadOnlyList<QuestionDto>>> GetExamAsync(
        [FromQuery] string certificationId,
        [FromQuery] int count = 40,
        [FromQuery] string? type = null,
        [FromQuery] string draw = DrawModeMapper.Default,
        CancellationToken cancellationToken = default)
    {
        // Nessun massimo: oltre la dimensione del bank il LIMIT restituisce semplicemente tutto.
        if (count < 1)
            return BadRequest("count deve essere almeno 1.");

        if (!DrawModeMapper.IsValid(draw))
            return BadRequest($"draw deve essere uno tra: {string.Join(", ", DrawModeMapper.Values)}.");
        var drawMode = DrawModeMapper.FromDb(draw);

        QuestionType? parsedType = null;
        if (type is not null)
        {
            try
            {
                parsedType = QuestionTypeMapper.FromDb(type);
            }
            catch (ArgumentOutOfRangeException)
            {
                return BadRequest($"tipo sconosciuto: {type}");
            }
        }

        var questions = await _questionService.GetRandomSetAsync(certificationId, count, parsedType, drawMode, cancellationToken);
        return Ok(questions);
    }
}