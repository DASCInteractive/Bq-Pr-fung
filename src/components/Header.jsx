import { useNavigate, useLocation } from 'react-router-dom'

export default function Header({ title, showBack = false }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <header className="sticky top-0 z-30 bg-blue-700 text-white shadow-md">
      <div className="mx-auto flex max-w-lg items-center px-4 py-3">
        {showBack && location.key !== 'default' && (
          <button
            onClick={() => navigate(-1)}
            className="mr-3 flex h-8 w-8 items-center justify-center rounded-full hover:bg-blue-600 active:bg-blue-800"
            aria-label="Zurück"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <h1 className="truncate text-lg font-semibold">{title}</h1>
      </div>
    </header>
  )
}
