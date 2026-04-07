import { useState, useEffect } from 'react'

const cache = {}

export function useQuestions(subjectId) {
  const [questions, setQuestions] = useState(cache[subjectId]?.questions || null)
  const [loading, setLoading] = useState(!cache[subjectId])
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!subjectId) return

    if (cache[subjectId]) {
      setQuestions(cache[subjectId].questions)
      setLoading(false)
      return
    }

    setLoading(true)
    fetch(`/data/${subjectId}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data) => {
        cache[subjectId] = data
        setQuestions(data.questions)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [subjectId])

  return { questions, loading, error }
}
