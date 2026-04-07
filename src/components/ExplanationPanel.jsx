export default function ExplanationPanel({ explanation, correct }) {
  return (
    <div
      className={`mt-4 rounded-lg border p-4 ${
        correct ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'
      }`}
    >
      <div className="mb-1 flex items-center gap-2">
        <span className="text-lg">{correct ? '✓' : '✗'}</span>
        <span className={`text-sm font-semibold ${correct ? 'text-emerald-700' : 'text-red-700'}`}>
          {correct ? 'Richtig!' : 'Falsch!'}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-gray-700">{explanation}</p>
    </div>
  )
}
