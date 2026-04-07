import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { subjects, getSubject } from '../lib/subjects'
import Header from '../components/Header'
import QuestionCard from '../components/QuestionCard'

export default function Bookmarks() {
  const { bookmarks } = useApp()
  const [allQuestions, setAllQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [activeSubject, setActiveSubject] = useState(null)

  useEffect(() => {
    if (bookmarks.length === 0) {
      setLoading(false)
      return
    }

    const subjectsNeeded = [...new Set(bookmarks.map((id) => id.split('-')[0]))]
    Promise.all(
      subjectsNeeded.map((s) =>
        fetch(`/data/${s}.json`)
          .then((r) => r.json())
          .then((d) => d.questions)
      )
    ).then((arrays) => {
      const all = arrays.flat().filter((q) => bookmarks.includes(q.id))
      setAllQuestions(all)
      setLoading(false)
    })
  }, [bookmarks])

  const filtered = activeSubject
    ? allQuestions.filter((q) => q.id.startsWith(activeSubject + '-'))
    : allQuestions

  const subjectsWithBookmarks = subjects.filter((s) =>
    bookmarks.some((id) => id.startsWith(s.id + '-'))
  )

  return (
    <div className="min-h-screen pb-20">
      <Header title="Merkliste" />

      {loading ? (
        <div className="py-12 text-center text-gray-400">Laden...</div>
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
              onClick={() => { setActiveSubject(null); setCurrentIndex(0) }}
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
                  onClick={() => { setActiveSubject(s.id); setCurrentIndex(0) }}
                  className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                    activeSubject === s.id ? `${s.colorClass} text-white` : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {s.shortName} ({count})
                </button>
              )
            })}
          </div>

          {filtered.length > 0 && currentIndex < filtered.length && (
            <QuestionCard
              key={filtered[currentIndex].id}
              question={filtered[currentIndex]}
              index={currentIndex}
              total={filtered.length}
              onNext={() => setCurrentIndex((i) => Math.min(i + 1, filtered.length - 1))}
              subjectColor={getSubject(filtered[currentIndex].id.split('-')[0])?.colorClass}
            />
          )}
        </>
      )}
    </div>
  )
}
