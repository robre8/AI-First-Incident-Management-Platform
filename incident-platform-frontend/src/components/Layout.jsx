import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Layout({ children }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-200">
      <header className="border-b bg-white dark:bg-slate-800 dark:border-slate-700 transition-colors duration-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-bold">
            AI Incident Platform
          </Link>

          <nav className="flex gap-4 items-center text-sm">
            <Link to="/" className="hover:underline">
              Dashboard
            </Link>
            <Link to="/incidents/new" className="hover:underline">
              New Incident
            </Link>
            
            {/* Botón de toggle de tema */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label={`Cambiar a modo ${theme === "light" ? "oscuro" : "claro"}`}
            >
              {theme === "light" ? (
                // Icono de luna para modo oscuro
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                // Icono de sol para modo claro
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              )}
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-6">
        {children}
      </main>
    </div>
  );
}
