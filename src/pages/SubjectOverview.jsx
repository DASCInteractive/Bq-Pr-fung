import { useParams, Link } from 'react-router-dom'
import { getSubject } from '../lib/subjects'
import { useQuestions } from '../hooks/useQuestions'
import { useSubjectStats } from '../hooks/useProgress'
import { useApp } from '../context/AppContext'
import Header from '../components/Header'
import ProgressBar from '../components/ProgressBar'

export default function SubjectOverview() {
  const { subjectId } = useParams()
  const subject = getSubject(subjectId)
  const { questions, loading } = useQuestions(subjectId)
  const stats = useSubjectStats(subjectId, questions)
  const { examHistory } = useApp()

  if (!subject) return <div className="p-8 text-center text-gray-500">Fach nicht gefunden</div>

  const subjectExams = examHistory.filter((e) => e.subject === subjectId)
  const lastExam = subjectExams[0]

  // Group by topic
  const topicMap = {}
  if (questions) {
    for (const q of questions) {
      if (!topicMap[q.topic]) topicMap[q.topic] = { total: 0, correct: 0 }
      topicMap[q.topic].total++
    }
  }

  return (
    <div className="min-h-screen pb-20">
      <Header title={subject.name} showBack />

      <div className="mx-auto max-w-lg px-4 py-5">
        {loading ? (
          <div className="py-12 text-center text-gray-400">Laden...</div>
        ) : (
          <>
            {/* Stats card */}
            <div className={`rounded-xl ${subject.colorClassLight} p-5`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{subject.icon}</span>
                <div>
                  <p className={`text-2xl font-bold ${subject.textClass}`}>{stats.percent}%</p>
                  <p className="text-xs text-gray-600">
                    {stats.correct} von {stats.total > 0 ? stats.total : subject.questionCount} richtig
                  </p>
                </div>
              </div>
              <ProgressBar value={stats.correct} max={subject.questionCount} colorClass={subject.colorClass} className="mt-4" />

              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-lg font-bold text-gray-900">{stats.answered}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Bearbeitet</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{stats.correct}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Richtig</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{stats.answered - stats.correct}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Falsch</p>
                </div>
              </div>
            </div>

            {/* Mode selection */}
            <div className="mt-6 space-y-3">
              <Link
                to={`/lernen/${subjectId}`}
                className={`flex items-center justify-between rounded-xl bg-white dark:bg-gray-900 p-4 shadow-sm border-l-4 ${subject.borderClass} active:shadow-md transition-shadow`}
              >
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Lernmodus</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Alle Fragen durcharbeiten mit Erklärungen</p>
                </div>
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                to={`/pruefung/${subjectId}`}
                className={`flex items-center justify-between rounded-xl bg-white dark:bg-gray-900 p-4 shadow-sm border-l-4 ${subject.borderClass} active:shadow-md transition-shadow`}
              >
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Prüfungssimulation</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">30 Fragen in 45 Minuten – wie in der echten Prüfung</p>
                </div>
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Last exam result */}
            {lastExam && (
              <div className="mt-6">
                <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">Letzte Prüfung</h3>
                <div className="rounded-lg bg-white dark:bg-gray-900 p-4 shadow-sm">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{new Date(lastExam.date).toLocaleDateString('de-DE')}</span>
                    <span className={`font-bold ${lastExam.score / lastExam.total >= 0.5 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {lastExam.score} / {lastExam.total}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Topics */}
            {Object.keys(topicMap).length > 0 && (
              <div className="mt-6">
                <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">Themen</h3>
                <div className="space-y-1">
                  {Object.entries(topicMap).map(([topic, data]) => (
                    <div key={topic} className="flex items-center justify-between rounded-lg bg-white dark:bg-gray-900 px-3 py-2">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{topic}</span>
                      <span className="text-xs text-gray-400">{data.total} Fragen</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
