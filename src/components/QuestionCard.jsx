import { useState } from 'react'
import { useApp } from '../context/AppContext'

const letters = ['A', 'B', 'C', 'D']

export default function QuestionCard({ question, index, total, onNext, subjectColor }) {
  const [selected, setSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const { recordAnswer, toggleBookmark, isBookmarked } = useApp()
  const bookmarked = isBookmarked(question.id)

  const handleAnswer = (i) => {
    if (showResult) return
    setSelected(i)
    setShowResult(true)
  }

  const handleNext = () => {
    recordAnswer(question.id, selected === question.correct)
    setSelected(null)
    setShowResult(false)
    onNext()
  }

  const isCorrect = selected === question.correct

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: '#6b7280' }}>
          Frage {index + 1} / {total}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            padding: '2px 8px',
            borderRadius: 12,
            fontSize: 11,
            fontWeight: 600,
            background: question.difficulty === 1 ? '#dcfce7' : question.difficulty === 2 ? '#fef9c3' : '#fee2e2',
            color: question.difficulty === 1 ? '#166534' : question.difficulty === 2 ? '#854d0e' : '#991b1b',
          }}>
            {question.difficulty === 1 ? 'Leicht' : question.difficulty === 2 ? 'Mittel' : 'Schwer'}
          </span>
          <button
            onClick={() => toggleBookmark(question.id)}
            style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', padding: 4 }}
          >
            {bookmarked ? '\u2B50' : '\u2606'}
          </button>
        </div>
      </div>

      {question.topic && (
        <p style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{question.topic}</p>
      )}

      <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 20, lineHeight: 1.5 }}>
        {question.text}
      </h2>

      <div>
        {question.options.map((opt, i) => {
          let bg = '#ffffff'
          let borderColor = '#e5e7eb'
          let textColor = '#111827'
          let letterBg = '#f3f4f6'
          let letterColor = '#4b5563'

          if (showResult && i === question.correct) {
            bg = '#d1fae5'
            borderColor = '#10b981'
            textColor = '#065f46'
            letterBg = '#10b981'
            letterColor = '#ffffff'
          } else if (showResult && selected === i && i !== question.correct) {
            bg = '#fee2e2'
            borderColor = '#ef4444'
            textColor = '#991b1b'
            letterBg = '#ef4444'
            letterColor = '#ffffff'
          } else if (showResult) {
            bg = '#f9fafb'
            borderColor = '#e5e7eb'
            textColor = '#9ca3af'
          } else if (selected === i) {
            bg = '#dbeafe'
            borderColor = '#3b82f6'
            textColor = '#1e40af'
            letterBg = '#3b82f6'
            letterColor = '#ffffff'
          }

          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                padding: 12,
                marginBottom: 8,
                borderRadius: 8,
                border: `2px solid ${borderColor}`,
                background: bg,
                color: textColor,
                textAlign: 'left',
                cursor: showResult ? 'default' : 'pointer',
                fontSize: 14,
                lineHeight: 1.4,
              }}
            >
              <span style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 28,
                height: 28,
                minWidth: 28,
                borderRadius: '50%',
                fontSize: 12,
                fontWeight: 700,
                background: letterBg,
                color: letterColor,
              }}>
                {letters[i]}
              </span>
              <span>{opt}</span>
            </button>
          )
        })}
      </div>

      {showResult && (
        <div style={{
          marginTop: 16,
          padding: 20,
          borderRadius: 12,
          background: isCorrect ? '#d1fae5' : '#fee2e2',
          border: isCorrect ? '3px solid #10b981' : '3px solid #ef4444',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 40, margin: 0 }}>{isCorrect ? '\u2705' : '\u274C'}</p>
          <p style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: isCorrect ? '#065f46' : '#991b1b',
            margin: '8px 0 0 0',
          }}>
            {isCorrect ? 'Richtig!' : 'Falsch!'}
          </p>
          {!isCorrect && (
            <p style={{ fontSize: 16, color: '#dc2626', margin: '4px 0 0 0' }}>
              Richtige Antwort: {letters[question.correct]}
            </p>
          )}
        </div>
      )}

      {showResult && question.explanation && (
        <div style={{
          marginTop: 12,
          padding: 16,
          borderRadius: 12,
          background: '#f9fafb',
          border: '1px solid #e5e7eb',
        }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', margin: '0 0 4px 0' }}>Erkl\u00e4rung</p>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: '#374151', margin: 0 }}>{question.explanation}</p>
        </div>
      )}

      {showResult && (
        <button
          onClick={handleNext}
          style={{
            width: '100%',
            padding: 14,
            marginTop: 20,
            borderRadius: 12,
            border: 'none',
            fontSize: 14,
            fontWeight: 600,
            color: '#ffffff',
            background: '#2563eb',
            cursor: 'pointer',
          }}
        >
          {index + 1 < total ? 'N\u00e4chste Frage \u2192' : 'Abschlie\u00dfen \u2713'}
        </button>
      )}
    </div>
  )
}
