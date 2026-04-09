import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { subjects } from '../lib/subjects'

export default function Home() {
  const { getSubjectProgress } = useApp()

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-blue-600 text-white px-4 py-6 text-center">
        <h1 className="text-xl font-bold">BQ Prüfung</h1>
        <p className="text-sm opacity-80 mt-1">Industriemeister Basisqualifikation</p>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-3">
        {subjects.map((s) => {
          const p = getSubjectProgress(s.id)
          const pct = s.questionCount > 0 ? Math.round((p.correct / s.questionCount) * 100) : 0
          return (
            <Link
              key={s.id}
              to={`/fach/${s.id}`}
              className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{s.name}</h3>
                  <p className="text-xs text-gray-500">{s.questionCount} Fragen · {pct}% richtig</p>
                </div>
              </div>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${s.colorClass} rounded-full`} style={{ width: `${pct}%` }} />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
