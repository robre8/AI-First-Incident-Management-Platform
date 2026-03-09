import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import IncidentDetailPage from "../../pages/IncidentDetailPage";
import * as api from "../../api/incidents";

vi.mock("../../api/incidents");

const mockIncident = {
  id: "inc-abc",
  title: "Prod Outage",
  description: "Load balancer down",
  status: "Open",
};

const mockLogs = [
  { id: "l1", service: "nginx", logLevel: "Error", message: "502 Bad Gateway", timestamp: "2026-01-01" },
];

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/incidents/inc-abc"]}>
      <Routes>
        <Route path="/incidents/:id" element={<IncidentDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  api.getIncidentById.mockResolvedValue(mockIncident);
  api.getLogsByIncident.mockResolvedValue(mockLogs);
  api.updateIncident.mockResolvedValue({ ...mockIncident, status: "Resolved" });
  api.createLog.mockResolvedValue({
    id: "l-new",
    service: "frontend",
    logLevel: "Info",
    message: "New log",
    timestamp: "2026-01-02",
  });
  api.analyzeIncident.mockResolvedValue({
    severity: "High",
    rootCause: "LB misconfigured",
    suggestedFix: "Update target group",
    recommendedTests: ["Health check test"],
  });
  api.uploadAttachment.mockResolvedValue({
    incidentId: "inc-abc",
    fileKey: "attachments/file.pdf",
  });
});

describe("IncidentDetailPage", () => {
  it("loads and displays the incident details and logs", async () => {
    renderPage();

    expect(screen.getByText("Loading incident...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Prod Outage")).toBeInTheDocument();
    });
    expect(screen.getByText("Load balancer down")).toBeInTheDocument();
    expect(screen.getByText("502 Bad Gateway")).toBeInTheDocument();
  });

  it("fetches incident and logs with the correct id from URL params", async () => {
    renderPage();

    await waitFor(() => {
      expect(api.getIncidentById).toHaveBeenCalledWith("inc-abc");
      expect(api.getLogsByIncident).toHaveBeenCalledWith("inc-abc");
    });
  });

  it("allows updating incident status via the dropdown and Save button", async () => {
    renderPage();
    const user = userEvent.setup();

    await waitFor(() => screen.getByText("Prod Outage"));

    const statusSelect = screen.getAllByRole("combobox")[0]; // first select is the status dropdown
    await user.selectOptions(statusSelect, "Resolved");
    await user.click(screen.getByRole("button", { name: "Save Status" }));

    await waitFor(() => {
      expect(api.updateIncident).toHaveBeenCalledWith("inc-abc", {
        title: "Prod Outage",
        description: "Load balancer down",
        status: "Resolved",
      });
    });

    expect(screen.getByText("Status updated.")).toBeInTheDocument();
  });

  it("shows error message when status update fails", async () => {
    api.updateIncident.mockRejectedValue(new Error("Server error"));
    renderPage();
    const user = userEvent.setup();

    await waitFor(() => screen.getByText("Prod Outage"));

    await user.click(screen.getByRole("button", { name: "Save Status" }));

    await waitFor(() => {
      expect(screen.getByText("Failed to update status.")).toBeInTheDocument();
    });
  });

  it("creates a new log entry and adds it to the list optimistically", async () => {
    renderPage();
    const user = userEvent.setup();

    await waitFor(() => screen.getByText("Prod Outage"));

    await user.type(screen.getByPlaceholderText("Log message"), "New log entry");
    await user.click(screen.getByRole("button", { name: "Create Log" }));

    await waitFor(() => {
      expect(api.createLog).toHaveBeenCalledWith("inc-abc", {
        service: "frontend",
        logLevel: "Info",
        message: "New log entry",
      });
    });
  });

  it("triggers AI analysis and displays results", async () => {
    renderPage();
    const user = userEvent.setup();

    await waitFor(() => screen.getByText("Prod Outage"));

    await user.click(screen.getByRole("button", { name: "Run Analysis" }));

    await waitFor(() => {
      expect(screen.getByText("High")).toBeInTheDocument();
      expect(screen.getByText("LB misconfigured")).toBeInTheDocument();
      expect(screen.getByText("Update target group")).toBeInTheDocument();
      expect(screen.getByText("Health check test")).toBeInTheDocument();
    });
  });

  it("shows error when AI analysis fails", async () => {
    api.analyzeIncident.mockRejectedValue(new Error("AI unavailable"));
    renderPage();
    const user = userEvent.setup();

    await waitFor(() => screen.getByText("Prod Outage"));

    await user.click(screen.getByRole("button", { name: "Run Analysis" }));

    await waitFor(() => {
      expect(screen.getByText("AI analysis is temporarily unavailable.")).toBeInTheDocument();
    });
  });

  it("shows logs error banner when logs endpoint fails", async () => {
    api.getLogsByIncident.mockRejectedValue(new Error("MongoDB down"));
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Logs are temporarily unavailable.")).toBeInTheDocument();
    });
  });
});
