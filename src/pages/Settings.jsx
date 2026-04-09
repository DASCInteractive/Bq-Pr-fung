import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function Settings() {
  const { resetProgress, examHistory, progress, bookmarks } = useApp()
  const [showConfirm, setShowConfirm] = useState(false)

  const totalAnswered = Object.keys(progress).length
  const totalCorrect = Object.values(progress).filter((p) => p.correct).length

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-blue-600 text-white px-4 py-4 text-center">
        <h1 className="text-lg font-bold">Einstellungen</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">BQ Prüfung</h2>
          <p className="text-sm text-gray-500 mt-1">Industriemeister BQ – Prüfungsvorbereitung</p>
          <p className="text-xs text-gray-400 mt-2">Version 1.0.0</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 uppercase">Statistik</h3>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Fragen bearbeitet</span>
              <span className="font-medium">{totalAnswered}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Richtig beantwortet</span>
              <span className="font-medium text-green-600">{totalCorrect}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Prüfungen</span>
              <span className="font-medium">{examHistory.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Lesezeichen</span>
              <span className="font-medium">{bookmarks.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 uppercase">Daten</h3>
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="mt-3 w-full rounded-lg border border-red-300 py-2.5 text-sm font-medium text-red-600"
            >
              Fortschritt zurücksetzen
            </button>
          ) : (
            <div className="mt-3 space-y-2">
              <p className="text-sm text-red-600">Wirklich alle Daten löschen?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => { resetProgress(); setShowConfirm(false) }}
                  className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white"
                >
                  Ja, löschen
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
