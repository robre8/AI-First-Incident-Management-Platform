import { useEffect, useState } from "react";
import { getIncidents, deleteIncident } from "../api/incidents";
import IncidentCard from "../components/IncidentCard";

export default function DashboardPage() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadIncidents() {
    setLoading(true);
    try {
      const data = await getIncidents();
      setIncidents(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadIncidents();
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this incident?")) return;

    try {
      await deleteIncident(id);
      setIncidents((prev) => prev.filter((inc) => inc.id !== id));
    } catch {
      alert("Failed to delete incident.");
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold dark:text-slate-100">Incident Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-300">
          Monitor incidents, logs, attachments and AI insights.
        </p>
      </div>

      {loading ? (
        <p className="dark:text-slate-300">Loading incidents...</p>
      ) : incidents.length === 0 ? (
        <p className="dark:text-slate-300">No incidents found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {incidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
