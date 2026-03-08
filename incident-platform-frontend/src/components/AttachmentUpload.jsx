import { useState } from "react";

export default function AttachmentUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    try {
      const data = await onUpload(file);
      setResult(data);
      setFile(null);
      e.target.reset();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Attachments</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm"
        />

        <button
          type="submit"
          disabled={!file || loading}
          className="rounded-lg bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload File"}
        </button>
      </form>

      {result && (
        <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm">
          <p className="font-medium">Uploaded successfully</p>
          <p className="break-all text-slate-600">{result.fileKey}</p>
        </div>
      )}
    </div>
  );
}
