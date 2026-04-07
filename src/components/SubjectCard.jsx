import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import ProgressBar from './ProgressBar'

export default function SubjectCard({ subject }) {
  const { getSubjectProgress } = useApp()
  const { total, correct } = getSubjectProgress(subject.id)
  const pct = subject.questionCount > 0 ? Math.round((correct / subject.questionCount) * 100) : 0

  return (
    <Link
      to={`/fach/${subject.id}`}
      className={`block rounded-xl border-l-4 ${subject.borderClass} bg-white p-4 shadow-sm active:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">{subject.icon}</span>
            <span className={`text-xs font-bold ${subject.textClass}`}>{subject.shortName}</span>
          </div>
          <h3 className="mt-1 text-sm font-medium text-gray-900">{subject.name}</h3>
          <p className="mt-1 text-xs text-gray-500">
            {correct} / {subject.questionCount} richtig
          </p>
        </div>
        <span className={`text-lg font-bold ${subject.textClass}`}>{pct}%</span>
      </div>
      <ProgressBar value={correct} max={subject.questionCount} colorClass={subject.colorClass} className="mt-3" />
    </Link>
  )
}
