import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { load, save } from '../lib/storage'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [progress, setProgress] = useState(() => load('progress', {}))
  const [bookmarks, setBookmarks] = useState(() => load('bookmarks', []))
  const [examHistory, setExamHistory] = useState(() => load('examHistory', []))

  useEffect(() => save('progress', progress), [progress])
  useEffect(() => save('bookmarks', bookmarks), [bookmarks])
  useEffect(() => save('examHistory', examHistory), [examHistory])

  const recordAnswer = useCallback((questionId, correct) => {
    setProgress((prev) => {
      const existing = prev[questionId] || { correct: false, attempts: 0 }
      return {
        ...prev,
        [questionId]: {
          correct: correct || existing.correct,
          attempts: existing.attempts + 1,
          lastAttempt: new Date().toISOString(),
        },
      }
    })
  }, [])

  const toggleBookmark = useCallback((questionId) => {
    setBookmarks((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    )
  }, [])

  const isBookmarked = useCallback(
    (questionId) => bookmarks.includes(questionId),
    [bookmarks]
  )

  const addExamResult = useCallback((result) => {
    setExamHistory((prev) => [result, ...prev].slice(0, 50))
  }, [])

  const getSubjectProgress = useCallback(
    (subjectId) => {
      const entries = Object.entries(progress).filter(([id]) =>
        id.startsWith(subjectId + '-')
      )
      const total = entries.length
      const correct = entries.filter(([, v]) => v.correct).length
      return { total, correct }
    },
    [progress]
  )

  const resetProgress = useCallback(() => {
    setProgress({})
    setBookmarks([])
    setExamHistory([])
  }, [])

  return (
    <AppContext.Provider
      value={{
        progress,
        bookmarks,
        examHistory,
        recordAnswer,
        toggleBookmark,
        isBookmarked,
        addExamResult,
        getSubjectProgress,
        resetProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
