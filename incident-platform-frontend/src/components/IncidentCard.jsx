import { Link } from "react-router-dom";
import { useState } from "react";

const STATUS_STYLES = {
  Open: "bg-rose-100 text-rose-700",
  "In Progress": "bg-amber-100 text-amber-800",
  Resolved: "bg-emerald-100 text-emerald-700",
  Closed: "bg-slate-200 text-slate-700",
};

export default function IncidentCard({ incident, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const status = incident.status ?? "Open";
  const statusStyle = STATUS_STYLES[status] ?? "bg-slate-100 text-slate-700";

  async function handleDelete(e) {
    e.preventDefault();
    setIsDeleting(true);
    try {
      await onDelete(incident.id);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Link
      to={`/incidents/${incident.id}`}
      className="relative block rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700 p-4 shadow-sm transition hover:shadow-md"
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold dark:text-slate-100">{incident.title}</h3>
        <span className={`rounded-full px-3 py-1 text-xs ${statusStyle}`}>
          {status}
        </span>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300">
        {incident.description}
      </p>

      <p className="mt-3 text-xs text-slate-400 dark:text-slate-500 break-all">
        {incident.id}
      </p>

      {onDelete && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="absolute bottom-2 right-2 rounded-lg border border-red-300 bg-red-50 p-1.5 text-red-600 transition hover:bg-red-100 disabled:opacity-50"
          title="Delete incident"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </Link>
  );
}
