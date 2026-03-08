export default function AIAnalysisPanel({ analysis, loading, onAnalyze }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">AI Analysis</h2>
        <button
          onClick={onAnalyze}
          disabled={loading}
          className="rounded-lg bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Run Analysis"}
        </button>
      </div>

      {!analysis ? (
        <p className="text-sm text-slate-500">
          Run analysis to inspect severity, root cause and suggested fixes.
        </p>
      ) : (
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-semibold">Severity</p>
            <p>{analysis.severity}</p>
          </div>

          <div>
            <p className="font-semibold">Root Cause</p>
            <p>{analysis.rootCause}</p>
          </div>

          <div>
            <p className="font-semibold">Suggested Fix</p>
            <p>{analysis.suggestedFix}</p>
          </div>

          <div>
            <p className="font-semibold">Recommended Tests</p>
            <ul className="list-disc pl-5">
              {analysis.recommendedTests?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
