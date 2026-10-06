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
        var input = "least_seen";

        var sut = DrawModeMapper.FromDb(input);

        var expected = DrawMode.LeastSeen;

        sut.Should().Be(expected);
    }

    [TestMethod]
    public void Should_Map_DrawMode_Into_String()
    {
        var input = DrawMode.LeastSeen;

        var sut = DrawModeMapper.ToDb(input);

        var expected = "least_seen";

        sut.Should().Be(expected);
    }

    [TestMethod]
    public void Should_Default_To_Random()
    {
        var sut = DrawModeMapper.FromDb(DrawModeMapper.Default);

        sut.Should().Be(DrawMode.Random);
    }

    [TestMethod]
    public void Should_Reject_An_Unknown_Value()
    {
        DrawModeMapper.IsValid("leastSeen").Should().BeFalse();
        DrawModeMapper.IsValid(null).Should().BeFalse();
        var act = () => DrawModeMapper.FromDb("leastSeen");

        act.Should().Throw<ArgumentOutOfRangeException>();
    }
}
