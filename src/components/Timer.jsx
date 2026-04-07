import { formatTime } from '../lib/utils'

export default function Timer({ remaining, total }) {
  const pct = total > 0 ? (remaining / total) * 100 : 100
  const urgent = pct < 20

  return (
    <div className="flex items-center gap-2">
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className={`text-sm font-mono font-semibold ${urgent ? 'text-red-500' : 'text-white'}`}>
        {formatTime(remaining)}
      </span>
    </div>
  )
}
