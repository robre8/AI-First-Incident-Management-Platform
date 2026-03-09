using FluentAssertions;
using Moq;
using IncidentPlatform.API.Controllers;
using IncidentPlatform.Application.Interfaces;
using IncidentPlatform.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace IncidentPlatform.Tests.Controllers;

public class LogControllerTests
{
    private readonly Mock<ILogService> _serviceMock;
    private readonly LogController _controller;

    public LogControllerTests()
    {
        _serviceMock = new Mock<ILogService>();
        _controller = new LogController(_serviceMock.Object);
    }

    [Fact]
    public async Task GetByIncidentId_Should_Return_Ok_With_Logs()
    {
        // Arrange
        var incidentId = Guid.NewGuid();
        var logs = new List<LogEntry>
        {
            new() { Id = Guid.NewGuid(), IncidentId = incidentId, Service = "api", LogLevel = "Error", Message = "fail" }
        };

        _serviceMock.Setup(s => s.GetLogsByIncidentIdAsync(incidentId)).ReturnsAsync(logs);

        // Act
        var result = await _controller.GetByIncidentId(incidentId);

        // Assert
        result.Result.Should().BeOfType<OkObjectResult>();
        var ok = result.Result as OkObjectResult;
        ok!.Value.Should().BeEquivalentTo(logs);
    }

    [Fact]
    public async Task GetByIncidentId_Should_Return_503_When_Service_Throws()
    {
        // Arrange
        var incidentId = Guid.NewGuid();
        _serviceMock
            .Setup(s => s.GetLogsByIncidentIdAsync(incidentId))
            .ThrowsAsync(new Exception("MongoDB down"));

        // Act
        var result = await _controller.GetByIncidentId(incidentId);

        // Assert
        result.Result.Should().BeOfType<ObjectResult>();
        var obj = result.Result as ObjectResult;
        obj!.StatusCode.Should().Be(503);
    }

    [Fact]
    public async Task Create_Should_Return_Ok_With_Created_Log()
    {
        // Arrange
        var incidentId = Guid.NewGuid();
        var log = new LogEntry { Service = "api", LogLevel = "Info", Message = "test" };
        var created = new LogEntry
        {
            Id = Guid.NewGuid(),
            IncidentId = incidentId,
            Service = "api",
            LogLevel = "Info",
            Message = "test",
            Timestamp = DateTime.UtcNow
        };

        _serviceMock.Setup(s => s.CreateLogAsync(incidentId, log)).ReturnsAsync(created);

        // Act
        var result = await _controller.Create(incidentId, log);

        // Assert
        result.Result.Should().BeOfType<OkObjectResult>();
        var ok = result.Result as OkObjectResult;
        ok!.Value.Should().BeEquivalentTo(created);
    }

    [Fact]
    public async Task Create_Should_Return_503_When_Service_Throws()
    {
        // Arrange
        var incidentId = Guid.NewGuid();
        var log = new LogEntry { Service = "api", LogLevel = "Error", Message = "fail test" };

        _serviceMock
            .Setup(s => s.CreateLogAsync(incidentId, log))
            .ThrowsAsync(new Exception("Write failed"));

        // Act
        var result = await _controller.Create(incidentId, log);

        // Assert
        result.Result.Should().BeOfType<ObjectResult>();
        var obj = result.Result as ObjectResult;
        obj!.StatusCode.Should().Be(503);
    }

    [Fact]
    public async Task GetByIncidentId_Should_Return_Empty_List_When_No_Logs()
    {
        // Arrange
        var incidentId = Guid.NewGuid();
        _serviceMock.Setup(s => s.GetLogsByIncidentIdAsync(incidentId)).ReturnsAsync(new List<LogEntry>());

        // Act
        var result = await _controller.GetByIncidentId(incidentId);

        // Assert
        result.Result.Should().BeOfType<OkObjectResult>();
        var ok = result.Result as OkObjectResult;
        (ok!.Value as List<LogEntry>).Should().BeEmpty();
    }
}
