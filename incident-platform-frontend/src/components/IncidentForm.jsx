import { useState } from "react";

export default function IncidentForm({ onSubmit, loading }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Open");

  async function handleSubmit(e) {
    e.preventDefault();
    await onSubmit({ title, description, status });
    setTitle("");
    setDescription("");
    setStatus("Open");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700 p-6 shadow-sm"
    >
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium dark:text-slate-200">Title</label>
        <input
          className="w-full rounded-lg border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Production outage"
          required
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium dark:text-slate-200">Description</label>
        <textarea
          className="w-full rounded-lg border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 px-3 py-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the incident"
          rows={4}
          required
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium dark:text-slate-200">Status</label>
        <select
          className="w-full rounded-lg border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 px-3 py-2"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-slate-900 dark:bg-slate-700 px-4 py-2 text-white disabled:opacity-50 hover:bg-slate-800 dark:hover:bg-slate-600"
      >
        {loading ? "Creating..." : "Create Incident"}
      </button>
    </form>
  );
}
