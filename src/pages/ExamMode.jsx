import { useState, useMemo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSubject } from '../lib/subjects'
import { useQuestions } from '../hooks/useQuestions'
import { useExamTimer } from '../hooks/useExamTimer'
import { useApp } from '../context/AppContext'
import { shuffle } from '../lib/utils'
import Header from '../components/Header'
import Timer from '../components/Timer'
import AnswerOption from '../components/AnswerOption'

const EXAM_MINUTES = 45

export default function ExamMode() {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  const subject = getSubject(subjectId)
  const { questions, loading } = useQuestions(subjectId)
  const { addExamResult } = useApp()
  const [started, setStarted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)

  const examQuestions = useMemo(() => {
    if (!questions) return []
    const count = Math.min(questions.length, 30)
    return shuffle(questions).slice(0, count)
  }, [questions])

  const finishExam = useCallback(() => {
    const score = examQuestions.reduce((acc, q, i) => {
      return acc + (answers[i] === q.correct ? 1 : 0)
    }, 0)
    addExamResult({
      subject: subjectId,
      date: new Date().toISOString(),
      score,
      total: examQuestions.length,
      duration: timer.elapsed,
      answers: examQuestions.map((q, i) => ({
        questionId: q.id,
        selected: answers[i] ?? null,
        correct: q.correct,
      })),
    })
    navigate(`/ergebnis/${subjectId}`, { replace: true })
  }, [answers, examQuestions, subjectId, addExamResult, navigate])

  const timer = useExamTimer(EXAM_MINUTES, finishExam)

  if (!subject) return <div className="p-8 text-center text-gray-500">Fach nicht gefunden</div>

  if (loading) return <div className="py-12 text-center text-gray-400">Laden...</div>

  if (examQuestions.length === 0) {
    return (
      <div className="min-h-screen pb-20">
        <Header title={`${subject.shortName} – Prüfung`} showBack />
        <div className="px-4 py-12 text-center">
          <span className="text-4xl">📭</span>
          <p className="mt-3 text-gray-500">Keine Fragen verfügbar</p>
        </div>
      </div>
    )
  }

  if (!started) {
    return (
      <div className="min-h-screen pb-20">
        <Header title={`${subject.shortName} – Prüfung`} showBack />
        <div className="mx-auto max-w-lg px-4 py-8 text-center">
          <span className="text-5xl">{subject.icon}</span>
          <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100">Prüfungssimulation</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {examQuestions.length} Fragen in {EXAM_MINUTES} Minuten
          </p>
          <ul className="mt-6 space-y-2 text-left text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-center gap-2">
              <span className="text-blue-600">•</span> Zufällige Auswahl aus allen Themen
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-600">•</span> Timer läuft nach Start automatisch
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-600">•</span> Du kannst zwischen Fragen navigieren
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-600">•</span> Auswertung am Ende
            </li>
          </ul>
          <button
            onClick={() => { setStarted(true); timer.start() }}
            className={`mt-8 w-full rounded-lg ${subject.colorClass} py-3 text-sm font-semibold text-white active:opacity-90`}
          >
            Prüfung starten
          </button>
        </div>
      </div>
    )
  }

  const question = examQuestions[currentIndex]
  const answeredCount = Object.keys(answers).length

  return (
    <div className="min-h-screen pb-20">
      {/* Exam header with timer */}
      <header className="sticky top-0 z-30 bg-blue-700 text-white shadow-md">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <span className="text-sm font-medium">
            {currentIndex + 1} / {examQuestions.length}
          </span>
          <Timer remaining={timer.remaining} total={EXAM_MINUTES * 60} />
        </div>
      </header>

      {/* Question navigation dots */}
      <div className="mx-auto max-w-lg overflow-x-auto px-4 pt-3">
        <div className="flex gap-1.5">
          {examQuestions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-7 w-7 flex-shrink-0 rounded-full text-xs font-medium transition-colors ${
                i === currentIndex
                  ? 'bg-blue-600 text-white'
                  : answers[i] !== undefined
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="mx-auto max-w-lg px-4 py-4">
        {question.topic && (
          <p className="mb-2 text-xs font-medium text-gray-400">{question.topic}</p>
        )}
        <h2 className="mb-5 text-base font-semibold leading-snug text-gray-900">{question.text}</h2>

        <div className="space-y-2">
          {question.options.map((opt, i) => (
            <AnswerOption
              key={i}
              index={i}
              text={opt}
              selected={answers[currentIndex] ?? null}
              correct={-1}
              revealed={false}
              onSelect={(idx) => setAnswers((prev) => ({ ...prev, [currentIndex]: idx }))}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-5 flex gap-3">
          <button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="flex-1 rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-700 disabled:opacity-30"
          >
            Zurück
          </button>
          {currentIndex < examQuestions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex((i) => i + 1)}
              className="flex-1 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white active:bg-blue-700"
            >
              Weiter
            </button>
          ) : (
            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="flex-1 rounded-lg bg-emerald-600 py-3 text-sm font-semibold text-white active:bg-emerald-700"
            >
              Abgeben ({answeredCount}/{examQuestions.length})
            </button>
          )}
        </div>

        {/* Submit confirmation modal */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Prüfung abgeben?</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Du hast {answeredCount} von {examQuestions.length} Fragen beantwortet.
                {answeredCount < examQuestions.length && (
                  <span className="mt-1 block text-amber-600 font-medium">
                    {examQuestions.length - answeredCount} Fragen sind noch offen!
                  </span>
                )}
              </p>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700"
                >
                  Weiter lernen
                </button>
                <button
                  onClick={finishExam}
                  className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white"
                >
                  Jetzt abgeben
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
