'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { api, Incident, LogEntry, AIAnalysisResult } from '@/lib/api'

const severityStyle: Record<string, string> = {
  Critical: 'bg-red-100 text-red-700 border-red-200',
  High: 'bg-orange-100 text-orange-700 border-orange-200',
  Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Low: 'bg-green-100 text-green-700 border-green-200',
}

const logLevelStyle: Record<string, string> = {
  ERROR: 'text-red-500 font-semibold',
  CRITICAL: 'text-red-600 font-bold',
  WARN: 'text-yellow-500 font-semibold',
  INFO: 'text-blue-500',
  DEBUG: 'text-gray-400',
}

export default function IncidentDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [incident, setIncident] = useState<Incident | null>(null)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [logForm, setLogForm] = useState({ service: '', logLevel: 'INFO', message: '' })
  const [submittingLog, setSubmittingLog] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const [inc, ls] = await Promise.all([
        api.incidents.getById(id),
        api.logs.getByIncident(id),
      ])
      setIncident(inc)
      setLogs(ls)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittingLog(true)
    try {
      await api.logs.create(id, logForm)
      setLogForm({ service: '', logLevel: 'INFO', message: '' })
      await load()
    } finally {
      setSubmittingLog(false)
    }
  }

  const handleAnalyze = async () => {
    setAnalyzing(true)
    setAnalysis(null)
    try {
      setAnalysis(await api.ai.analyze(id))
    } finally {
      setAnalyzing(false)
    }
  }

  if (loading) {
    return <p className="text-gray-400 text-sm">Loading incident...</p>
  }

  if (!incident) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">🔍</p>
        <p className="text-gray-500">Incident not found.</p>
        <Link href="/incidents" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
          ← Back to incidents
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link href="/incidents" className="text-sm text-blue-600 hover:underline mb-5 inline-block">
        ← Back to incidents
      </Link>

      {/* Incident header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{incident.title}</h1>
        <p className="text-gray-500 mt-2">{incident.description}</p>
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-400">
          <span>
            Status: <strong className="text-gray-700">{incident.status}</strong>
          </span>
          <span>
            Priority: <strong className="text-gray-700">{incident.priority}</strong>
          </span>
          <span>{new Date(incident.createdAt).toLocaleString()}</span>
        </div>
      </div>

      {/* Logs */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Logs{' '}
          <span className="text-sm font-normal text-gray-400">({logs.length})</span>
        </h2>

        <form onSubmit={handleAddLog} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <input
            value={logForm.service}
            onChange={(e) => setLogForm({ ...logForm, service: e.target.value })}
            required
            placeholder="Service name"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <select
            value={logForm.logLevel}
            onChange={(e) => setLogForm({ ...logForm, logLevel: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            {['INFO', 'WARN', 'ERROR', 'DEBUG', 'CRITICAL'].map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
          <input
            value={logForm.message}
            onChange={(e) => setLogForm({ ...logForm, message: e.target.value })}
            required
            placeholder="Log message"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <button
            type="submit"
            disabled={submittingLog}
            className="sm:col-span-3 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 disabled:opacity-50 text-sm font-medium transition-colors"
          >
            {submittingLog ? 'Adding...' : '+ Add Log Entry'}
          </button>
        </form>

        {logs.length === 0 ? (
          <p className="text-gray-400 text-sm italic">No logs yet. Add some to run AI analysis.</p>
        ) : (
          <div className="space-y-1 max-h-72 overflow-y-auto font-mono text-xs">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex gap-3 bg-gray-50 rounded px-3 py-2 items-start"
              >
                <span className="text-gray-400 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className="text-blue-600 whitespace-nowrap">[{log.service}]</span>
                <span className={logLevelStyle[log.logLevel] ?? 'text-gray-500'}>
                  {log.logLevel}
                </span>
                <span className="text-gray-700">{log.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Analysis */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">AI Analysis</h2>
          <button
            onClick={handleAnalyze}
            disabled={analyzing || logs.length === 0}
            className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-40 text-sm font-medium transition-colors"
            title={logs.length === 0 ? 'Add logs first' : ''}
          >
            {analyzing ? 'Analyzing...' : '🤖 Run AI Analysis'}
          </button>
        </div>

        {logs.length === 0 && !analysis && (
          <p className="text-gray-400 text-sm italic">Add log entries to enable AI analysis.</p>
        )}

        {analysis && (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold border ${severityStyle[analysis.severity] ?? 'bg-gray-100 text-gray-600'}`}
              >
                Severity: {analysis.severity}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-semibold border bg-blue-50 text-blue-700 border-blue-200">
                Category: {analysis.category}
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">🔍 Root Cause</p>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 leading-relaxed">
                {analysis.rootCause}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">🛠 Suggested Fix</p>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 leading-relaxed">
                {analysis.suggestedFix}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">✅ Recommended Tests</p>
              <ul className="space-y-1">
                {analysis.recommendedTests.map((t, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700">
                    <span className="text-green-500">•</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
