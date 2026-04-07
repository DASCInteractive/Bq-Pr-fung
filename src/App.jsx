import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import SubjectOverview from './pages/SubjectOverview'
import LearningMode from './pages/LearningMode'
import ExamMode from './pages/ExamMode'
import ExamResult from './pages/ExamResult'
import Bookmarks from './pages/Bookmarks'
import Settings from './pages/Settings'

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
