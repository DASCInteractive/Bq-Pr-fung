import { useMemo } from 'react'
import { useApp } from '../context/AppContext'

export function useSubjectStats(subjectId, questions) {
  const { progress } = useApp()

  return useMemo(() => {
    if (!questions) return { answered: 0, correct: 0, total: 0, percent: 0 }

    const total = questions.length
    let answered = 0
    let correct = 0

    for (const q of questions) {
      const p = progress[q.id]
      if (p) {
        answered++
        if (p.correct) correct++
      }
    }

    return {
      answered,
      correct,
      total,
      percent: total > 0 ? Math.round((correct / total) * 100) : 0,
    }
  }, [questions, progress])
}
