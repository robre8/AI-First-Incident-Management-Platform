import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import IncidentCard from "../../components/IncidentCard";

function renderCard(props = {}) {
  const defaults = {
    incident: {
      id: "abc-123",
      title: "DB Connection Timeout",
      description: "Postgres connection pool exhausted",
      status: "Open",
    },
    onDelete: vi.fn(),
  };

  return render(
    <MemoryRouter>
      <IncidentCard {...defaults} {...props} />
    </MemoryRouter>
  );
}

describe("IncidentCard", () => {
  it("renders incident title, description, and id", () => {
    renderCard();

    expect(screen.getByText("DB Connection Timeout")).toBeInTheDocument();
    expect(screen.getByText("Postgres connection pool exhausted")).toBeInTheDocument();
    expect(screen.getByText("abc-123")).toBeInTheDocument();
  });

  it("links to the incident detail page", () => {
    renderCard();

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/incidents/abc-123");
  });

  it.each([
    ["Open", "bg-rose-100"],
    ["In Progress", "bg-amber-100"],
    ["Resolved", "bg-emerald-100"],
    ["Closed", "bg-slate-200"],
  ])("shows correct badge style for status '%s'", (status, expectedClass) => {
    renderCard({
      incident: { id: "1", title: "t", description: "d", status },
    });

    const badge = screen.getByText(status);
    expect(badge.className).toContain(expectedClass);
  });

  it("defaults to 'Open' when status is missing", () => {
    renderCard({
      incident: { id: "1", title: "t", description: "d" },
    });

    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("calls onDelete with the incident id after confirmation", async () => {
    const onDelete = vi.fn().mockResolvedValue(undefined);
    window.confirm = vi.fn(() => true);
    // Note: onDelete in IncidentCard doesn't call confirm—DashboardPage does.
    // IncidentCard calls onDelete directly and awaits it.
    renderCard({ onDelete });
    const user = userEvent.setup();

    const deleteBtn = screen.getByTitle("Delete incident");
    await user.click(deleteBtn);

    expect(onDelete).toHaveBeenCalledWith("abc-123");
  });

  it("does not render delete button when onDelete is absent", () => {
    renderCard({ onDelete: undefined });

    expect(screen.queryByTitle("Delete incident")).not.toBeInTheDocument();
  });

  it("disables delete button while deleting", async () => {
    // onDelete returns a promise that never resolves, simulating in-flight
    const onDelete = vi.fn(() => new Promise(() => {}));
    renderCard({ onDelete });
    const user = userEvent.setup();

    const deleteBtn = screen.getByTitle("Delete incident");
    await user.click(deleteBtn);

    expect(deleteBtn).toBeDisabled();
  });
});
