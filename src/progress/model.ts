import type { LearnStep, OverallStats, PackStats, ProgressState, WordPack } from '../data/types'

export const EMPTY_PROGRESS: ProgressState = {
  version: 1,
  words: {},
  completedSessions: 0,
}

const STEP_STAR: Record<LearnStep, number> = {
  discover: 1,
  listen: 2,
  spell: 3,
}

const STEP_FIELD: Record<LearnStep, 'discoverAt' | 'listenAt' | 'spellAt'> = {
  discover: 'discoverAt',
  listen: 'listenAt',
  spell: 'spellAt',
}

/**
 * 记录一次学习步骤。星星只会增加，不会因为重复练习而减少。
 */
export function recordStep(
  state: ProgressState,
  wordId: string,
  step: LearnStep,
  now = new Date().toISOString(),
): ProgressState {
  const previous = state.words[wordId] ?? { stars: 0 }
  const nextStars = Math.max(previous.stars, STEP_STAR[step])
  const field = STEP_FIELD[step]

  return {
    ...state,
    words: {
      ...state.words,
      [wordId]: {
        ...previous,
        stars: nextStars,
        [field]: previous[field] ?? now,
        lastSeenAt: now,
      },
    },
    lastPlayedAt: now,
  }
}

export function completeSession(state: ProgressState, now = new Date().toISOString()): ProgressState {
  return {
    ...state,
    completedSessions: state.completedSessions + 1,
    lastPlayedAt: now,
  }
}

export function getWordStars(state: ProgressState, wordId: string): number {
  return state.words[wordId]?.stars ?? 0
}

export function getPackStats(state: ProgressState, pack: WordPack): PackStats {
  const earnedStars = pack.words.reduce((total, word) => total + getWordStars(state, word.id), 0)
  const masteredWords = pack.words.filter((word) => getWordStars(state, word.id) === 3).length
  const startedWords = pack.words.filter((word) => getWordStars(state, word.id) > 0).length

  return {
    earnedStars,
    maxStars: pack.words.length * 3,
    masteredWords,
    startedWords,
    totalWords: pack.words.length,
  }
}

export function getOverallStats(state: ProgressState, packs: WordPack[]): OverallStats {
  const packStats = packs.map((pack) => getPackStats(state, pack))
  return packStats.reduce<OverallStats>(
    (total, pack) => ({
      earnedStars: total.earnedStars + pack.earnedStars,
      maxStars: total.maxStars + pack.maxStars,
      masteredWords: total.masteredWords + pack.masteredWords,
      startedWords: total.startedWords + pack.startedWords,
      totalWords: total.totalWords + pack.totalWords,
      completedSessions: state.completedSessions,
    }),
    {
      earnedStars: 0,
      maxStars: 0,
      masteredWords: 0,
      startedWords: 0,
      totalWords: 0,
      completedSessions: state.completedSessions,
    },
  )
}

export function getNextPack(packs: WordPack[], state: ProgressState): WordPack {
  return packs.find((pack) => getPackStats(state, pack).masteredWords < pack.words.length) ?? packs[0]
}
