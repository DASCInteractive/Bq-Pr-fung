import { useState, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import AnswerOption from './AnswerOption'
import ExplanationPanel from './ExplanationPanel'

export default function QuestionCard({ question, index, total, onNext, subjectColor }) {
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [animClass, setAnimClass] = useState('translate-x-0 opacity-100')
  const { recordAnswer, toggleBookmark, isBookmarked } = useApp()
  const bookmarked = isBookmarked(question.id)
  const touchStartX = useRef(0)
  const containerRef = useRef(null)

  // Animate in on mount
  useEffect(() => {
    setAnimClass('translate-x-4 opacity-0')
    const id = requestAnimationFrame(() => {
      setAnimClass('translate-x-0 opacity-100 transition-all duration-200 ease-out')
    })
    return () => cancelAnimationFrame(id)
  }, [question.id])

  const handleSelect = (optionIndex) => {
    setSelected(optionIndex)
  }

  const handleConfirm = () => {
    if (selected === null) return
    const correct = selected === question.correct
    recordAnswer(question.id, correct)
    setRevealed(true)

    // Scroll to explanation
    setTimeout(() => {
      containerRef.current?.querySelector('[data-explanation]')?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }, 100)
  }

  const handleNext = () => {
    // Animate out then call onNext
    setAnimClass('transition-all duration-150 ease-in -translate-x-8 opacity-0')
    setTimeout(() => {
      setSelected(null)
      setRevealed(false)
      onNext()
    }, 150)
  }

  // Swipe to next (only after revealed)
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (!revealed) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (diff > 80) {
      handleNext()
    }
  }

  return (
    <div
      ref={containerRef}
      className={`mx-auto max-w-lg px-4 py-4 ${animClass}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top bar */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">
          Frage {index + 1} / {total}
        </span>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              question.difficulty === 1
                ? 'bg-green-100 text-green-700'
                : question.difficulty === 2
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {question.difficulty === 1 ? 'Leicht' : question.difficulty === 2 ? 'Mittel' : 'Schwer'}
          </span>
          <button
            onClick={() => toggleBookmark(question.id)}
            className="flex h-9 w-9 items-center justify-center rounded-full active:bg-gray-100"
            aria-label={bookmarked ? 'Lesezeichen entfernen' : 'Lesezeichen setzen'}
          >
            <svg
              className={`h-5 w-5 transition-transform duration-200 ${
                bookmarked ? 'fill-amber-500 text-amber-500 scale-110' : 'text-gray-400 scale-100'
              }`}
              viewBox="0 0 24 24"
              fill={bookmarked ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
        <div
          className={`h-full rounded-full ${subjectColor || 'bg-blue-600'} transition-all duration-500`}
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      {/* Topic */}
      {question.topic && (
        <p className="mb-2 text-xs font-medium text-gray-400 uppercase tracking-wide">{question.topic}</p>
      )}

      {/* Question text */}
      <h2 className="mb-5 text-base font-semibold leading-snug text-gray-900 dark:text-gray-100">{question.text}</h2>

      {/* Options */}
      <div className="space-y-2">
        {question.options.map((opt, i) => (
          <AnswerOption
            key={i}
            index={i}
            text={opt}
            selected={selected}
            correct={question.correct}
            revealed={revealed}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {/* Explanation */}
      {revealed && (
        <div data-explanation>
          <ExplanationPanel explanation={question.explanation} correct={selected === question.correct} />
        </div>
      )}

      {/* Action button */}
      <div className="mt-5 pb-4">
        {!revealed ? (
          <button
            onClick={handleConfirm}
            disabled={selected === null}
            className={`w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-all duration-200 ${
              selected !== null
                ? 'bg-blue-600 active:bg-blue-700 active:scale-[0.98] shadow-sm'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Antwort prüfen
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-sm active:bg-blue-700 active:scale-[0.98] transition-all duration-200"
          >
            {index + 1 < total ? 'Nächste Frage →' : 'Abschließen ✓'}
          </button>
        )}

        {/* Swipe hint after first answer */}
        {revealed && index === 0 && (
          <p className="mt-2 text-center text-xs text-gray-400">← Wischen für nächste Frage</p>
        )}
      </div>
    </div>
  )
}
