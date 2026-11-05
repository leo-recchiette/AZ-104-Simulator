using Simulator.Api.Models.Domains;
using Simulator.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Simulator.Api.Controllers;

[ApiController]
[Route("api/certifications")]
public sealed class CertificationsController : ControllerBase
{
    private readonly ICertificationService _certificationService;

    public CertificationsController(ICertificationService certificationService)
    {
        _certificationService = certificationService;
    }

    /// <summary>Le certificazioni disponibili per vendor, con le domande complessive di ognuna.</summary>
    [HttpGet("getAllCertifications")]
    public async Task<ActionResult<CertificationByVendor>> GetAllCertificationsAsync(CancellationToken cancellationToken)
    {
        var certifications = await _certificationService.GetAllAsync(cancellationToken);
        return Ok(certifications);
    }
}
