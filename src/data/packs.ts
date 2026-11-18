import { EXTRA_WORDS, FULL_WORD_ORDER } from './fullWordLists'
import { GRADE3A_PACKS } from './grade3a'
import { GRADE3B_PACKS } from './grade3b'
import type { PackId, Volume, VolumeId, Word, WordPack } from './types'

export const VOLUMES: Volume[] = [
  {
    id: 'grade3a',
    label: '三年级上册',
    subtitle: '广州教科版 · 8 个单元',
    english: 'Guangzhou Edition · Book A',
  },
  {
    id: 'grade3b',
    label: '三年级下册',
    subtitle: '广州教科版 · 8 个单元',
    english: 'Guangzhou Edition · Book B',
  },
]

/**
 * 没有明确、贴切图片的单词不使用 emoji，改用中英文文字卡，
 * 避免给孩子制造错误的图像联想。
 */
const TEXT_ART_WORDS = new Set<string>([
  'chinese', 'name',
  'me', 'it', 'this', 'that', 'these', 'you', 'i', 'your', 'my', 'his', 'her', 'its',
  'our', 'their', 'them', 'they', 'us', 'we', 'he', 'she', 'everyone', 'myself',
  'mr', 'ms', 'miss', 'mrs',
  'what', 'where', 'when', 'how',
  'a', 'be', 'the', 'and', 'but', 'to', 'too', 'of', 'for', 'from', 'at', 'about',
  'after', 'not', 'or', 'so', 'such', 'should', 'must', 'need', 'can', 'do', 'get',
  'know', 'guess', 'want', 'let', 'keep', 'have', 'put', 'take', 'give', 'each',
  'every', 'some', 'other', 'anyone', 'away', 'off', 'then',
  'nice', 'half', 'big', 'fan', 'table', 'desk', 'blackboard', 'activity', 'new',
  'last', 'thing', 'just', 'top', 'word', 'spell', 'hour', 'day', 'work', 'use',
])


const SPEECH_OVERRIDES: Record<string, string> = {
  mr: 'Mister',
  mrs: 'Missus',
  ms: 'Miz',
  miss: 'Miss',
  tv: 'T V',
}

function mergePack(pack: WordPack): WordPack {
  const extras = EXTRA_WORDS[pack.id] ?? []
  const byId = new Map<string, Word>()
  for (const word of [...pack.words, ...extras]) byId.set(word.id, word)

  const order = FULL_WORD_ORDER[pack.id] ?? []
  const ordered = order.map((id) => byId.get(id)).filter((word): word is Word => Boolean(word))
  const orderedIds = new Set(ordered.map((word) => word.id))
  const remaining = [...byId.values()].filter((word) => !orderedIds.has(word.id))
  const words = [...ordered, ...remaining].map((word) => {
    const nextWord = TEXT_ART_WORDS.has(word.id)
      ? { ...word, art: { kind: 'text' as const } }
      : word
    const speech = SPEECH_OVERRIDES[word.id]
    return speech ? { ...nextWord, speakText: speech } : nextWord
  })

  return { ...pack, words }
}

/** 核心词 + 教材 Word List 全量拓展词，按教材词表顺序合并。 */
export const WORD_PACKS: WordPack[] = [...GRADE3A_PACKS, ...GRADE3B_PACKS].map(mergePack)


const PACK_COVERS: Record<PackId, string> = {
  'g3a-u1': 'ruler',
  'g3a-u2': 'chocolate',
  'g3a-u3': 'student',
  'g3a-u4': 'red',
  'g3a-u5': 'two',
  'g3a-u6': 'face',
  'g3a-u7': 'listen',
  'g3a-u8': 'bird',
  'g3b-u1': 'breakfast',
  'g3b-u2': 'oclock',
  'g3b-u3': 'schoolbag',
  'g3b-u4': 'football',
  'g3b-u5': 'rule',
  'g3b-u6': 'lunch',
  'g3b-u7': 'polite',
  'g3b-u8': 'library',
}

export function getPackCover(pack: WordPack): Word {
  return pack.words.find((word) => word.id === PACK_COVERS[pack.id]) ?? pack.words[0]
}

export function getWordSpeech(word: Word): string {
  return word.speakText ?? word.word
}

export const ALL_WORDS = WORD_PACKS.flatMap((pack) =>
  pack.words.map((word) => ({ ...word, packId: pack.id, volume: pack.volume })),
)

export type WordWithPack = Word & { packId: PackId; volume: VolumeId }

export function getPack(packId: string | undefined): WordPack | undefined {
  return WORD_PACKS.find((pack) => pack.id === packId)
}

export function getWord(wordId: string): Word | undefined {
  return ALL_WORDS.find((word) => word.id === wordId)
}

export function getPackOfWord(wordId: string): PackId | undefined {
  return ALL_WORDS.find((word) => word.id === wordId)?.packId
}

export function getPacksByVolume(volumeId: VolumeId): WordPack[] {
  return WORD_PACKS.filter((pack) => pack.volume === volumeId)
}

export const TOTAL_WORDS = ALL_WORDS.length
