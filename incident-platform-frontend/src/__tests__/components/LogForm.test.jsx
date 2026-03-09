import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LogForm from "../../components/LogForm";

describe("LogForm", () => {
  it("renders service input, log level dropdown, message area, and submit button", () => {
    render(<LogForm onSubmit={vi.fn()} />);

    expect(screen.getByPlaceholderText("Service")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument(); // select
    expect(screen.getByPlaceholderText("Log message")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create Log" })).toBeInTheDocument();
  });

  it("disables submit when message is empty", () => {
    render(<LogForm onSubmit={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Create Log" })).toBeDisabled();
  });

  it("enables submit once message has content", async () => {
    render(<LogForm onSubmit={vi.fn()} />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("Log message"), "Something broke");

    expect(screen.getByRole("button", { name: "Create Log" })).toBeEnabled();
  });

  it("submits correct payload with service, logLevel, and trimmed message", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<LogForm onSubmit={onSubmit} />);
    const user = userEvent.setup();

    await user.clear(screen.getByPlaceholderText("Service"));
    await user.type(screen.getByPlaceholderText("Service"), "auth-service");
    await user.selectOptions(screen.getByRole("combobox"), "Error");
    await user.type(screen.getByPlaceholderText("Log message"), "  OOM killed  ");
    await user.click(screen.getByRole("button", { name: "Create Log" }));

    expect(onSubmit).toHaveBeenCalledWith({
      service: "auth-service",
      logLevel: "Error",
      message: "OOM killed",
    });
  });

  it("clears message but keeps service after successful submit", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<LogForm onSubmit={onSubmit} />);
    const user = userEvent.setup();

    await user.clear(screen.getByPlaceholderText("Service"));
    await user.type(screen.getByPlaceholderText("Service"), "billing");
    await user.type(screen.getByPlaceholderText("Log message"), "timeout");
    await user.click(screen.getByRole("button", { name: "Create Log" }));

    expect(screen.getByPlaceholderText("Log message")).toHaveValue("");
    expect(screen.getByPlaceholderText("Service")).toHaveValue("billing");
  });

  it("shows error message when onSubmit rejects", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("fail"));
    render(<LogForm onSubmit={onSubmit} />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("Log message"), "test");
    await user.click(screen.getByRole("button", { name: "Create Log" }));

    expect(screen.getByText("Failed to create log. Try again.")).toBeInTheDocument();
  });

  it("shows 'Creating...' while submitting", async () => {
    const onSubmit = vi.fn(() => new Promise(() => {})); // never resolves
    render(<LogForm onSubmit={onSubmit} />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("Log message"), "test");
    await user.click(screen.getByRole("button", { name: "Create Log" }));

    expect(screen.getByRole("button", { name: "Creating..." })).toBeDisabled();
  });
});
