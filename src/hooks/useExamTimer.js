import { useState, useEffect, useCallback, useRef } from 'react'

export function useExamTimer(durationMinutes, onTimeUp) {
  const [remaining, setRemaining] = useState(durationMinutes * 60)
  const [running, setRunning] = useState(false)
  const onTimeUpRef = useRef(onTimeUp)
  onTimeUpRef.current = onTimeUp

  useEffect(() => {
    if (!running || remaining <= 0) return

    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(id)
          setRunning(false)
          onTimeUpRef.current?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(id)
  }, [running, remaining])

  const start = useCallback(() => setRunning(true), [])
  const pause = useCallback(() => setRunning(false), [])
  const elapsed = durationMinutes * 60 - remaining

  return { remaining, elapsed, running, start, pause }
}
