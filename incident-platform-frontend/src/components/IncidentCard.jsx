import { Link } from "react-router-dom";

const STATUS_STYLES = {
  Open: "bg-rose-100 text-rose-700",
  "In Progress": "bg-amber-100 text-amber-800",
  Resolved: "bg-emerald-100 text-emerald-700",
  Closed: "bg-slate-200 text-slate-700",
};

export default function IncidentCard({ incident }) {
  const status = incident.status ?? "Open";
  const statusStyle = STATUS_STYLES[status] ?? "bg-slate-100 text-slate-700";

  return (
    <Link
      to={`/incidents/${incident.id}`}
      className="block rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{incident.title}</h3>
        <span className={`rounded-full px-3 py-1 text-xs ${statusStyle}`}>
          {status}
        </span>
      </div>

      <p className="text-sm text-slate-600">
        {incident.description}
      </p>

      <p className="mt-3 text-xs text-slate-400 break-all">
        {incident.id}
      </p>
    </Link>
  );
}
