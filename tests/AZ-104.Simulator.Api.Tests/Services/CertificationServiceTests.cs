using Simulator.Api.Models.Domains;
using Simulator.Api.Repositories;
using Simulator.Api.Services;
using FluentAssertions;
using NSubstitute;

namespace Simulator.Api.Tests.Services;

[TestClass]
public sealed class CertificationServiceTests
{
    [TestMethod]
    public async Task Should_Group_The_Certifications_By_Vendor_Preserving_Repository_Order()
    {
        var repository = Substitute.For<ICertificationRepository>();
        repository.GetAllAsync(Arg.Any<CancellationToken>()).Returns([
            new Certification { Vendor = "hashicorp", Id = "terraform-associate-004", Code = "TA-004", Name = "Terraform Associate", QuestionCount = 167, ExamQuestionCount = 57, ExamTimeLimitMinutes = 60 },
            new Certification { Vendor = "microsoft", Id = "az-104", Code = "AZ-104", Name = "Azure Administrator", QuestionCount = 584, ExamQuestionCount = 54, ExamTimeLimitMinutes = 100 },
            new Certification { Vendor = "microsoft", Id = "az-900", Code = "AZ-900", Name = "Azure Fundamentals", QuestionCount = 300, ExamQuestionCount = 40, ExamTimeLimitMinutes = 45 },
        ]);
        var sut = new CertificationService(repository);

        var actual = await sut.GetAllAsync(CancellationToken.None);

        actual.Keys.Should().Equal("hashicorp", "microsoft");
        actual["microsoft"].Select(c => (c.Id, c.QuestionCount)).Should().Equal(("az-104", 584), ("az-900", 300));
    }

    [TestMethod]
    public async Task Should_Return_Nothing_When_The_Question_Bank_Is_Empty()
    {
        var repository = Substitute.For<ICertificationRepository>();
        repository.GetAllAsync(Arg.Any<CancellationToken>()).Returns([]);
        var sut = new CertificationService(repository);

        var actual = await sut.GetAllAsync(CancellationToken.None);

        actual.Should().BeEmpty();
    }
}
