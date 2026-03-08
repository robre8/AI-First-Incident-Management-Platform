'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api, Incident, IncidentDTO } from '@/lib/api'

const statusColor: Record<string, string> = {
  Open: 'bg-red-100 text-red-700',
  InProgress: 'bg-yellow-100 text-yellow-700',
  Resolved: 'bg-green-100 text-green-700',
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<IncidentDTO>({ title: '', description: '' })
  const [submitting, setSubmitting] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      setIncidents(await api.incidents.getAll())
    } catch {
      setError('Could not connect to the API. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.incidents.create(form)
      setForm({ title: '', description: '' })
      setShowForm(false)
      await load()
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete incident "${title}"?`)) return
    await api.incidents.delete(id)
    await load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Incidents</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
        >
          {showForm ? 'Cancel' : '+ New Incident'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-700 mb-4">New Incident</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Payment service down"
            />
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the incident..."
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
          >
            {submitting ? 'Creating...' : 'Create Incident'}
          </button>
        </form>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-400 text-sm">Loading incidents...</p>
      ) : incidents.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-lg font-medium">No incidents yet</p>
          <p className="text-sm mt-1">Create your first incident to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {incidents.map((inc) => (
            <div
              key={inc.id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-start justify-between gap-4 hover:border-blue-300 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <Link
                  href={`/incidents/${inc.id}`}
                  className="font-semibold text-blue-700 hover:underline block truncate"
                >
                  {inc.title}
                </Link>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{inc.description}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(inc.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[inc.status] ?? 'bg-gray-100 text-gray-600'}`}
                >
                  {inc.status}
                </span>
                <button
                  onClick={() => handleDelete(inc.id, inc.title)}
                  className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                  title="Delete incident"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
