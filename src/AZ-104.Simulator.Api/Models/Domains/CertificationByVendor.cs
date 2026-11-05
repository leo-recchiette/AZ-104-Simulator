namespace Simulator.Api.Models.Domains;

/// <summary>
/// Le certificazioni raggruppate per vendor (es. 'microsoft'), in ordine alfabetico, e ogni lista in ordine di id.
/// In JSON e' un oggetto: { "hashicorp": [ ... ], "microsoft": [ ... ] }.
/// </summary>
public sealed class CertificationByVendor : Dictionary<string, IReadOnlyList<Certification>>
{
}
