import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { subjects } from '../lib/subjects'
import Header from '../components/Header'

export default function Settings() {
  const { resetProgress, examHistory, progress, bookmarks, darkMode, toggleDarkMode } = useApp()
  const [showConfirm, setShowConfirm] = useState(false)

  const totalAnswered = Object.keys(progress).length
  const totalCorrect = Object.values(progress).filter((p) => p.correct).length
  const totalExams = examHistory.length

  return (
    <div className="min-h-screen pb-20">
      <Header title="Einstellungen" />

      <div className="mx-auto max-w-lg px-4 py-5">
        {/* App info */}
        <div className="rounded-xl bg-white dark:bg-gray-900 p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">BQ Prüfung</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Industriemeister Basisqualifikation – Prüfungsvorbereitung
          </p>
          <p className="mt-2 text-xs text-gray-400">Version 1.0.0</p>
        </div>

        {/* Appearance */}
        <div className="mt-4 rounded-xl bg-white dark:bg-gray-900 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Darstellung</h3>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">{darkMode ? '🌙' : '☀️'}</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative h-7 w-12 rounded-full transition-colors duration-200 ${
                darkMode ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              aria-label="Dark Mode umschalten"
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  darkMode ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-4 rounded-xl bg-white dark:bg-gray-900 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Statistik</h3>
          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Fragen bearbeitet</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{totalAnswered}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Richtig beantwortet</span>
              <span className="font-medium text-emerald-600">{totalCorrect}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Prüfungen absolviert</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{totalExams}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Lesezeichen</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{bookmarks.length}</span>
            </div>
          </div>
        </div>

        {/* Exam history */}
        {examHistory.length > 0 && (
          <div className="mt-4 rounded-xl bg-white dark:bg-gray-900 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Prüfungshistorie</h3>
            <div className="mt-3 space-y-2">
              {examHistory.slice(0, 10).map((exam, i) => {
                const sub = subjects.find((s) => s.id === exam.subject)
                const pct = Math.round((exam.score / exam.total) * 100)
                return (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${sub?.colorClass || 'bg-gray-400'}`} />
                      <span className="text-gray-600 dark:text-gray-400">{sub?.shortName}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(exam.date).toLocaleDateString('de-DE')}
                      </span>
                    </div>
                    <span className={`font-medium ${pct >= 50 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {pct}%
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Reset */}
        <div className="mt-4 rounded-xl bg-white dark:bg-gray-900 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Daten</h3>
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="mt-3 w-full rounded-lg border border-red-300 dark:border-red-800 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 active:bg-red-50 dark:active:bg-red-950"
            >
              Fortschritt zurücksetzen
            </button>
          ) : (
            <div className="mt-3 space-y-2">
              <p className="text-sm text-red-600 dark:text-red-400">
                Wirklich alle Daten löschen? Dies kann nicht rückgängig gemacht werden.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => { resetProgress(); setShowConfirm(false) }}
                  className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white"
                >
                  Ja, löschen
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Credits */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Inhalte orientiert an IHK-Prüfungsrahmen
        </p>
      </div>
    </div>
  )
}
