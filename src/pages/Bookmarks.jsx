import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { subjects, getSubject } from '../lib/subjects'
import Header from '../components/Header'
import QuestionCard from '../components/QuestionCard'

export default function Bookmarks() {
  const { bookmarks } = useApp()
  const [allQuestions, setAllQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [activeSubject, setActiveSubject] = useState(null)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    if (bookmarks.length === 0) {
      setAllQuestions([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    const subjectsNeeded = [...new Set(bookmarks.map((id) => id.split('-')[0]))]
    Promise.all(
      subjectsNeeded.map((s) =>
        fetch(`/data/${s}.json`)
          .then((r) => {
            if (!r.ok) throw new Error(`Fehler beim Laden von ${s}`)
            return r.json()
          })
          .then((d) => d.questions)
      )
    )
      .then((arrays) => {
        const all = arrays.flat().filter((q) => bookmarks.includes(q.id))
        setAllQuestions(all)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [bookmarks])

  const filtered = activeSubject
    ? allQuestions.filter((q) => q.id.startsWith(activeSubject + '-'))
    : allQuestions

  const safeIndex = Math.min(currentIndex, Math.max(0, filtered.length - 1))

  const subjectsWithBookmarks = subjects.filter((s) =>
    bookmarks.some((id) => id.startsWith(s.id + '-'))
  )

  const handleNext = () => {
    if (safeIndex + 1 >= filtered.length) {
      setFinished(true)
    } else {
      setCurrentIndex(safeIndex + 1)
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setFinished(false)
  }

  return (
    <div className="min-h-screen pb-20">
      <Header title="Merkliste" />

      {loading ? (
        <div className="py-12 text-center text-gray-400">Laden...</div>
      ) : error ? (
        <div className="px-4 py-12 text-center">
          <span className="text-4xl">⚠️</span>
          <p className="mt-3 text-gray-500">{error}</p>
        </div>
      ) : allQuestions.length === 0 ? (
        <div className="px-4 py-12 text-center">
          <span className="text-4xl">📌</span>
          <p className="mt-3 text-gray-500">Noch keine Fragen markiert</p>
          <p className="mt-1 text-sm text-gray-400">
            Tippe beim Lernen auf das Lesezeichen-Symbol
          </p>
        </div>
      ) : (
        <>
          {/* Subject filter */}
          <div className="mx-auto flex max-w-lg gap-1.5 overflow-x-auto px-4 pt-3">
            <button
              onClick={() => { setActiveSubject(null); setCurrentIndex(0); setFinished(false) }}
              className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                !activeSubject ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Alle ({allQuestions.length})
            </button>
            {subjectsWithBookmarks.map((s) => {
              const count = allQuestions.filter((q) => q.id.startsWith(s.id + '-')).length
              return (
                <button
                  key={s.id}
                  onClick={() => { setActiveSubject(s.id); setCurrentIndex(0); setFinished(false) }}
                  className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                    activeSubject === s.id ? `${s.colorClass} text-white` : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {s.shortName} ({count})
                </button>
              )
            })}
          </div>

          {finished ? (
            <div className="px-4 py-12 text-center">
              <span className="text-4xl">✅</span>
              <p className="mt-3 font-semibold text-gray-700">Alle markierten Fragen durchgearbeitet!</p>
              <button
                onClick={handleRestart}
                className="mt-4 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white"
              >
                Nochmal von vorne
              </button>
            </div>
          ) : filtered.length > 0 ? (
            <QuestionCard
              key={filtered[safeIndex].id}
              question={filtered[safeIndex]}
              index={safeIndex}
              total={filtered.length}
              onNext={handleNext}
              subjectColor={getSubject(filtered[safeIndex].id.split('-')[0])?.colorClass}
            />
          ) : (
            <div className="px-4 py-12 text-center">
              <p className="text-gray-500">Keine Lesezeichen in diesem Fach</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
