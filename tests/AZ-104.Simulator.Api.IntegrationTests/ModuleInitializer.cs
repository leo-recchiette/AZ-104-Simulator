using System.Runtime.CompilerServices;

namespace Simulator.Api.IntegrationTests;

public static class ModuleInitializer
{
    [ModuleInitializer]
    public static void Initialize()
        => VerifierSettings.IgnoreMember("traceId");
}
