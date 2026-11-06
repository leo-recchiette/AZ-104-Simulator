using Simulator.Api.Mapper;
using Simulator.Api.Models.Domains;
using FluentAssertions;

namespace Simulator.Api.Tests.Mapper;

[TestClass]
public sealed class DrawModeMapperTests
{
    [TestMethod]
    public void Should_Map_String_Into_DrawMode()
    {
        DrawModeMapper.TryFromDb("least_seen", out var actual).Should().BeTrue();

        actual.Should().Be(DrawMode.LeastSeen);
    }

    [TestMethod]
    public void Should_Default_To_Random()
    {
        DrawModeMapper.TryFromDb(DrawModeMapper.Default, out var actual).Should().BeTrue();

        actual.Should().Be(DrawMode.Random);
    }

    [TestMethod]
    public void Should_Reject_An_Unknown_Value()
    {
        DrawModeMapper.IsValid("leastSeen").Should().BeFalse();
        DrawModeMapper.IsValid(null).Should().BeFalse();
        DrawModeMapper.TryFromDb("leastSeen", out _).Should().BeFalse();
    }
}
