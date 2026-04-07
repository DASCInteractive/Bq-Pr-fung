export default function ProgressBar({ value, max, colorClass = 'bg-blue-600', className = '' }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0

  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
