const letters = ['A', 'B', 'C', 'D']

export default function AnswerOption({ index, text, selected, correct, revealed, onSelect }) {
  let bg = 'bg-white border-gray-200'
  let animation = ''

  if (revealed) {
    if (index === correct) {
      bg = 'bg-emerald-50 border-emerald-500 text-emerald-900'
      animation = selected === index ? 'animate-correct' : ''
    } else if (selected === index) {
      bg = 'bg-red-50 border-red-500 text-red-900'
      animation = 'animate-wrong'
    } else {
      bg = 'bg-gray-50 border-gray-200 text-gray-400'
    }
  } else if (selected === index) {
    bg = 'bg-blue-50 border-blue-500'
  }

  return (
    <button
      onClick={() => !revealed && onSelect(index)}
      disabled={revealed}
      className={`flex w-full items-start gap-3 rounded-lg border-2 p-3 text-left transition-colors ${bg} ${animation}`}
    >
      <span
        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          revealed && index === correct
            ? 'bg-emerald-500 text-white'
            : selected === index
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        {letters[index]}
      </span>
      <span className="pt-0.5 text-sm leading-snug">{text}</span>
    </button>
  )
}
