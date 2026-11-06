using Simulator.Api.Models.Domains;

namespace Simulator.Api.Services.Interfaces;

public interface ICertificationService
{
    Task<CertificationByVendor> GetAllAsync(CancellationToken cancellationToken);
}
