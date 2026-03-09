import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AIAnalysisPanel from "../../components/AIAnalysisPanel";

const fullAnalysis = {
  severity: "Critical",
  rootCause: "Memory leak in worker process",
  suggestedFix: "Restart pods and patch memory allocator",
  recommendedTests: ["Memory stress test", "Load test under high traffic"],
};

describe("AIAnalysisPanel", () => {
  it("renders hint text when no analysis is available", () => {
    render(<AIAnalysisPanel analysis={null} loading={false} onAnalyze={vi.fn()} />);

    expect(
      screen.getByText(/Run analysis to inspect severity/i)
    ).toBeInTheDocument();
  });

  it("renders 'Run Analysis' button that calls onAnalyze", async () => {
    const onAnalyze = vi.fn();
    render(<AIAnalysisPanel analysis={null} loading={false} onAnalyze={onAnalyze} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Run Analysis" }));

    expect(onAnalyze).toHaveBeenCalledOnce();
  });

  it("shows 'Analyzing...' and disables button when loading", () => {
    render(<AIAnalysisPanel analysis={null} loading={true} onAnalyze={vi.fn()} />);

    const btn = screen.getByRole("button", { name: "Analyzing..." });
    expect(btn).toBeDisabled();
  });

  it("renders full analysis results with severity, root cause, fix, and tests", () => {
    render(<AIAnalysisPanel analysis={fullAnalysis} loading={false} onAnalyze={vi.fn()} />);

    expect(screen.getByText("Critical")).toBeInTheDocument();
    expect(screen.getByText("Memory leak in worker process")).toBeInTheDocument();
    expect(screen.getByText("Restart pods and patch memory allocator")).toBeInTheDocument();
    expect(screen.getByText("Memory stress test")).toBeInTheDocument();
    expect(screen.getByText("Load test under high traffic")).toBeInTheDocument();
  });

  it("renders analysis with empty recommendedTests without crashing", () => {
    const analysis = { ...fullAnalysis, recommendedTests: [] };
    render(<AIAnalysisPanel analysis={analysis} loading={false} onAnalyze={vi.fn()} />);

    expect(screen.getByText("Critical")).toBeInTheDocument();
  });
});
