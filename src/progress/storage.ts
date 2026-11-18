import type { ProgressState } from '../data/types'
import { EMPTY_PROGRESS } from './model'

export const STORAGE_KEY = 'word-planet.progress.v1'

function sanitizeWordProgress(value: unknown): ProgressState['words'][string] | null {
  if (!value || typeof value !== 'object') return null
  const candidate = value as Record<string, unknown>
  const stars = typeof candidate.stars === 'number' ? Math.round(candidate.stars) : 0
  if (stars < 0 || stars > 3) return null

  return {
    stars,
    discoverAt: typeof candidate.discoverAt === 'string' ? candidate.discoverAt : undefined,
    listenAt: typeof candidate.listenAt === 'string' ? candidate.listenAt : undefined,
    spellAt: typeof candidate.spellAt === 'string' ? candidate.spellAt : undefined,
    lastSeenAt: typeof candidate.lastSeenAt === 'string' ? candidate.lastSeenAt : undefined,
  }
}

export function parseProgress(raw: string | null): ProgressState {
  if (!raw) return EMPTY_PROGRESS
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return EMPTY_PROGRESS
    const data = parsed as Record<string, unknown>
    if (data.version !== 1) return EMPTY_PROGRESS
    if (!data.words || typeof data.words !== 'object') return EMPTY_PROGRESS

    const words: ProgressState['words'] = {}
    for (const [wordId, value] of Object.entries(data.words as Record<string, unknown>)) {
      const sanitized = sanitizeWordProgress(value)
      if (sanitized) words[wordId] = sanitized
    }

    return {
      version: 1,
      words,
      completedSessions:
        typeof data.completedSessions === 'number' && data.completedSessions >= 0
          ? Math.floor(data.completedSessions)
          : 0,
      lastPlayedAt: typeof data.lastPlayedAt === 'string' ? data.lastPlayedAt : undefined,
    }
  } catch {
    return EMPTY_PROGRESS
  }
}

export function loadProgress(): ProgressState {
  if (typeof window === 'undefined') return EMPTY_PROGRESS
  try {
    return parseProgress(window.localStorage.getItem(STORAGE_KEY))
  } catch {
    return EMPTY_PROGRESS
  }
}

export function saveProgress(progress: ProgressState): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // 浏览器禁用存储时，学习仍可在本次会话中进行。
  }
}
