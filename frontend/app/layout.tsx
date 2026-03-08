import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Incident Platform',
  description: 'AI-First Incident Management Platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <nav className="bg-gray-900 text-white px-6 py-4 shadow-md">
          <div className="max-w-5xl mx-auto flex items-center gap-3">
            <span className="text-xl">🚨</span>
            <a href="/incidents" className="text-lg font-bold hover:text-blue-400 transition-colors">
              AI Incident Platform
            </a>
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  )
}
