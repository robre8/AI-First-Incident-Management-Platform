import { describe, it, expect, vi, beforeEach } from "vitest";
import { api } from "../../api/client";
import {
  getIncidents,
  getIncidentById,
  createIncident,
  updateIncident,
  deleteIncident,
  getLogsByIncident,
  createLog,
  analyzeIncident,
  uploadAttachment,
} from "../../api/incidents";

vi.mock("../../api/client", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

beforeEach(() => vi.clearAllMocks());

describe("incidents API client", () => {
  // ────────── GET /api/incident ──────────
  describe("getIncidents", () => {
    it("returns all incidents from the API", async () => {
      const incidents = [{ id: "1", title: "Inc-1" }];
      api.get.mockResolvedValue({ data: incidents });

      const result = await getIncidents();

      expect(api.get).toHaveBeenCalledWith("/api/incident");
      expect(result).toEqual(incidents);
    });

    it("propagates network errors", async () => {
      api.get.mockRejectedValue(new Error("Network Error"));

      await expect(getIncidents()).rejects.toThrow("Network Error");
    });
  });

  // ────────── GET /api/incident/:id ──────────
  describe("getIncidentById", () => {
    it("fetches a single incident by id", async () => {
      const incident = { id: "abc", title: "Prod outage" };
      api.get.mockResolvedValue({ data: incident });

      const result = await getIncidentById("abc");

      expect(api.get).toHaveBeenCalledWith("/api/incident/abc");
      expect(result).toEqual(incident);
    });
  });

  // ────────── POST /api/incident ──────────
  describe("createIncident", () => {
    it("sends payload and returns created incident", async () => {
      const payload = { title: "DB down", description: "Postgres OOM" };
      const created = { id: "new-1", ...payload, status: "Open" };
      api.post.mockResolvedValue({ data: created });

      const result = await createIncident(payload);

      expect(api.post).toHaveBeenCalledWith("/api/incident", payload);
      expect(result).toEqual(created);
    });
  });

  // ────────── PUT /api/incident/:id ──────────
  describe("updateIncident", () => {
    it("sends updated payload and returns the updated incident", async () => {
      const payload = { title: "DB down", description: "Fixed", status: "Resolved" };
      const updated = { id: "u-1", ...payload };
      api.put.mockResolvedValue({ data: updated });

      const result = await updateIncident("u-1", payload);

      expect(api.put).toHaveBeenCalledWith("/api/incident/u-1", payload);
      expect(result).toEqual(updated);
    });
  });

  // ────────── DELETE /api/incident/:id ──────────
  describe("deleteIncident", () => {
    it("sends a DELETE request and resolves on success", async () => {
      api.delete.mockResolvedValue({});

      await deleteIncident("d-1");

      expect(api.delete).toHaveBeenCalledWith("/api/incident/d-1");
    });
  });

  // ────────── Logs ──────────
  describe("getLogsByIncident", () => {
    it("fetches logs for a given incident", async () => {
      const logs = [{ id: "l1", message: "started" }];
      api.get.mockResolvedValue({ data: logs });

      const result = await getLogsByIncident("inc-1");

      expect(api.get).toHaveBeenCalledWith("/api/incidents/inc-1/logs");
      expect(result).toEqual(logs);
    });
  });

  describe("createLog", () => {
    it("posts a new log entry for an incident", async () => {
      const payload = { service: "api", logLevel: "Error", message: "boom" };
      const created = { id: "l-new", ...payload };
      api.post.mockResolvedValue({ data: created });

      const result = await createLog("inc-1", payload);

      expect(api.post).toHaveBeenCalledWith("/api/incidents/inc-1/logs", payload);
      expect(result).toEqual(created);
    });
  });

  // ────────── AI Analysis ──────────
  describe("analyzeIncident", () => {
    it("triggers AI analysis and returns results", async () => {
      const analysis = { severity: "High", rootCause: "OOM" };
      api.post.mockResolvedValue({ data: analysis });

      const result = await analyzeIncident("inc-1");

      expect(api.post).toHaveBeenCalledWith("/api/ai/analyze/inc-1");
      expect(result).toEqual(analysis);
    });
  });

  // ────────── Attachments ──────────
  describe("uploadAttachment", () => {
    it("sends a file as multipart form data", async () => {
      const file = new File(["content"], "report.pdf", { type: "application/pdf" });
      const response = { incidentId: "inc-1", fileKey: "attachments/report.pdf" };
      api.post.mockResolvedValue({ data: response });

      const result = await uploadAttachment("inc-1", file);

      expect(api.post).toHaveBeenCalledWith(
        "/api/incidents/inc-1/attachments",
        expect.any(FormData),
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      expect(result).toEqual(response);
    });

    it("includes the file in the FormData payload", async () => {
      const file = new File(["data"], "log.txt");
      api.post.mockResolvedValue({ data: {} });

      await uploadAttachment("inc-1", file);

      const formData = api.post.mock.calls[0][1];
      expect(formData).toBeInstanceOf(FormData);
      expect(formData.get("file")).toEqual(file);
    });
  });
});
