export default function LogList({ logs, loading = false }) {
  return (
    <div className="rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700 p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold dark:text-slate-100">Logs</h2>

      {loading ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading logs...</p>
      ) : logs.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">No logs found.</p>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="rounded-lg border dark:border-slate-600 dark:bg-slate-700 p-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-medium dark:text-slate-200">{log.service}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{log.logLevel}</span>
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-300">{log.message}</p>

              <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                {log.timestamp}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
