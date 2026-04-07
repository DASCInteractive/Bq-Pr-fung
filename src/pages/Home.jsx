import { useApp } from '../context/AppContext'
import { subjects } from '../lib/subjects'
import { percent } from '../lib/utils'
import Header from '../components/Header'
import SubjectCard from '../components/SubjectCard'

export default function Home() {
  const { getSubjectProgress } = useApp()

  const totalQuestions = subjects.reduce((sum, s) => sum + s.questionCount, 0)
  const totalCorrect = subjects.reduce((sum, s) => sum + getSubjectProgress(s.id).correct, 0)
  const pct = percent(totalCorrect, totalQuestions)

  return (
    <div className="min-h-screen pb-20">
      <Header title="BQ Prüfung" />

      <div className="mx-auto max-w-lg px-4 py-5">
        {/* Overall progress */}
        <div className="mb-6 rounded-xl bg-blue-700 p-5 text-white shadow-lg">
          <p className="text-sm font-medium opacity-80">Gesamtfortschritt</p>
          <div className="mt-1 flex items-end justify-between">
            <span className="text-3xl font-bold">{pct}%</span>
            <span className="text-sm opacity-70">{totalCorrect} / {totalQuestions}</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-blue-900">
            <div
              className="h-full rounded-full bg-white transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Subject cards */}
        <h2 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wide">Fächer</h2>
        <div className="space-y-3">
          {subjects.map((s) => (
            <SubjectCard key={s.id} subject={s} />
          ))}
        </div>
      </div>
    </div>
  )
}
