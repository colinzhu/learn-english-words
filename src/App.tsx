import { useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { SoundProvider } from './audio/SoundProvider'
import { SiteShell } from './components/AppShell'
import { ProgressProvider } from './progress/ProgressProvider'
import { AdventureScreen } from './features/adventure/AdventureScreen'
import { HomeScreen } from './features/home/HomeScreen'
import { PhrasesScreen } from './features/phrases/PhrasesScreen'
import { ProgressScreen } from './features/progress/ProgressScreen'
import { WordBookScreen } from './features/wordbook/WordBookScreen'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function NotFound() {
  return (
    <div className="not-found">
      <span className="not-found__icon" aria-hidden="true">🪐</span>
      <h1>这个星球还没被发现</h1>
      <p>回到探险地图，继续收集单词吧。</p>
      <a className="btn btn--primary" href="#/">
        回到首页
      </a>
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <SoundProvider>
        <ProgressProvider>
          <ScrollToTop />
          <Routes>
            <Route
              path="/"
              element={
                <SiteShell>
                  <HomeScreen />
                </SiteShell>
              }
            />
            <Route
              path="/wordbook"
              element={
                <SiteShell>
                  <WordBookScreen />
                </SiteShell>
              }
            />
            <Route
              path="/phrases"
              element={
                <SiteShell>
                  <PhrasesScreen />
                </SiteShell>
              }
            />
            <Route
              path="/progress"
              element={
                <SiteShell>
                  <ProgressScreen />
                </SiteShell>
              }
            />
            <Route path="/adventure/:packId" element={<AdventureScreen />} />
            <Route path="/adventure" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ProgressProvider>
      </SoundProvider>
    </HashRouter>
  )
}
