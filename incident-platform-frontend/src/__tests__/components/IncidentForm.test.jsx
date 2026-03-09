import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import IncidentForm from "../../components/IncidentForm";

function renderForm(props = {}) {
  const defaults = { onSubmit: vi.fn().mockResolvedValue(undefined), loading: false };
  return { ...render(<IncidentForm {...defaults} {...props} />), ...defaults, ...props };
}

describe("IncidentForm", () => {
  it("renders title, description, status fields and submit button", () => {
    renderForm();

    expect(screen.getByPlaceholderText("Production outage")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Describe the incident")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument(); // status select
    expect(screen.getByRole("button", { name: "Create Incident" })).toBeInTheDocument();
  });

  it("submits with the user-entered data including status", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    renderForm({ onSubmit });
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("Production outage"), "API Server Down");
    await user.type(screen.getByPlaceholderText("Describe the incident"), "500 errors in prod");
    await user.selectOptions(screen.getByRole("combobox"), "In Progress");
    await user.click(screen.getByRole("button", { name: "Create Incident" }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: "API Server Down",
      description: "500 errors in prod",
      status: "In Progress",
    });
  });

  it("resets the form after successful submission", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    renderForm({ onSubmit });
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("Production outage"), "Outage");
    await user.type(screen.getByPlaceholderText("Describe the incident"), "Desc");
    await user.click(screen.getByRole("button", { name: "Create Incident" }));

    expect(screen.getByPlaceholderText("Production outage")).toHaveValue("");
    expect(screen.getByPlaceholderText("Describe the incident")).toHaveValue("");
    expect(screen.getByRole("combobox")).toHaveValue("Open");
  });

  it("shows 'Creating...' and disables button when loading", () => {
    renderForm({ loading: true });

    const btn = screen.getByRole("button", { name: "Creating..." });
    expect(btn).toBeDisabled();
  });

  it("defaults status to Open", () => {
    renderForm();

    expect(screen.getByRole("combobox")).toHaveValue("Open");
  });

  it("requires title and description (native validation)", () => {
    renderForm();

    const titleInput = screen.getByPlaceholderText("Production outage");
    const descInput = screen.getByPlaceholderText("Describe the incident");

    expect(titleInput).toBeRequired();
    expect(descInput).toBeRequired();
  });
});
