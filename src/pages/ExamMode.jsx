import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSubject } from '../lib/subjects'
import { useApp } from '../context/AppContext'

const letters = ['A', 'B', 'C', 'D']

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function ExamMode() {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  const subject = getSubject(subjectId)
  const { addExamResult, recordAnswer } = useApp()

  const [questions, setQuestions] = useState(null)
  const [loading, setLoading] = useState(true)
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)
  const [totalAnswered, setTotalAnswered] = useState(0)

  const loaded = useRef(false)
  useEffect(() => {
    if (loaded.current) return
    loaded.current = true
    fetch(`/data/${subjectId}.json`)
      .then(r => r.json())
      .then(data => {
        setQuestions(shuffleArray(data.questions).slice(0, 30))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [subjectId])

  if (!subject) return <p className="p-8 text-center">Fach nicht gefunden</p>
  if (loading) return <p className="p-8 text-center text-gray-400">Laden...</p>
  if (!questions || questions.length === 0) return <p className="p-8 text-center">Keine Fragen</p>

  const q = questions[idx]
  const isCorrect = picked === q.correct
  const hasAnswered = picked !== null

  function clickAnswer(i) {
    if (picked !== null) return
    setPicked(i)
    recordAnswer(q.id, i === q.correct)
    setTotalAnswered(totalAnswered + 1)
    if (i === q.correct) setScore(score + 1)
  }

  function clickNext() {
    if (idx + 1 >= questions.length) {
      addExamResult({
        subject: subjectId,
        date: new Date().toISOString(),
        score: score,
        total: questions.length,
      })
      navigate(`/ergebnis/${subjectId}?score=${score}&total=${questions.length}`, { replace: true })
    } else {
      setIdx(idx + 1)
      setPicked(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-blue-600 text-white px-4 py-4 flex items-center justify-between">
        <button onClick={() => navigate(`/fach/${subjectId}`)} className="text-white text-lg">←</button>
        <h1 className="text-lg font-bold">{subject.shortName} – Prüfung</h1>
        <span className="text-sm">{score}/{totalAnswered}</span>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4">
        <p className="text-xs text-gray-500 mb-1">Frage {idx + 1} / {questions.length}</p>

        <h2 className="text-base font-semibold text-gray-900 mb-4 leading-relaxed">{q.text}</h2>

        {q.options.map((opt, i) => {
          let bg = 'bg-white border-gray-200'
          let text = 'text-gray-900'
          let icon = null

          if (hasAnswered) {
            if (i === q.correct) {
              bg = 'bg-green-100 border-green-500'
              text = 'text-green-900'
              icon = <span className="ml-auto text-green-600 text-lg font-bold">✓</span>
            } else if (i === picked) {
              bg = 'bg-red-100 border-red-500'
              text = 'text-red-900'
              icon = <span className="ml-auto text-red-600 text-lg font-bold">✗</span>
            } else {
              bg = 'bg-gray-50 border-gray-200'
              text = 'text-gray-400'
            }
          }

          return (
            <button
              key={i}
              onClick={() => clickAnswer(i)}
              className={`w-full flex items-center gap-3 p-3 mb-2 rounded-lg border-2 text-left ${bg} ${text}`}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                hasAnswered && i === q.correct ? 'bg-green-500 text-white' :
                hasAnswered && i === picked ? 'bg-red-500 text-white' :
                'bg-gray-100 text-gray-600'
              }`}>
                {letters[i]}
              </span>
              <span className="text-sm flex-1">{opt}</span>
              {icon}
            </button>
          )
        })}

        {hasAnswered && (
          <div className={`mt-4 p-4 rounded-lg border-2 ${
            isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
          }`}>
            <p className={`text-xl font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {isCorrect ? '✓ Richtig!' : '✗ Falsch!'}
            </p>
            {!isCorrect && (
              <p className="text-sm text-red-600 mt-1">
                Richtige Antwort: {letters[q.correct]}
              </p>
            )}
            {q.explanation && (
              <p className="text-sm text-gray-600 mt-2">{q.explanation}</p>
            )}
          </div>
        )}

        {hasAnswered && (
          <button
            onClick={clickNext}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold text-sm"
          >
            {idx + 1 < questions.length ? 'Nächste Frage →' : 'Ergebnis anzeigen →'}
          </button>
        )}
      </div>
    </div>
  )
}
