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
    private const int MaxCount = 584; // dimensione dell'intero question bank: bound di buon senso, non una regola di business

    private readonly IQuestionService _questionService;

    public QuestionsController(IQuestionService questionService)
    {
        _questionService = questionService;
    }

    /// <summary>"type" filtra opzionalmente su uno dei 4 tipi; "draw" sceglie come pescare.</summary>
    [HttpGet("getExam")]
    public async Task<ActionResult<IReadOnlyList<QuestionDto>>> GetExamAsync(
        [FromQuery] int count = 40,
        [FromQuery] string? type = null,
        [FromQuery] string draw = DrawModeMapper.Default,
        CancellationToken cancellationToken = default)
    {
        if (count is < 1 or > MaxCount)
            return BadRequest($"count deve essere fra 1 e {MaxCount}.");

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

        var questions = await _questionService.GetRandomSetAsync(count, parsedType, drawMode, cancellationToken);
        return Ok(questions);
    }
}