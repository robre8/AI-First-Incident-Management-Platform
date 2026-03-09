import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import DashboardPage from "../../pages/DashboardPage";
import * as api from "../../api/incidents";

vi.mock("../../api/incidents");

const incidents = [
  { id: "1", title: "DB Down", description: "Postgres OOM", status: "Open" },
  { id: "2", title: "API Latency", description: "p99 > 5s", status: "Resolved" },
];

function renderPage() {
  return render(
    <MemoryRouter>
      <DashboardPage />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  api.getIncidents.mockResolvedValue(incidents);
  api.deleteIncident.mockResolvedValue(undefined);
  window.confirm = vi.fn(() => true);
  window.alert = vi.fn();
});

describe("DashboardPage", () => {
  it("shows loading state then renders incident cards", async () => {
    renderPage();

    expect(screen.getByText("Loading incidents...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("DB Down")).toBeInTheDocument();
    });
    expect(screen.getByText("API Latency")).toBeInTheDocument();
  });

  it("shows empty state when no incidents exist", async () => {
    api.getIncidents.mockResolvedValue([]);
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("No incidents found.")).toBeInTheDocument();
    });
  });

  it("deletes an incident after confirmation and removes it from the list", async () => {
    renderPage();
    const user = userEvent.setup();

    await waitFor(() => screen.getByText("DB Down"));

    const deleteBtns = screen.getAllByTitle("Delete incident");
    await user.click(deleteBtns[0]);

    expect(window.confirm).toHaveBeenCalledWith("Delete this incident?");
    expect(api.deleteIncident).toHaveBeenCalledWith("1");

    await waitFor(() => {
      expect(screen.queryByText("DB Down")).not.toBeInTheDocument();
    });
    expect(screen.getByText("API Latency")).toBeInTheDocument();
  });

  it("does not delete when user cancels confirmation", async () => {
    window.confirm = vi.fn(() => false);
    renderPage();
    const user = userEvent.setup();

    await waitFor(() => screen.getByText("DB Down"));

    const deleteBtns = screen.getAllByTitle("Delete incident");
    await user.click(deleteBtns[0]);

    expect(api.deleteIncident).not.toHaveBeenCalled();
    expect(screen.getByText("DB Down")).toBeInTheDocument();
  });

  it("shows alert when delete fails", async () => {
    api.deleteIncident.mockRejectedValue(new Error("Server error"));
    renderPage();
    const user = userEvent.setup();

    await waitFor(() => screen.getByText("DB Down"));

    const deleteBtns = screen.getAllByTitle("Delete incident");
    await user.click(deleteBtns[0]);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Failed to delete incident.");
    });
    // Incident should still be in the list since delete failed
    expect(screen.getByText("DB Down")).toBeInTheDocument();
  });
});
