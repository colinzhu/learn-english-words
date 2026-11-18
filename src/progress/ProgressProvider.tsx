import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { LearnStep, ProgressState } from '../data/types'
import { completeSession, EMPTY_PROGRESS, recordStep } from './model'
import { loadProgress, saveProgress } from './storage'

interface ProgressContextValue {
  progress: ProgressState
  awardStep: (wordId: string, step: LearnStep) => void
  finishSession: () => void
  reset: () => void
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(loadProgress)

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const awardStep = useCallback((wordId: string, step: LearnStep) => {
    setProgress((current) => recordStep(current, wordId, step))
  }, [])

  const finishSession = useCallback(() => {
    setProgress((current) => completeSession(current))
  }, [])

  const reset = useCallback(() => {
    setProgress(EMPTY_PROGRESS)
  }, [])

  const value = useMemo(
    () => ({ progress, awardStep, finishSession, reset }),
    [progress, awardStep, finishSession, reset],
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (!context) throw new Error('useProgress 必须在 ProgressProvider 内使用')
  return context
}
