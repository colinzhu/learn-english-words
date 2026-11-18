import { describe, expect, it } from 'vitest'
import { buildListenOptions, isCorrectSpelling, lettersFromIds, makeLetterTiles, selectSessionWords } from './helpers'
import type { Word } from '../../data/types'

const makeWord = (id: string): Word => ({
  id,
  word: id,
  phonetic: '',
  meaning: id,
  example: '',
  exampleZh: '',
  tip: '',
  art: { kind: 'emoji', emoji: '🐱' },
  scene: '',
})

describe('makeLetterTiles', () => {
  it('保留单词中每个字母的数量，包括重复字母', () => {
    const tiles = makeLetterTiles('apple', () => 0.5)
    expect(tiles.map((tile) => tile.char).sort().join('')).toBe('aelpp')
    expect(new Set(tiles.map((tile) => tile.id)).size).toBe(5)
  })

  it('打乱后不会和原单词顺序完全一样', () => {
    const tiles = makeLetterTiles('book', () => 0.99)
    expect(tiles.map((tile) => tile.char).join('')).not.toBe('book')
  })
})

describe('spelling check', () => {
  it('只有选满且顺序正确才算通过', () => {
    const tiles = makeLetterTiles('cat', () => 0.3)
    const correct = tiles
      .filter((tile) => ['c', 'a', 't'].includes(tile.char))
      .sort((a, b) => 'cat'.indexOf(a.char) - 'cat'.indexOf(b.char))
      .map((tile) => tile.id)
    expect(lettersFromIds(tiles, correct)).toBe('cat')
    expect(isCorrectSpelling(tiles, correct, 'cat')).toBe(true)
    expect(isCorrectSpelling(tiles, correct.slice(0, 2), 'cat')).toBe(false)
    expect(isCorrectSpelling(tiles, correct.slice().reverse(), 'cat')).toBe(false)
  })
})

describe('buildListenOptions', () => {
  it('包含正确单词且选项不重复', () => {
    const target = makeWord('cat')
    const pool = [target, makeWord('dog'), makeWord('bird'), makeWord('fish')]
    const options = buildListenOptions(target, pool, 3, () => 0.2)
    expect(options).toHaveLength(3)
    expect(options.some((word) => word.id === 'cat')).toBe(true)
    expect(new Set(options.map((word) => word.id)).size).toBe(3)
  })

  it('听力选项中不会出现相同的中文释义', () => {
    const target = makeWord('me')
    target.meaning = '我'
    const other = makeWord('i')
    other.meaning = '我'
    const it = makeWord('it')
    it.meaning = '它'
    const be = makeWord('be')
    be.meaning = '是'
    const options = buildListenOptions(target, [target, other, it, be], 3, () => 0.2)
    expect(options.map((word) => word.meaning).filter((meaning) => meaning === '我')).toHaveLength(1)
    expect(options).toHaveLength(3)
  })
})


describe('selectSessionWords', () => {
  it('优先选择未满星单词，并且每次最多 8 个', () => {
    const words = Array.from({ length: 20 }, (_, index) => makeWord(`word${index}`))
    const selected = selectSessionWords(words, (id) => (id === 'word0' ? 3 : 0))
    expect(selected).toHaveLength(8)
    expect(selected.some((word) => word.id === 'word0')).toBe(false)
  })

  it('全部满星时取前 8 个复习', () => {
    const words = Array.from({ length: 12 }, (_, index) => makeWord(`word${index}`))
    const selected = selectSessionWords(words, () => 3)
    expect(selected.map((word) => word.id)).toEqual(words.slice(0, 8).map((word) => word.id))
  })
})
