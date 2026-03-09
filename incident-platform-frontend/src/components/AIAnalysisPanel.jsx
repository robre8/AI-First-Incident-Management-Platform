export default function AIAnalysisPanel({ analysis, loading, onAnalyze }) {
  return (
    <div className="rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold dark:text-slate-100">AI Analysis</h2>
        <button
          onClick={onAnalyze}
          disabled={loading}
          className="rounded-lg bg-slate-900 dark:bg-slate-700 px-4 py-2 text-white disabled:opacity-50 hover:bg-slate-800 dark:hover:bg-slate-600"
        >
          {loading ? "Analyzing..." : "Run Analysis"}
        </button>
      </div>

      {!analysis ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Run analysis to inspect severity, root cause and suggested fixes.
        </p>
      ) : (
        <div className="space-y-3 text-sm dark:text-slate-300">
          <div>
            <p className="font-semibold dark:text-slate-200">Severity</p>
            <p>{analysis.severity}</p>
          </div>

          <div>
            <p className="font-semibold dark:text-slate-200">Root Cause</p>
            <p>{analysis.rootCause}</p>
          </div>

          <div>
            <p className="font-semibold dark:text-slate-200">Suggested Fix</p>
            <p>{analysis.suggestedFix}</p>
          </div>

          <div>
            <p className="font-semibold dark:text-slate-200">Recommended Tests</p>
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
