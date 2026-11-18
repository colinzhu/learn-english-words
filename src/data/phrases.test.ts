import { describe, expect, it } from 'vitest'
import { PHRASE_UNITS, TOTAL_PHRASES } from './phrases'
import { WORD_PACKS } from './packs'

describe('句型卡数据', () => {
  it('覆盖 16 个单元，共 141 张句型卡', () => {
    expect(PHRASE_UNITS).toHaveLength(16)
    expect(TOTAL_PHRASES).toBe(141)
  })

  it('每个句型单元都对应真实词库单元', () => {
    const packIds = new Set(WORD_PACKS.map((pack) => pack.id))
    for (const unit of PHRASE_UNITS) {
      expect(packIds.has(unit.packId)).toBe(true)
      expect(unit.phrases.length).toBeGreaterThan(0)
      for (const phrase of unit.phrases) {
        expect(phrase.text.trim()).not.toBe('')
        expect(phrase.meaning.trim()).not.toBe('')
        if (phrase.speakText) {
          expect(phrase.speakText).not.toContain('...')
          expect(phrase.speakText).not.toContain('/')
        }
      }
    }
  })

  it('句型卡 ID 全局唯一', () => {
    const ids = PHRASE_UNITS.flatMap((unit) => unit.phrases.map((phrase) => phrase.id))
    expect(new Set(ids).size).toBe(ids.length)
  })
})
