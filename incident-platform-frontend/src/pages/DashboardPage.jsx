import { useEffect, useState } from "react";
import { getIncidents } from "../api/incidents";
import IncidentCard from "../components/IncidentCard";

export default function DashboardPage() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getIncidents();
        setIncidents(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Incident Dashboard</h1>
        <p className="text-slate-600">
          Monitor incidents, logs, attachments and AI insights.
        </p>
      </div>

      {loading ? (
        <p>Loading incidents...</p>
      ) : incidents.length === 0 ? (
        <p>No incidents found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {incidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      )}
    </div>
  );
}
