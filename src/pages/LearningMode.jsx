import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSubject } from '../lib/subjects'
import { useQuestions } from '../hooks/useQuestions'
import { useApp } from '../context/AppContext'
import { shuffle } from '../lib/utils'
import Header from '../components/Header'
import QuestionCard from '../components/QuestionCard'

export default function LearningMode() {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  const subject = getSubject(subjectId)
  const { questions, loading } = useQuestions(subjectId)
  const { progress } = useApp()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [filter, setFilter] = useState('all')
  const [shuffledQuestions, setShuffledQuestions] = useState([])

  // Only re-shuffle when filter or questions change, NOT on every progress update
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, filter])

  if (!subject) return <div className="p-8 text-center text-gray-500">Fach nicht gefunden</div>

  const handleNext = () => {
    if (currentIndex + 1 >= shuffledQuestions.length) {
      navigate(`/fach/${subjectId}`)
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
  }

  return (
    <div className="min-h-screen pb-20">
      <Header title={`${subject.shortName} \u2013 Lernen`} showBack />

      {loading ? (
        <div className="py-12 text-center text-gray-400">Laden...</div>
      ) : (
        <>
          {/* Filter tabs */}
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
              <button
                onClick={() => handleFilterChange('all')}
                className="mt-3 text-sm font-medium text-blue-600"
              >
                Alle Fragen anzeigen
              </button>
            </div>
          ) : (
            <QuestionCard
              key={shuffledQuestions[currentIndex].id}
              question={shuffledQuestions[currentIndex]}
              index={currentIndex}
              total={shuffledQuestions.length}
              onNext={handleNext}
              subjectColor={subject.colorClass}
            />
          )}
        </>
      )}
    </div>
  )
}
