import { useState } from "react";

export default function AttachmentUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      setError("Select a file first.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await onUpload(file);
      setResult(data);
      setFile(null);
      e.target.reset();
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data ||
        err?.message ||
        "Upload failed. Try again.";
      setError(String(message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700 p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold dark:text-slate-100">Attachments</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <input
            id="attachment-file"
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="hidden"
          />
          <label
            htmlFor="attachment-file"
            className="cursor-pointer rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600"
          >
            Choose File
          </label>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {file ? file.name : "No file selected"}
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-slate-900 dark:bg-slate-700 px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:text-slate-700 dark:disabled:text-slate-400"
        >
          {loading ? "Uploading..." : "Upload File"}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-lg border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/30 p-3 text-sm text-amber-800 dark:text-amber-200">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 rounded-lg bg-slate-50 dark:bg-slate-700 p-3 text-sm">
          <p className="font-medium dark:text-slate-200">Uploaded successfully</p>
          <p className="break-all text-slate-600 dark:text-slate-300">{result.fileKey}</p>
        </div>
      )}
    </div>
  );
}
