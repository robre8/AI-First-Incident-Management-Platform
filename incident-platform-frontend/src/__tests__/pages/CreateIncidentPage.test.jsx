import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import CreateIncidentPage from "../../pages/CreateIncidentPage";
import * as api from "../../api/incidents";

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("../../api/incidents");

beforeEach(() => {
  vi.clearAllMocks();
});

function renderPage() {
  return render(
    <MemoryRouter>
      <CreateIncidentPage />
    </MemoryRouter>
  );
}

describe("CreateIncidentPage", () => {
  it("renders the page heading and the form", () => {
    renderPage();

    expect(screen.getByRole("heading", { name: "Create Incident" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create Incident" })).toBeInTheDocument();
  });

  it("creates an incident and navigates to its detail page", async () => {
    api.createIncident.mockResolvedValue({ id: "new-123" });
    renderPage();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("Production outage"), "Redis OOM");
    await user.type(screen.getByPlaceholderText("Describe the incident"), "Cache eviction");
    await user.click(screen.getByRole("button", { name: "Create Incident" }));

    await waitFor(() => {
      expect(api.createIncident).toHaveBeenCalledWith({
        title: "Redis OOM",
        description: "Cache eviction",
        status: "Open",
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith("/incidents/new-123");
  });

  it("disables button while creating (loading state)", async () => {
    api.createIncident.mockReturnValue(new Promise(() => {})); // never resolves
    renderPage();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("Production outage"), "Test");
    await user.type(screen.getByPlaceholderText("Describe the incident"), "Desc");
    await user.click(screen.getByRole("button", { name: "Create Incident" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Creating..." })).toBeDisabled();
    });
  });
});
