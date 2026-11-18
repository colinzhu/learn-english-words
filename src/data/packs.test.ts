import { describe, expect, it } from 'vitest'
import { ALL_WORDS, VOLUMES, WORD_PACKS, getPack, getPacksByVolume, getWord, getWordSpeech } from './packs'

describe('广州教科版 2026 三年级词库', () => {
  it('包含上下册、16 个单元和 283 个单词', () => {
    expect(VOLUMES).toHaveLength(2)
    expect(WORD_PACKS).toHaveLength(16)
    expect(ALL_WORDS).toHaveLength(283)
    expect(getPacksByVolume('grade3a')).toHaveLength(8)
    expect(getPacksByVolume('grade3b')).toHaveLength(8)
  })

  it('单元和单词 ID 唯一', () => {
    expect(new Set(WORD_PACKS.map((pack) => pack.id)).size).toBe(WORD_PACKS.length)
    expect(new Set(ALL_WORDS.map((word) => word.id)).size).toBe(ALL_WORDS.length)
  })

  it('每个单词都有完整的学习内容与视觉描述', () => {
    for (const pack of WORD_PACKS) {
      expect(pack.words.length).toBeGreaterThanOrEqual(10)
      expect(pack.words.length).toBeLessThanOrEqual(30)
      expect(getPack(pack.id)?.id).toBe(pack.id)

      for (const word of pack.words) {
        expect(word.word.trim()).not.toBe('')
        expect(word.phonetic).toMatch(/^\/.+\/$/)
        expect(word.meaning.trim()).not.toBe('')
        if (word.example) expect(word.example.toLowerCase()).toContain(word.word.toLowerCase())
        if (word.exampleZh) expect(word.exampleZh.trim()).not.toBe('')
        if (word.tip) expect(word.tip.trim()).not.toBe('')
        expect(word.scene.trim()).not.toBe('')
        expect(['emoji', 'color', 'number', 'preposition', 'object', 'text']).toContain(word.art.kind)
      }
    }
  })

  it('没有合适图片的功能词使用中英文文字卡，不强行配 emoji', () => {
    const textOnlyIds = ['be', 'the', 'it', 'and', 'of', 'to', 'me', 'you', 'nice', 'half', 'big', 'fan', 'chinese', 'name']
    for (const id of textOnlyIds) {
      expect(ALL_WORDS.find((word) => word.id === id)?.art.kind).toBe('text')
    }
    expect(ALL_WORDS.find((word) => word.id === 'chocolate')?.art.kind).toBe('emoji')
    expect(ALL_WORDS.find((word) => word.id === 'red')?.art.kind).toBe('color')
  })

  it('Mr 等缩写使用正确的朗读文本', () => {
    expect(getWordSpeech(getWord('mr')!)).toBe('Mister')
    expect(getWordSpeech(getWord('mrs')!)).toBe('Missus')
    expect(getWordSpeech(getWord('tv')!)).toBe('T V')
  })

  it('每个单元的单词不重复，且都属于正确的册别', () => {
    for (const pack of WORD_PACKS) {
      const words = pack.words.map((word) => word.id)
      expect(new Set(words).size).toBe(words.length)
      expect(pack.volume).toBe(pack.id.startsWith('g3a') ? 'grade3a' : 'grade3b')
    }
  })
})
