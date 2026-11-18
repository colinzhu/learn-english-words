import { useEffect, useRef, useState } from 'react'
import { useSound } from '../audio/SoundProvider'
import { Icon } from './Icon'

export function AudioButton({
  text,
  slow = false,
  label,
  className = '',
  variant = 'primary',
}: {
  text: string
  slow?: boolean
  label?: string
  className?: string
  variant?: 'primary' | 'soft' | 'icon'
}) {
  const { speakWord, speechSupported } = useSound()
  const [playing, setPlaying] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current)
    },
    [],
  )

  const handleClick = () => {
    const started = speakWord(text, slow)
    if (!started) return
    setPlaying(true)
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setPlaying(false), slow ? 1800 : 1000)
  }

  const title = speechSupported ? `朗读 ${text}` : '当前浏览器不支持英文朗读'

  if (variant === 'icon') {
    return (
      <button
        type="button"
        className={`icon-audio ${playing ? 'is-playing' : ''} ${className}`}
        onClick={handleClick}
        aria-label={title}
        title={title}
        disabled={!speechSupported}
      >
        <Icon name="volume" size={22} />
      </button>
    )
  }

  return (
    <button
      type="button"
      className={`audio-button audio-button--${variant} ${playing ? 'is-playing' : ''} ${className}`}
      onClick={handleClick}
      title={title}
      disabled={!speechSupported}
      aria-label={label ? `${label}：${title}` : title}
    >
      <span className="audio-button__icon">
        {slow ? <Icon name="slow" size={21} /> : <Icon name="volume" size={22} />}
      </span>
      <span className="audio-button__label">
        {label ?? (slow ? '慢速听' : '听发音')}
      </span>
      <span className="sound-bars" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    </button>
  )
}
