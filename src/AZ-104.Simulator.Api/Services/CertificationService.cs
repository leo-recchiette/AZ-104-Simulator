using Simulator.Api.Models.Domains;
using Simulator.Api.Repositories;
using Simulator.Api.Services.Interfaces;

namespace Simulator.Api.Services;

public sealed class CertificationService : ICertificationService
{
    private readonly ICertificationRepository _repository;

    public CertificationService(ICertificationRepository repository)
    {
        _repository = repository;
    }

    public async Task<CertificationByVendor> GetAllAsync(CancellationToken cancellationToken)
    {
        var certifications = await _repository.GetAllAsync(cancellationToken);
        var byVendor = new CertificationByVendor();
        // Il repository ordina per vendor e id: GroupBy tiene l'ordine di prima comparsa.
        foreach (var vendor in certifications.GroupBy(c => c.Vendor))
            byVendor[vendor.Key] = vendor.ToList();
        return byVendor;
    }
}
