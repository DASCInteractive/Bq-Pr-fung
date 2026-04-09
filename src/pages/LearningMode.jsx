import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSubject } from '../lib/subjects'
import { useQuestions } from '../hooks/useQuestions'
import { useApp } from '../context/AppContext'
import { shuffle } from '../lib/utils'
import Header from '../components/Header'

const letters = ['A', 'B', 'C', 'D']

export default function LearningMode() {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  const subject = getSubject(subjectId)
  const { questions, loading } = useQuestions(subjectId)
  const { progress, recordAnswer, toggleBookmark, isBookmarked } = useApp()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [filter, setFilter] = useState('all')
  const [shuffledQuestions, setShuffledQuestions] = useState([])
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)

  useEffect(() => {
    if (!questions) {
      setShuffledQuestions([])
      return
    }
    let filtered = questions
    if (filter === 'unanswered') {
      filtered = questions.filter((q) => !progress[q.id])
    } else if (filter === 'wrong') {
      filtered = questions.filter((q) => progress[q.id] && !progress[q.id].correct)
    }
    setShuffledQuestions(shuffle([...filtered]))
    setCurrentIndex(0)
    setSelected(null)
    setAnswered(false)
  }, [questions, filter]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!subject) return <div className="p-8 text-center text-gray-500">Fach nicht gefunden</div>

  const question = shuffledQuestions[currentIndex]

  const handleAnswer = (i) => {
    if (answered) return
    setSelected(i)
    setAnswered(true)
    recordAnswer(question.id, i === question.correct)
  }

  const handleNext = () => {
    if (currentIndex + 1 >= shuffledQuestions.length) {
      navigate(`/fach/${subjectId}`)
    } else {
      setCurrentIndex(currentIndex + 1)
      setSelected(null)
      setAnswered(false)
    }
  }

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
  }

  return (
    <div className="min-h-screen pb-20">
      <Header title={`${subject.shortName} – Lernen`} showBack />

      {loading ? (
        <div className="py-12 text-center text-gray-400">Laden...</div>
      ) : (
        <>
          <div className="mx-auto flex max-w-lg gap-1 px-4 pt-3">
            {[
              { key: 'all', label: 'Alle' },
              { key: 'unanswered', label: 'Neu' },
              { key: 'wrong', label: 'Falsche' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => handleFilterChange(f.key)}
                className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition-colors ${
                  filter === f.key
                    ? `${subject.colorClass} text-white`
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {shuffledQuestions.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <p className="text-gray-500">
                {filter === 'wrong' ? 'Keine falsch beantworteten Fragen.' : 'Keine unbeantworteten Fragen.'}
              </p>
              <button onClick={() => handleFilterChange('all')} className="mt-3 text-sm font-medium text-blue-600">
                Alle Fragen anzeigen
              </button>
            </div>
          ) : question ? (
            <div className="mx-auto max-w-lg px-4 py-4">
              <p className="mb-1 text-xs text-gray-500">Frage {currentIndex + 1} / {shuffledQuestions.length}</p>

              {question.topic && (
                <p className="mb-2 text-xs text-gray-400 uppercase tracking-wide">{question.topic}</p>
              )}

              <h2 className="mb-5 text-base font-semibold leading-snug text-gray-900 dark:text-gray-100">
                {question.text}
              </h2>

              {question.options.map((opt, i) => {
                let cls = 'bg-white border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100'

                if (answered && i === question.correct) {
                  cls = 'bg-green-100 border-green-500 text-green-900 dark:bg-green-900 dark:text-green-100'
                } else if (answered && selected === i && i !== question.correct) {
                  cls = 'bg-red-100 border-red-500 text-red-900 dark:bg-red-900 dark:text-red-100'
                } else if (answered) {
                  cls = 'bg-gray-50 border-gray-200 text-gray-400 dark:bg-gray-900 dark:text-gray-600'
                } else if (selected === i) {
                  cls = 'bg-blue-50 border-blue-500 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={answered}
                    className={`flex w-full items-center gap-3 rounded-lg border-2 p-3 mb-2 text-left ${cls}`}
                  >
                    <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      answered && i === question.correct
                        ? 'bg-green-500 text-white'
                        : answered && selected === i
                        ? 'bg-red-500 text-white'
                        : selected === i
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {letters[i]}
                    </span>
                    <span className="text-sm">{opt}</span>
                    {answered && i === question.correct && (
                      <span className="ml-auto text-green-600 font-bold">✓</span>
                    )}
                    {answered && selected === i && i !== question.correct && (
                      <span className="ml-auto text-red-600 font-bold">✗</span>
                    )}
                  </button>
                )
              })}

              {answered && (
                <div className={`mt-4 rounded-lg border-2 p-4 ${
                  selected === question.correct
                    ? 'border-green-500 bg-green-50 dark:bg-green-950'
                    : 'border-red-500 bg-red-50 dark:bg-red-950'
                }`}>
                  <p className={`text-lg font-bold ${
                    selected === question.correct ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                  }`}>
                    {selected === question.correct ? '✓ Richtig!' : '✗ Falsch!'}
                  </p>
                  {selected !== question.correct && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      Richtige Antwort: {letters[question.correct]}
                    </p>
                  )}
                  {question.explanation && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{question.explanation}</p>
                  )}
                </div>
              )}

              {answered && (
                <button
                  onClick={handleNext}
                  className="mt-4 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white"
                >
                  {currentIndex + 1 < shuffledQuestions.length ? 'Nächste Frage →' : 'Abschließen ✓'}
                </button>
              )}
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}
