import { useState } from "react";

const DEFAULT_FORM = {
  service: "frontend",
  logLevel: "Info",
  message: "",
};

export default function LogForm({ onSubmit }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.message.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        service: form.service,
        logLevel: form.logLevel,
        message: form.message.trim(),
      });
      setForm({ ...form, message: "" });
    } catch {
      setError("Failed to create log. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Create Log</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={form.service}
          onChange={(e) => setForm({ ...form, service: e.target.value })}
          placeholder="Service"
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />

        <select
          value={form.logLevel}
          onChange={(e) => setForm({ ...form, logLevel: e.target.value })}
          className="w-full rounded-lg border px-3 py-2 text-sm"
        >
          <option value="Info">Info</option>
          <option value="Warning">Warning</option>
          <option value="Error">Error</option>
        </select>

        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Log message"
          rows={3}
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />

        <button
          type="submit"
          disabled={loading || !form.message.trim()}
          className="rounded-lg bg-slate-900 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Log"}
        </button>
      </form>

      {error && (
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-2 text-sm text-amber-800">
          {error}
        </p>
      )}
    </div>
  );
}
