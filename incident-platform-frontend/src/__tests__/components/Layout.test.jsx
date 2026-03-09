import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Layout from "../../components/Layout";

describe("Layout", () => {
  it("renders navigation links to Dashboard and New Incident", () => {
    render(
      <MemoryRouter>
        <Layout>
          <div>child content</div>
        </Layout>
      </MemoryRouter>
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("New Incident")).toBeInTheDocument();
    expect(screen.getByText("AI Incident Platform")).toBeInTheDocument();
  });

  it("renders children inside the main area", () => {
    render(
      <MemoryRouter>
        <Layout>
          <p>Test child</p>
        </Layout>
      </MemoryRouter>
    );

    expect(screen.getByText("Test child")).toBeInTheDocument();
  });

  it("links point to correct routes", () => {
    render(
      <MemoryRouter>
        <Layout>content</Layout>
      </MemoryRouter>
    );

    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));

    expect(hrefs).toContain("/");
    expect(hrefs).toContain("/incidents/new");
  });
});
