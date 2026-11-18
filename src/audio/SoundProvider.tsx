import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  playCorrect,
  playStar,
  playTap,
  playWin,
  playWrong,
  setSfxMuted,
  unlockAudio,
} from './sfx'
import { primeSpeech, speak, speechSupported, stopSpeech } from './speech'

const MUTE_KEY = 'word-planet.muted.v1'

interface SoundContextValue {
  muted: boolean
  speechSupported: boolean
  toggleMuted: () => void
  speakWord: (text: string, slow?: boolean) => boolean
  stop: () => void
  sfx: {
    tap: () => void
    correct: () => void
    wrong: () => void
    star: () => void
    win: () => void
  }
}

const SoundContext = createContext<SoundContextValue | null>(null)

function loadMuted(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(MUTE_KEY) === '1'
  } catch {
    return false
  }
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(loadMuted)

  useEffect(() => {
    setSfxMuted(muted)
    try {
      window.localStorage.setItem(MUTE_KEY, muted ? '1' : '0')
    } catch {
      // ignore
    }
    if (muted) stopSpeech()
  }, [muted])

  const toggleMuted = useCallback(() => {
    setMuted((value) => {
      if (value) {
        // 从静音恢复时顺便解锁音频上下文。
        unlockAudio()
        primeSpeech()
      }
      return !value
    })
  }, [])

  const speakWord = useCallback(
    (text: string, slow = false) => {
      if (muted) return false
      unlockAudio()
      primeSpeech()
      return speak(text, { rate: slow ? 0.62 : 0.86 })
    },
    [muted],
  )

  const stop = useCallback(() => stopSpeech(), [])

  const sfx = useMemo(
    () => ({
      tap: () => {
        if (!muted) playTap()
      },
      correct: () => {
        if (!muted) playCorrect()
      },
      wrong: () => {
        if (!muted) playWrong()
      },
      star: () => {
        if (!muted) playStar()
      },
      win: () => {
        if (!muted) playWin()
      },
    }),
    [muted],
  )

  const value = useMemo(
    () => ({ muted, speechSupported, toggleMuted, speakWord, stop, sfx }),
    [muted, toggleMuted, speakWord, stop, sfx],
  )

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}

export function useSound() {
  const context = useContext(SoundContext)
  if (!context) throw new Error('useSound 必须在 SoundProvider 内使用')
  return context
}
