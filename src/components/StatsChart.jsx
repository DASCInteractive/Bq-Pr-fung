export default function StatsChart({ data }) {
  if (!data || data.length === 0) return null

  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="flex items-end gap-1.5" style={{ height: 100 }}>
      {data.map((d, i) => {
        const h = Math.max((d.value / max) * 100, 4)
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={`w-full rounded-t ${d.colorClass || 'bg-blue-500'} transition-all duration-500`}
              style={{ height: `${h}%` }}
            />
            <span className="text-[10px] text-gray-500">{d.label}</span>
          </div>
        )
      })}
    </div>
  )
}
