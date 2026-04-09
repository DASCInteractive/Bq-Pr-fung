import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Home from './pages/Home'
import SubjectOverview from './pages/SubjectOverview'
import LearningMode from './pages/LearningMode'
import ExamMode from './pages/ExamMode'
import ExamResult from './pages/ExamResult'
import Bookmarks from './pages/Bookmarks'
import Settings from './pages/Settings'

function NavBar() {
  const loc = useLocation()
  const tabs = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/merkliste', label: 'Merkliste', icon: '📌' },
    { to: '/einstellungen', label: 'Mehr', icon: '⚙️' },
  ]
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 z-50">
      {tabs.map((t) => (
        <Link
          key={t.to}
          to={t.to}
          className={`flex flex-col items-center text-xs ${
            loc.pathname === t.to ? 'text-blue-600' : 'text-gray-400'
          }`}
        >
          <span className="text-xl">{t.icon}</span>
          <span>{t.label}</span>
        </Link>
      ))}
    </nav>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fach/:subjectId" element={<SubjectOverview />} />
          <Route path="/lernen/:subjectId" element={<LearningMode />} />
          <Route path="/pruefung/:subjectId" element={<ExamMode />} />
          <Route path="/ergebnis/:subjectId" element={<ExamResult />} />
          <Route path="/merkliste" element={<Bookmarks />} />
          <Route path="/einstellungen" element={<Settings />} />
        </Routes>
        <NavBar />
      </AppProvider>
    </BrowserRouter>
  )
}
