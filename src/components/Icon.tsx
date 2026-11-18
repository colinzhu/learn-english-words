import type { ReactNode, SVGProps } from 'react'

type IconName =
  | 'home'
  | 'book'
  | 'star'
  | 'volume'
  | 'mute'
  | 'arrow'
  | 'check'
  | 'close'
  | 'spark'
  | 'slow'
  | 'refresh'
  | 'trophy'
  | 'back'
  | 'lock'
  | 'bulb'
  | 'play'
  | 'headphone'
  | 'pencil'
  | 'eye'
  | 'flame'
  | 'menu'
  | 'search'
  | 'chat'

const PATHS: Record<IconName, ReactNode> = {
  home: (
    <>
      <path d="M3 10.8 12 3l9 7.8" />
      <path d="M5.5 9.4V20h13V9.4" />
      <path d="M9.5 20v-5.5h5V20" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5c3.2-1.2 6-1 8 1v14c-2-2-4.8-2.2-8-1Z" />
      <path d="M20 5.5c-3.2-1.2-6-1-8 1v14c2-2 4.8-2.2 8-1Z" />
    </>
  ),
  star: <path d="m12 2.8 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.6l6.5-.9Z" />,
  volume: (
    <>
      <path d="M4 9.5h4l5-4v13l-5-4H4Z" />
      <path d="M16 8.5c1.6 1.8 1.6 5.2 0 7" />
      <path d="M19 5.8c3.1 3.4 3.1 9 0 12.4" />
    </>
  ),
  mute: (
    <>
      <path d="M4 9.5h4l5-4v13l-5-4H4Z" />
      <path d="m16.5 9.5 5 5M21.5 9.5l-5 5" />
    </>
  ),
  arrow: (
    <>
      <path d="M4 12h15" />
      <path d="m14 7 5 5-5 5" />
    </>
  ),
  check: <path d="m4.5 12.5 5 5 10-11" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  spark: (
    <>
      <path d="M12 2.5c.5 5.5 3 8 8.5 8.5-5.5.5-8 3-8.5 8.5-.5-5.5-3-8-8.5-8.5 5.5-.5 8-3 8.5-8.5Z" />
      <path d="M19 16.5c.2 2 1.2 3 3.2 3.2-2 .2-3 1.2-3.2 3.2-.2-2-1.2-3-3.2-3.2 2-.2 3-1.2 3.2-3.2Z" />
    </>
  ),
  slow: (
    <>
      <circle cx="12" cy="13" r="7.5" />
      <path d="M12 13V9" />
      <path d="M12 13h3" />
      <path d="M8 3.8 5 6M16 3.8l3 2.2" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 11a8 8 0 1 0-2.3 6.2" />
      <path d="M20 4v7h-7" />
    </>
  ),
  trophy: (
    <>
      <path d="M7 4h10v5a5 5 0 0 1-10 0Z" />
      <path d="M7 6H3.8v1.5A4.5 4.5 0 0 0 8.3 12M17 6h3.2v1.5a4.5 4.5 0 0 1-4.5 4.5" />
      <path d="M12 14v4M8 21h8M9 18h6" />
    </>
  ),
  back: (
    <>
      <path d="M20 12H5" />
      <path d="m10 7-5 5 5 5" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10" width="14" height="10" rx="3" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  bulb: (
    <>
      <path d="M9 17.5c-.5-1.4-1.6-2.3-2.6-3.5A6 6 0 1 1 17.6 14c-1 1.2-2.1 2.1-2.6 3.5Z" />
      <path d="M9 17.5h6M10 21h4" />
    </>
  ),
  play: <path d="M8 5.5v13l10.5-6.5Z" />,
  headphone: (
    <>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect x="3" y="13" width="4" height="7" rx="2" />
      <rect x="17" y="13" width="4" height="7" rx="2" />
    </>
  ),
  pencil: (
    <>
      <path d="M4 20h4l11-11a2.8 2.8 0 0 0-4-4L4 16Z" />
      <path d="m13 6 4 4" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  flame: (
    <path d="M12 2.8c.6 3-1.5 4.4-2.8 6.2-1.4 1.9-2.3 3.8-1.3 6.1.7 1.6 2.2 2.7 4.1 2.7 2.6 0 4.5-1.8 4.5-4.4 0-3.1-2.5-4.8-4.5-10.6Z" />
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  chat: (
    <>
      <path d="M4 5.5h16v11H9l-5 4Z" />
      <path d="M8 9.5h8M8 12.5h5" />
    </>
  ),
}

export function Icon({
  name,
  size = 24,
  ...props
}: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={name === 'star' ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {PATHS[name]}
    </svg>
  )
}

export type { IconName }
