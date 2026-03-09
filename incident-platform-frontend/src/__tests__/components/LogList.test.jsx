import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LogList from "../../components/LogList";

const sampleLogs = [
  { id: "1", service: "auth", logLevel: "Error", message: "Token expired", timestamp: "2026-01-01T00:00:00Z" },
  { id: "2", service: "api", logLevel: "Info", message: "Health check OK", timestamp: "2026-01-02T00:00:00Z" },
];

describe("LogList", () => {
  it("renders each log's service, level, message, and timestamp", () => {
    render(<LogList logs={sampleLogs} />);

    expect(screen.getByText("auth")).toBeInTheDocument();
    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("Token expired")).toBeInTheDocument();
    expect(screen.getByText("2026-01-01T00:00:00Z")).toBeInTheDocument();

    expect(screen.getByText("api")).toBeInTheDocument();
    expect(screen.getByText("Info")).toBeInTheDocument();
    expect(screen.getByText("Health check OK")).toBeInTheDocument();
  });

  it("shows 'Loading logs...' when loading is true", () => {
    render(<LogList logs={[]} loading={true} />);

    expect(screen.getByText("Loading logs...")).toBeInTheDocument();
    expect(screen.queryByText("No logs found.")).not.toBeInTheDocument();
  });

  it("shows 'No logs found.' when logs is empty and not loading", () => {
    render(<LogList logs={[]} loading={false} />);

    expect(screen.getByText("No logs found.")).toBeInTheDocument();
  });

  it("shows logs instead of loading message when loading=false", () => {
    render(<LogList logs={sampleLogs} loading={false} />);

    expect(screen.queryByText("Loading logs...")).not.toBeInTheDocument();
    expect(screen.getByText("Token expired")).toBeInTheDocument();
  });

  it("defaults loading to false when not provided", () => {
    render(<LogList logs={[]} />);

    expect(screen.getByText("No logs found.")).toBeInTheDocument();
  });
});
