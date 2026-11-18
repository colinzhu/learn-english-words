import { describe, expect, it } from 'vitest'
import type { ProgressState } from '../data/types'
import { EMPTY_PROGRESS, completeSession, getOverallStats, getPackStats, recordStep } from './model'
import { parseProgress } from './storage'
import { WORD_PACKS } from '../data/packs'

const fixedNow = '2026-11-18T08:00:00.000Z'

describe('recordStep', () => {
  it('按步骤提升星星，且重复练习不会降低星星', () => {
    let state: ProgressState = EMPTY_PROGRESS
    state = recordStep(state, 'cat', 'discover', fixedNow)
    expect(state.words.cat.stars).toBe(1)

    state = recordStep(state, 'cat', 'listen', fixedNow)
    expect(state.words.cat.stars).toBe(2)

    state = recordStep(state, 'cat', 'discover', fixedNow)
    expect(state.words.cat.stars).toBe(2)
    expect(state.words.cat.discoverAt).toBe(fixedNow)

    state = recordStep(state, 'cat', 'spell', fixedNow)
    expect(state.words.cat.stars).toBe(3)
  })

  it('记录完成次数并累计整体进度', () => {
    let state: ProgressState = EMPTY_PROGRESS
    const pack = WORD_PACKS[0]
    for (const word of pack.words) {
      state = recordStep(state, word.id, 'discover')
      state = recordStep(state, word.id, 'listen')
      state = recordStep(state, word.id, 'spell')
    }
    state = completeSession(state)
    const packStats = getPackStats(state, pack)
    const overall = getOverallStats(state, WORD_PACKS)
    expect(packStats.earnedStars).toBe(pack.words.length * 3)
    expect(packStats.masteredWords).toBe(pack.words.length)
    expect(overall.completedSessions).toBe(1)
    expect(overall.earnedStars).toBe(pack.words.length * 3)
  })
})

describe('parseProgress', () => {
  it('可读取合法数据并忽略损坏数据', () => {
    const valid = parseProgress(
      JSON.stringify({
        version: 1,
        words: { cat: { stars: 3, spellAt: fixedNow }, broken: { stars: 99 } },
        completedSessions: 2,
      }),
    )
    expect(valid.words.cat.stars).toBe(3)
    expect(valid.words.broken).toBeUndefined()
    expect(valid.completedSessions).toBe(2)
  })

  it('遇到非法 JSON 或版本时安全回退', () => {
    expect(parseProgress('{not json')).toEqual(EMPTY_PROGRESS)
    expect(parseProgress(JSON.stringify({ version: 99, words: {} }))).toEqual(EMPTY_PROGRESS)
  })
})
