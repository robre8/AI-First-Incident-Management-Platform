using FluentAssertions;
using Moq;
using IncidentPlatform.API.Controllers;
using IncidentPlatform.Application.Interfaces;
using IncidentPlatform.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace IncidentPlatform.Tests.Controllers;

public class IncidentControllerTests
{
    private readonly Mock<IIncidentService> _serviceMock;
    private readonly IncidentController _controller;

    public IncidentControllerTests()
    {
        _serviceMock = new Mock<IIncidentService>();
        _controller = new IncidentController(_serviceMock.Object);
    }

    [Fact]
    public async Task GetById_Should_Return_NotFound_When_Service_Returns_Null()
    {
        // Arrange
        var id = Guid.NewGuid();

        _serviceMock
            .Setup(s => s.GetIncidentByIdAsync(id))
            .ReturnsAsync((Incident?)null);

        // Act
        var result = await _controller.GetById(id);

        // Assert
        result.Result.Should().BeOfType<NotFoundResult>();
        _serviceMock.Verify(s => s.GetIncidentByIdAsync(id), Times.Once);
    }

    [Fact]
    public async Task Create_Should_Return_CreatedAtAction_With_Created_Incident()
    {
        // Arrange
        var dto = new IncidentDTO
        {
            Title = "API outage",
            Description = "Service unavailable"
        };

        var createdIncident = new Incident
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Description = dto.Description
        };

        _serviceMock
            .Setup(s => s.CreateIncidentAsync(dto))
            .ReturnsAsync(createdIncident);

        // Act
        var result = await _controller.Create(dto);

        // Assert
        result.Result.Should().BeOfType<CreatedAtActionResult>();

        var createdAt = result.Result as CreatedAtActionResult;
        createdAt.Should().NotBeNull();
        createdAt!.ActionName.Should().Be(nameof(IncidentController.GetById));
        createdAt.RouteValues.Should().ContainKey("id");
        createdAt.RouteValues!["id"].Should().Be(createdIncident.Id);
        createdAt.Value.Should().BeEquivalentTo(createdIncident);

        _serviceMock.Verify(s => s.CreateIncidentAsync(dto), Times.Once);
    }

    [Fact]
    public async Task GetAll_Should_Return_All_Incidents()
    {
        // Arrange
        var incidents = new List<Incident>
        {
            new() { Id = Guid.NewGuid(), Title = "A", Description = "a" },
            new() { Id = Guid.NewGuid(), Title = "B", Description = "b" }
        };

        _serviceMock
            .Setup(s => s.GetAllIncidentsAsync())
            .ReturnsAsync(incidents);

        // Act
        var result = await _controller.GetAll();

        // Assert
        result.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetById_Should_Return_Ok_With_Incident_When_Found()
    {
        // Arrange
        var id = Guid.NewGuid();
        var incident = new Incident { Id = id, Title = "Found", Description = "desc" };

        _serviceMock.Setup(s => s.GetIncidentByIdAsync(id)).ReturnsAsync(incident);

        // Act
        var result = await _controller.GetById(id);

        // Assert
        result.Result.Should().BeOfType<OkObjectResult>();
        var ok = result.Result as OkObjectResult;
        ok!.Value.Should().BeEquivalentTo(incident);
    }

    [Fact]
    public async Task Update_Should_Return_Ok_When_Incident_Exists()
    {
        // Arrange
        var id = Guid.NewGuid();
        var dto = new IncidentDTO { Title = "Updated", Description = "desc", Status = "Resolved" };
        var updated = new Incident { Id = id, Title = dto.Title, Description = dto.Description, Status = "Resolved" };

        _serviceMock.Setup(s => s.UpdateIncidentAsync(id, dto)).ReturnsAsync(updated);

        // Act
        var result = await _controller.Update(id, dto);

        // Assert
        result.Should().BeOfType<OkObjectResult>();
        var ok = result as OkObjectResult;
        ok!.Value.Should().BeEquivalentTo(updated);
    }

    [Fact]
    public async Task Update_Should_Return_NotFound_When_Incident_Does_Not_Exist()
    {
        // Arrange
        var id = Guid.NewGuid();
        var dto = new IncidentDTO { Title = "X", Description = "X" };

        _serviceMock.Setup(s => s.UpdateIncidentAsync(id, dto)).ReturnsAsync((Incident?)null);

        // Act
        var result = await _controller.Update(id, dto);

        // Assert
        result.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public async Task Delete_Should_Return_NoContent_When_Incident_Exists()
    {
        // Arrange
        var id = Guid.NewGuid();
        _serviceMock.Setup(s => s.DeleteIncidentAsync(id)).ReturnsAsync(true);

        // Act
        var result = await _controller.Delete(id);

        // Assert
        result.Should().BeOfType<NoContentResult>();
    }

    [Fact]
    public async Task Delete_Should_Return_NotFound_When_Incident_Does_Not_Exist()
    {
        // Arrange
        var id = Guid.NewGuid();
        _serviceMock.Setup(s => s.DeleteIncidentAsync(id)).ReturnsAsync(false);

        // Act
        var result = await _controller.Delete(id);

        // Assert
        result.Should().BeOfType<NotFoundResult>();
    }
}
