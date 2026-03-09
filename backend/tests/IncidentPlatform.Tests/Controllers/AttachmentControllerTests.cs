using FluentAssertions;
using Moq;
using IncidentPlatform.API.Controllers;
using IncidentPlatform.API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace IncidentPlatform.Tests.Controllers;

public class AttachmentControllerTests
{
    private readonly Mock<IAwsFileService> _fileServiceMock;
    private readonly AttachmentController _controller;

    public AttachmentControllerTests()
    {
        _fileServiceMock = new Mock<IAwsFileService>();
        _controller = new AttachmentController(_fileServiceMock.Object);
    }

    [Fact]
    public async Task Upload_Should_Return_Ok_With_FileKey_When_File_Is_Valid()
    {
        // Arrange
        var incidentId = Guid.NewGuid();
        var expectedKey = $"{Guid.NewGuid()}_report.pdf";

        var fileMock = new Mock<IFormFile>();
        fileMock.Setup(f => f.Length).Returns(1024);
        fileMock.Setup(f => f.FileName).Returns("report.pdf");
        fileMock.Setup(f => f.ContentType).Returns("application/pdf");
        fileMock.Setup(f => f.OpenReadStream()).Returns(new MemoryStream(new byte[1024]));

        _fileServiceMock
            .Setup(s => s.UploadFileAsync(It.IsAny<Stream>(), "report.pdf", "application/pdf"))
            .ReturnsAsync(expectedKey);

        // Act
        var result = await _controller.Upload(incidentId, fileMock.Object);

        // Assert
        result.Should().BeOfType<OkObjectResult>();
        _fileServiceMock.Verify(
            s => s.UploadFileAsync(It.IsAny<Stream>(), "report.pdf", "application/pdf"),
            Times.Once);
    }

    [Fact]
    public async Task Upload_Should_Return_BadRequest_When_File_Is_Null()
    {
        // Arrange
        var incidentId = Guid.NewGuid();

        // Act
        var result = await _controller.Upload(incidentId, null!);

        // Assert
        result.Should().BeOfType<BadRequestObjectResult>();
        var bad = result as BadRequestObjectResult;
        bad!.Value.Should().Be("File is required");
    }

    [Fact]
    public async Task Upload_Should_Return_BadRequest_When_File_Is_Empty()
    {
        // Arrange
        var incidentId = Guid.NewGuid();
        var fileMock = new Mock<IFormFile>();
        fileMock.Setup(f => f.Length).Returns(0);

        // Act
        var result = await _controller.Upload(incidentId, fileMock.Object);

        // Assert
        result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task Upload_Should_Pass_IncidentId_In_Response()
    {
        // Arrange
        var incidentId = Guid.NewGuid();
        var fileMock = new Mock<IFormFile>();
        fileMock.Setup(f => f.Length).Returns(512);
        fileMock.Setup(f => f.FileName).Returns("log.txt");
        fileMock.Setup(f => f.ContentType).Returns("text/plain");
        fileMock.Setup(f => f.OpenReadStream()).Returns(new MemoryStream(new byte[512]));

        _fileServiceMock
            .Setup(s => s.UploadFileAsync(It.IsAny<Stream>(), "log.txt", "text/plain"))
            .ReturnsAsync("key_log.txt");

        // Act
        var result = await _controller.Upload(incidentId, fileMock.Object);

        // Assert
        result.Should().BeOfType<OkObjectResult>();
        var ok = result as OkObjectResult;
        var value = ok!.Value;
        value!.GetType().GetProperty("IncidentId")!.GetValue(value).Should().Be(incidentId);
        value.GetType().GetProperty("FileKey")!.GetValue(value).Should().Be("key_log.txt");
    }
}
