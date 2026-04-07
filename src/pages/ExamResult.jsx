import { useParams, Link } from 'react-router-dom'
import { getSubject } from '../lib/subjects'
import { useApp } from '../context/AppContext'
import { formatTime, percent } from '../lib/utils'
import Header from '../components/Header'

export default function ExamResult() {
  const { subjectId } = useParams()
  const subject = getSubject(subjectId)
  const { examHistory } = useApp()

  const lastExam = examHistory.find((e) => e.subject === subjectId)

  if (!subject || !lastExam) {
    return (
      <div className="min-h-screen pb-20">
        <Header title="Ergebnis" showBack />
        <div className="p-8 text-center text-gray-500">Kein Ergebnis vorhanden</div>
      </div>
    )
  }

  const pct = percent(lastExam.score, lastExam.total)
  const passed = pct >= 50

  return (
    <div className="min-h-screen pb-20">
      <Header title={`${subject.shortName} – Ergebnis`} showBack />

      <div className="mx-auto max-w-lg px-4 py-6">
        {/* Result card */}
        <div className={`rounded-2xl p-6 text-center ${passed ? 'bg-emerald-50 dark:bg-emerald-950' : 'bg-red-50 dark:bg-red-950'}`}>
          <span className="text-5xl">{passed ? '🎉' : '📚'}</span>
          <h2 className={`mt-3 text-2xl font-bold ${passed ? 'text-emerald-700' : 'text-red-700'}`}>
            {passed ? 'Bestanden!' : 'Nicht bestanden'}
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {passed ? 'Gut gemacht! Weiter so.' : 'Übung macht den Meister.'}
          </p>

          <div className="mt-6 flex justify-center gap-8">
            <div>
              <p className={`text-3xl font-bold ${passed ? 'text-emerald-600' : 'text-red-600'}`}>{pct}%</p>
              <p className="text-xs text-gray-500">Ergebnis</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {lastExam.score}/{lastExam.total}
              </p>
              <p className="text-xs text-gray-500">Richtig</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{formatTime(lastExam.duration)}</p>
              <p className="text-xs text-gray-500">Zeit</p>
            </div>
          </div>
        </div>

        {/* Answer breakdown */}
        {lastExam.answers && (
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wide">Auswertung</h3>
            <div className="space-y-1">
              {lastExam.answers.map((a, i) => {
                const isCorrect = a.selected === a.correct
                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                      isCorrect ? 'bg-emerald-50 dark:bg-emerald-950' : a.selected === null ? 'bg-gray-50 dark:bg-gray-900' : 'bg-red-50 dark:bg-red-950'
                    }`}
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">Frage {i + 1}</span>
                    <span className={`text-xs font-medium ${isCorrect ? 'text-emerald-600' : a.selected === null ? 'text-gray-400' : 'text-red-600'}`}>
                      {isCorrect ? 'Richtig' : a.selected === null ? 'Keine Antwort' : 'Falsch'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 space-y-3">
          <Link
            to={`/pruefung/${subjectId}`}
            className={`block w-full rounded-lg ${subject.colorClass} py-3 text-center text-sm font-semibold text-white`}
          >
            Erneut versuchen
          </Link>
          <Link
            to={`/fach/${subjectId}`}
            className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Zurück zum Fach
          </Link>
        </div>
      </div>
    </div>
  )
}
