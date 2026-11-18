import { Icon } from './Icon'

export function Mascot({
  className,
  mood = 'happy',
}: {
  className?: string
  mood?: 'happy' | 'wink' | 'cheer'
}) {
  return (
    <svg
      viewBox="0 0 220 220"
      className={className}
      role="img"
      aria-label="单词星球小向导豆豆"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none" stroke="#24304a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M109 48c-1-16 7-25 18-28" />
        <path d="M129 15c8-6 17-2 17 6 0 8-8 12-16 8" fill="#ffcf4d" />
        <path d="M64 176c-14 9-25 5-27-4" />
        <path d="M156 176c14 9 25 5 27-4" />
        <path d="M47 137c-7 2-11 8-10 14" />
        <path d="M173 137c7 2 11 8 10 14" />
      </g>
      <ellipse cx="110" cy="116" rx="67" ry="64" fill="#7c5cfc" stroke="#24304a" strokeWidth="6" />
      <path
        d="M46 119c10 45 44 64 64 64 26 0 56-17 64-61-24 10-45 14-64 14s-42-5-64-17Z"
        fill="#9b83ff"
        opacity="0.72"
      />
      <ellipse cx="110" cy="128" rx="43" ry="35" fill="#efe9ff" stroke="#24304a" strokeWidth="4" />
      <g>
        <ellipse cx="91" cy="111" rx="12" ry="14" fill="#fffdf7" stroke="#24304a" strokeWidth="4" />
        <ellipse cx="129" cy="111" rx="12" ry="14" fill="#fffdf7" stroke="#24304a" strokeWidth="4" />
        {mood === 'wink' ? (
          <path d="M82 111c6-6 12-6 18 0" fill="none" stroke="#24304a" strokeWidth="4" strokeLinecap="round" />
        ) : (
          <circle cx="94" cy="114" r="5.5" fill="#24304a" />
        )}
        <circle cx="132" cy="114" r="5.5" fill="#24304a" />
        <circle cx="96" cy="112" r="1.7" fill="#fff" />
        <circle cx="134" cy="112" r="1.7" fill="#fff" />
      </g>
      <ellipse cx="78" cy="137" rx="12" ry="7" fill="#ff9db6" opacity="0.7" />
      <ellipse cx="142" cy="137" rx="12" ry="7" fill="#ff9db6" opacity="0.7" />
      {mood === 'cheer' ? (
        <path d="M93 144c8 14 26 14 34 0Z" fill="#ff7a66" stroke="#24304a" strokeWidth="4" strokeLinejoin="round" />
      ) : (
        <path d="M94 145c7 10 25 10 32 0" fill="none" stroke="#24304a" strokeWidth="4" strokeLinecap="round" />
      )}
      <path d="M76 167c4 16 11 27 20 34M144 167c-4 16-11 27-20 34" fill="none" stroke="#24304a" strokeWidth="7" strokeLinecap="round" />
      <path d="M77 166c6 12 14 14 23 5M143 166c-6 12-14 14-23 5" fill="#ffcf4d" stroke="#24304a" strokeWidth="4" strokeLinejoin="round" />
      <g stroke="#24304a" strokeWidth="3.5" fill="#ffcf4d">
        <path d="M34 76c.4 5 2.6 7.2 7.6 7.6-5 .4-7.2 2.6-7.6 7.6-.4-5-2.6-7.2-7.6-7.6 5-.4 7.2-2.6 7.6-7.6Z" />
        <path d="M184 94c.3 4 2.1 5.8 6.1 6.1-4 .3-5.8 2.1-6.1 6.1-.3-4-2.1-5.8-6.1-6.1 4-.3 5.8-2.1 6.1-6.1Z" />
      </g>
      <path d="M181 49v10M176 54h10" fill="none" stroke="#ff7a66" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

export function MiniMascot({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="33" r="24" fill="#7c5cfc" stroke="#24304a" strokeWidth="3.5" />
      <path d="M32 9c0-5 3-7 6-8" fill="none" stroke="#24304a" strokeWidth="3" strokeLinecap="round" />
      <circle cx="40" cy="4" r="4" fill="#ffcf4d" stroke="#24304a" strokeWidth="2.5" />
      <ellipse cx="24" cy="31" rx="5" ry="6" fill="#fffdf7" />
      <ellipse cx="40" cy="31" rx="5" ry="6" fill="#fffdf7" />
      <circle cx="25" cy="32" r="2.5" fill="#24304a" />
      <circle cx="41" cy="32" r="2.5" fill="#24304a" />
      <path d="M26 43c4 5 8 5 12 0" fill="none" stroke="#24304a" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="16" cy="38" r="3" fill="#ff9db6" opacity="0.7" />
      <circle cx="48" cy="38" r="3" fill="#ff9db6" opacity="0.7" />
    </svg>
  )
}

export function WordPlanetLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="logo-lockup">
      <span className="logo-planet" aria-hidden="true">
        <svg viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="19" fill="#7c5cfc" stroke="#24304a" strokeWidth="4" />
          <path d="M12 28c10-8 31-9 41 2" fill="none" stroke="#ffcf4d" strokeWidth="6" strokeLinecap="round" />
          <circle cx="26" cy="31" r="3" fill="#24304a" />
          <circle cx="38" cy="31" r="3" fill="#24304a" />
          <path d="M26 39c4 4 8 4 12 0" fill="none" stroke="#24304a" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="51" cy="18" r="4" fill="#ff7a66" stroke="#24304a" strokeWidth="2.5" />
        </svg>
      </span>
      <span className={`logo-text${compact ? ' logo-text--compact' : ''}`}>
        <strong>单词星球</strong>
        {!compact && <small>Word Planet</small>}
      </span>
    </span>
  )
}

export function StarBadge({ count }: { count: number }) {
  return (
    <span className="star-badge" aria-label={`已获得 ${count} 颗星星`}>
      <Icon name="star" size={19} />
      <span>{count}</span>
    </span>
  )
}
