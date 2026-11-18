import type { CSSProperties, ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { useSound } from '../audio/SoundProvider'
import { WORD_PACKS } from '../data/packs'
import { useProgress } from '../progress/ProgressProvider'
import { getOverallStats } from '../progress/model'
import { Icon } from './Icon'
import { MiniMascot, StarBadge, WordPlanetLogo } from './Mascot'

export function ProgressBar({
  value,
  max,
  color,
  className,
  label,
}: {
  value: number
  max: number
  color?: string
  className?: string
  label?: string
}) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div
      className={`progress-track ${className ?? ''}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-label={label}
      style={color ? ({ '--bar-color': color } as CSSProperties) : undefined}
    >
      <span className="progress-fill" style={{ width: `${percent}%` }} />
    </div>
  )
}

export function SiteHeader() {
  const { progress } = useProgress()
  const { muted, toggleMuted, speechSupported } = useSound()
  const stats = getOverallStats(progress, WORD_PACKS)

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <NavLink to="/" className="brand-link" aria-label="单词星球首页">
          <WordPlanetLogo />
        </NavLink>

        <nav className="desktop-nav" aria-label="主导航">
          <NavLink to="/" end className={({ isActive }) => `desktop-nav__link${isActive ? ' is-active' : ''}`}>
            探险地图
          </NavLink>
          <NavLink
            to="/wordbook"
            className={({ isActive }) => `desktop-nav__link${isActive ? ' is-active' : ''}`}
          >
            单词图鉴
          </NavLink>
          <NavLink
            to="/phrases"
            className={({ isActive }) => `desktop-nav__link${isActive ? ' is-active' : ''}`}
          >
            句型卡
          </NavLink>
          <NavLink
            to="/progress"
            className={({ isActive }) => `desktop-nav__link${isActive ? ' is-active' : ''}`}
          >
            我的星星
          </NavLink>
        </nav>

        <div className="header-tools">
          <StarBadge count={stats.earnedStars} />
          <button
            type="button"
            className="round-tool"
            onClick={toggleMuted}
            aria-pressed={muted}
            aria-label={muted ? '打开声音' : '关闭声音'}
            title={muted ? '打开声音' : '关闭声音'}
          >
            <Icon name={muted ? 'mute' : 'volume'} size={21} />
          </button>
          {!speechSupported && (
            <span className="speech-warning" title="当前浏览器不支持语音朗读，建议使用 Chrome、Edge 或 Safari">
              语音不可用
            </span>
          )}
        </div>
      </div>
      <div className="header-mascot" aria-hidden="true">
        <MiniMascot />
      </div>
    </header>
  )
}

const BOTTOM_ITEMS = [
  { to: '/', label: '探险', icon: 'home' as const },
  { to: '/wordbook', label: '图鉴', icon: 'book' as const },
  { to: '/phrases', label: '句型', icon: 'chat' as const },
  { to: '/progress', label: '星星罐', icon: 'star' as const },
]

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="底部导航">
      {BOTTOM_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) => `bottom-nav__item${isActive ? ' is-active' : ''}`}
        >
          <span className="bottom-nav__icon">
            <Icon name={item.icon} size={23} />
          </span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="site-main">{children}</main>
      <footer className="site-footer">
        <span>用眼睛看 · 用耳朵听 · 用小手拼</span>
        <span className="site-footer__dot" aria-hidden="true">·</span>
        <span>单词星球 MVP</span>
      </footer>
      <BottomNav />
    </div>
  )
}
