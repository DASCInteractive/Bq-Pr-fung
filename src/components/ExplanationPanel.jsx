export default function ExplanationPanel({ explanation, correct }) {
  return (
    <div
      className={`mt-4 rounded-lg border p-4 ${
        correct
          ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950'
          : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
      }`}
    >
      <div className="mb-1 flex items-center gap-2">
        <span className="text-lg">{correct ? '\u2713' : '\u2717'}</span>
        <span className={`text-sm font-semibold ${correct ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
          {correct ? 'Richtig!' : 'Falsch!'}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{explanation}</p>
    </div>
  )
}
