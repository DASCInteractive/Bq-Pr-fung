import { useParams, Link, useNavigate } from 'react-router-dom'
import { getSubject } from '../lib/subjects'
import { useApp } from '../context/AppContext'

export default function SubjectOverview() {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  const subject = getSubject(subjectId)
  const { getSubjectProgress } = useApp()

  if (!subject) return <div className="p-8 text-center text-gray-500">Fach nicht gefunden</div>

  const p = getSubjectProgress(subjectId)
  const pct = subject.questionCount > 0 ? Math.round((p.correct / subject.questionCount) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-blue-600 text-white px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate('/')} className="text-white text-lg">←</button>
        <h1 className="text-lg font-bold">{subject.name}</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <div className="bg-white rounded-xl p-5 shadow-sm text-center">
          <span className="text-4xl">{subject.icon}</span>
          <p className="mt-2 text-2xl font-bold text-gray-900">{pct}%</p>
          <p className="text-sm text-gray-500">{p.correct} von {subject.questionCount} richtig</p>
        </div>

        <Link
          to={`/lernen/${subjectId}`}
          className="block bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500"
        >
          <h3 className="font-semibold text-gray-900">📖 Lernmodus</h3>
          <p className="text-xs text-gray-500 mt-1">Alle Fragen mit Erklärungen durcharbeiten</p>
        </Link>

        <Link
          to={`/pruefung/${subjectId}`}
          className="block bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500"
        >
          <h3 className="font-semibold text-gray-900">📝 Prüfungssimulation</h3>
          <p className="text-xs text-gray-500 mt-1">30 Fragen in 45 Minuten</p>
        </Link>
      </div>
    </div>
  )
}
