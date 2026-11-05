using Simulator.Api.Models.Domains;

namespace Simulator.Api.Mapper;

internal static class QuestionImageMapper
{
    /// <summary>Percorso sotto /images: ogni certificazione ha la sua cartella, i nomi file si ripetono.</summary>
    internal static string ToPath(this QuestionImage image, string certificationId) => $"{certificationId}/{image.Filename}";
}
