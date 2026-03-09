import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AttachmentUpload from "../../components/AttachmentUpload";

describe("AttachmentUpload", () => {
  let onUpload;

  beforeEach(() => {
    onUpload = vi.fn().mockResolvedValue({ incidentId: "i-1", fileKey: "attachments/test.pdf" });
  });

  it("shows 'No file selected' initially", () => {
    render(<AttachmentUpload onUpload={onUpload} />);

    expect(screen.getByText("No file selected")).toBeInTheDocument();
  });

  it("shows selected file name after choosing a file", async () => {
    render(<AttachmentUpload onUpload={onUpload} />);
    const user = userEvent.setup();

    const file = new File(["content"], "report.pdf", { type: "application/pdf" });
    const input = document.getElementById("attachment-file");
    await user.upload(input, file);

    expect(screen.getByText("report.pdf")).toBeInTheDocument();
  });

  it("calls onUpload with the selected file on submit", async () => {
    render(<AttachmentUpload onUpload={onUpload} />);
    const user = userEvent.setup();

    const file = new File(["data"], "log.txt", { type: "text/plain" });
    const input = document.getElementById("attachment-file");
    await user.upload(input, file);
    await user.click(screen.getByRole("button", { name: "Upload File" }));

    expect(onUpload).toHaveBeenCalledWith(file);
  });

  it("shows success message with fileKey after upload", async () => {
    render(<AttachmentUpload onUpload={onUpload} />);
    const user = userEvent.setup();

    const file = new File(["x"], "doc.txt");
    const input = document.getElementById("attachment-file");
    await user.upload(input, file);
    await user.click(screen.getByRole("button", { name: "Upload File" }));

    expect(screen.getByText("Uploaded successfully")).toBeInTheDocument();
    expect(screen.getByText("attachments/test.pdf")).toBeInTheDocument();
  });

  it("shows error when no file is selected and form is submitted", async () => {
    render(<AttachmentUpload onUpload={onUpload} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Upload File" }));

    expect(screen.getByText("Select a file first.")).toBeInTheDocument();
    expect(onUpload).not.toHaveBeenCalled();
  });

  it("shows API error message on upload failure", async () => {
    onUpload.mockRejectedValue({
      response: { data: { detail: "File too large" } },
    });
    render(<AttachmentUpload onUpload={onUpload} />);
    const user = userEvent.setup();

    const file = new File(["x"], "big.zip");
    const input = document.getElementById("attachment-file");
    await user.upload(input, file);
    await user.click(screen.getByRole("button", { name: "Upload File" }));

    expect(screen.getByText("File too large")).toBeInTheDocument();
  });

  it("falls back to generic error message when response shape is unexpected", async () => {
    onUpload.mockRejectedValue(new Error("Network Error"));
    render(<AttachmentUpload onUpload={onUpload} />);
    const user = userEvent.setup();

    const file = new File(["x"], "f.txt");
    const input = document.getElementById("attachment-file");
    await user.upload(input, file);
    await user.click(screen.getByRole("button", { name: "Upload File" }));

    expect(screen.getByText("Network Error")).toBeInTheDocument();
  });

  it("shows 'Uploading...' and disables button during upload", async () => {
    onUpload.mockReturnValue(new Promise(() => {})); // never resolves
    render(<AttachmentUpload onUpload={onUpload} />);
    const user = userEvent.setup();

    const file = new File(["x"], "f.txt");
    const input = document.getElementById("attachment-file");
    await user.upload(input, file);
    await user.click(screen.getByRole("button", { name: "Upload File" }));

    const btn = screen.getByRole("button", { name: "Uploading..." });
    expect(btn).toBeDisabled();
  });
});
