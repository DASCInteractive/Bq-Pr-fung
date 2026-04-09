import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { getSubject } from '../lib/subjects'

export default function ExamResult() {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const subject = getSubject(subjectId)

  const score = parseInt(searchParams.get('score') || '0')
  const total = parseInt(searchParams.get('total') || '30')
  const pct = total > 0 ? Math.round((score / total) * 100) : 0
  const passed = pct >= 50

  if (!subject) return <p className="p-8 text-center">Fach nicht gefunden</p>

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-blue-600 text-white px-4 py-4 text-center">
        <h1 className="text-lg font-bold">{subject.shortName} – Ergebnis</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8 text-center">
        <span className="text-6xl">{passed ? '🎉' : '📚'}</span>
        <h2 className={`mt-4 text-3xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
          {pct}%
        </h2>
        <p className="text-gray-600 mt-2">{score} von {total} richtig</p>
        <p className={`mt-2 font-semibold ${passed ? 'text-green-600' : 'text-red-600'}`}>
          {passed ? 'Bestanden!' : 'Nicht bestanden'}
        </p>

        <div className="mt-8 space-y-3">
          <button
            onClick={() => navigate(`/pruefung/${subjectId}`)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-sm"
          >
            Nochmal versuchen
          </button>
          <button
            onClick={() => navigate(`/fach/${subjectId}`)}
            className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold text-sm"
          >
            Zurück zum Fach
          </button>
        </div>
      </div>
    </div>
  )
}
