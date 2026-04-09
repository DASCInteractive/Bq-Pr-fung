import { useState, useRef, useEffect, useCallback } from 'react'
import { useApp } from '../context/AppContext'

const letters = ['A', 'B', 'C', 'D']

export default function QuestionCard({ question, index, total, onNext, subjectColor }) {
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [canProceed, setCanProceed] = useState(false)
  const { recordAnswer, toggleBookmark, isBookmarked } = useApp()
  const bookmarked = isBookmarked(question.id)
  const answeredRef = useRef(false)

  // Reset state when question changes
  useEffect(() => {
    setSelected(null)
    setRevealed(false)
    setCanProceed(false)
    answeredRef.current = false
  }, [question.id])

  const handleSelect = useCallback((optionIndex) => {
    if (revealed || answeredRef.current) return
    answeredRef.current = true
    setSelected(optionIndex)
    setRevealed(true)
    // Delay before allowing next
    setTimeout(() => setCanProceed(true), 1000)
  }, [revealed])

  const handleNext = useCallback(() => {
    if (!canProceed) return
    // Record answer to context only when moving on
    if (selected !== null) {
      recordAnswer(question.id, selected === question.correct)
    }
    onNext()
  }, [canProceed, selected, question.id, question.correct, recordAnswer, onNext])

  const isCorrect = selected === question.correct

  return (
    <div className="mx-auto max-w-lg px-4 py-4">
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
          >
            <svg
              className={`h-5 w-5 ${
                bookmarked ? 'fill-amber-500 text-amber-500' : 'text-gray-400'
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
      <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-gray-200">
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
      <h2 className="mb-5 text-base font-semibold leading-snug text-gray-900">{question.text}</h2>

      {/* Options */}
      <div className="space-y-2">
        {question.options.map((opt, i) => {
          let bg = 'background: white; border: 2px solid #e5e7eb;'
          let letterBg = 'background: #f3f4f6; color: #4b5563;'
          let textColor = 'color: #111827;'

          if (revealed) {
            if (i === question.correct) {
              bg = 'background: #ecfdf5; border: 2px solid #10b981;'
              letterBg = 'background: #10b981; color: white;'
              textColor = 'color: #065f46;'
            } else if (selected === i) {
              bg = 'background: #fef2f2; border: 2px solid #ef4444;'
              letterBg = 'background: #ef4444; color: white;'
              textColor = 'color: #991b1b;'
            } else {
              bg = 'background: #f9fafb; border: 2px solid #e5e7eb;'
              textColor = 'color: #9ca3af;'
            }
          } else if (selected === i) {
            bg = 'background: #eff6ff; border: 2px solid #3b82f6;'
            letterBg = 'background: #3b82f6; color: white;'
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={revealed}
              style={{ cssText: `${bg} display: flex; width: 100%; align-items: flex-start; gap: 12px; border-radius: 8px; padding: 12px; text-align: left;` }}
            >
              <span
                style={{ cssText: `${letterBg} display: flex; height: 28px; width: 28px; flex-shrink: 0; align-items: center; justify-content: center; border-radius: 50%; font-size: 12px; font-weight: 700;` }}
              >
                {letters[i]}
              </span>
              <span style={{ cssText: `${textColor} padding-top: 2px; font-size: 14px; line-height: 1.4;` }}>{opt}</span>
            </button>
          )
        })}
      </div>

      {/* Feedback banner */}
      {revealed && (
        <div
          style={{
            marginTop: '16px',
            padding: '16px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: isCorrect ? '#ecfdf5' : '#fef2f2',
            border: isCorrect ? '2px solid #10b981' : '2px solid #ef4444',
          }}
        >
          <span style={{ fontSize: '32px' }}>{isCorrect ? '\u2705' : '\u274C'}</span>
          <div>
            <p style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: isCorrect ? '#065f46' : '#991b1b',
            }}>
              {isCorrect ? 'Richtig!' : 'Falsch!'}
            </p>
            {!isCorrect && (
              <p style={{ fontSize: '14px', color: '#dc2626', marginTop: '2px' }}>
                Richtige Antwort: {letters[question.correct]}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Explanation */}
      {revealed && (
        <div style={{
          marginTop: '12px',
          padding: '16px',
          borderRadius: '12px',
          background: '#f9fafb',
          border: '1px solid #e5e7eb',
        }}>
          <p style={{ fontSize: '11px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Erkl\u00e4rung</p>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#374151' }}>{question.explanation}</p>
        </div>
      )}

      {/* Next button */}
      {revealed && (
        <div style={{ marginTop: '20px', paddingBottom: '16px' }}>
          <button
            onClick={handleNext}
            disabled={!canProceed}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              color: 'white',
              background: canProceed ? '#2563eb' : '#d1d5db',
              cursor: canProceed ? 'pointer' : 'not-allowed',
            }}
          >
            {index + 1 < total ? 'N\u00e4chste Frage \u2192' : 'Abschlie\u00dfen \u2713'}
          </button>
        </div>
      )}
    </div>
  )
}
