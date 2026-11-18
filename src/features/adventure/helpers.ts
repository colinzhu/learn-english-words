import type { Word } from '../../data/types'

export interface LetterTile {
  id: string
  char: string
}

export function shuffle<T>(items: T[], random: () => number = Math.random): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }
  return result
}

export function makeLetterTiles(word: string, random: () => number = Math.random): LetterTile[] {
  const tiles = word.split('').map((char, index) => ({ id: `${char}-${index}`, char }))
  const shuffled = shuffle(tiles, random)
  const unchanged = shuffled.map((tile) => tile.char).join('') === word
  if (unchanged && shuffled.length > 1) {
    return [...shuffled.slice(1), shuffled[0]]
  }
  return shuffled
}

export function buildListenOptions(
  target: Word,
  pool: Word[],
  count = 3,
  random: () => number = Math.random,
): Word[] {
  const candidates = shuffle(
    pool.filter((word) => word.id !== target.id),
    random,
  )
  const usedMeanings = new Set([target.meaning])
  const distractors: Word[] = []

  for (const candidate of candidates) {
    if (distractors.length >= Math.max(0, count - 1)) break
    // 中文释义相同的词不能同时作为听力选项，否则会出现两个“我”。
    if (usedMeanings.has(candidate.meaning)) continue
    usedMeanings.add(candidate.meaning)
    distractors.push(candidate)
  }

  return shuffle([target, ...distractors], random)
}

export function lettersFromIds(tiles: LetterTile[], selectedIds: string[]): string {
  return selectedIds
    .map((id) => tiles.find((tile) => tile.id === id)?.char ?? '')
    .join('')
}

export function isCorrectSpelling(tiles: LetterTile[], selectedIds: string[], word: string): boolean {
  return lettersFromIds(tiles, selectedIds) === word && selectedIds.length === word.length
}


/**
 * 一个单元的词可能很多（全量词表有 10–30 个词），每次只取最多 8 个未满星单词。
 * 若本单元已经全部满星，则取前 8 个词进行复习。
 */
export function selectSessionWords(
  words: Word[],
  starsOf: (wordId: string) => number,
  limit = 8,
): Word[] {
  const unmastered = words.filter((word) => starsOf(word.id) < 3)
  const pool = unmastered.length > 0 ? unmastered : words
  return pool.slice(0, Math.max(0, limit))
}
