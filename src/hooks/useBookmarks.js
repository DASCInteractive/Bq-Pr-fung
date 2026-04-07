import { useMemo } from 'react'
import { useApp } from '../context/AppContext'

export function useBookmarkedQuestions(questions) {
  const { bookmarks } = useApp()

  return useMemo(() => {
    if (!questions) return []
    return questions.filter((q) => bookmarks.includes(q.id))
  }, [questions, bookmarks])
}
