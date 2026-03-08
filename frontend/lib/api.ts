const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5116';

export interface Incident {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
}

export interface IncidentDTO {
  title: string;
  description: string;
}

export interface LogEntry {
  id: string;
  incidentId: string;
  service: string;
  logLevel: string;
  message: string;
  timestamp: string;
}

export interface AIAnalysisResult {
  severity: string;
  category: string;
  rootCause: string;
  suggestedFix: string;
  recommendedTests: string[];
}

export const api = {
  incidents: {
    getAll: (): Promise<Incident[]> =>
      fetch(`${API_URL}/api/incidents`).then((r) => r.json()),

    getById: (id: string): Promise<Incident> =>
      fetch(`${API_URL}/api/incidents/${id}`).then((r) => r.json()),

    create: (data: IncidentDTO): Promise<Incident> =>
      fetch(`${API_URL}/api/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => r.json()),

    update: (id: string, data: IncidentDTO) =>
      fetch(`${API_URL}/api/incidents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      fetch(`${API_URL}/api/incidents/${id}`, { method: 'DELETE' }),
  },

  logs: {
    getByIncident: (incidentId: string): Promise<LogEntry[]> =>
      fetch(`${API_URL}/api/incidents/${incidentId}/logs`).then((r) => r.json()),

    create: (
      incidentId: string,
      data: { service: string; logLevel: string; message: string }
    ): Promise<LogEntry> =>
      fetch(`${API_URL}/api/incidents/${incidentId}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
  },

  ai: {
    analyze: (incidentId: string): Promise<AIAnalysisResult> =>
      fetch(`${API_URL}/api/ai/analyze/${incidentId}`, {
        method: 'POST',
      }).then((r) => r.json()),
  },
};
