import { Link } from "react-router-dom";

export default function IncidentCard({ incident }) {
  return (
    <Link
      to={`/incidents/${incident.id}`}
      className="block rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{incident.title}</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">
          {incident.status ?? "Open"}
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
