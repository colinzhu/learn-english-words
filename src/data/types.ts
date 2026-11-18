export type VolumeId = 'grade3a' | 'grade3b'

export type PackId =
  | 'g3a-u1'
  | 'g3a-u2'
  | 'g3a-u3'
  | 'g3a-u4'
  | 'g3a-u5'
  | 'g3a-u6'
  | 'g3a-u7'
  | 'g3a-u8'
  | 'g3b-u1'
  | 'g3b-u2'
  | 'g3b-u3'
  | 'g3b-u4'
  | 'g3b-u5'
  | 'g3b-u6'
  | 'g3b-u7'
  | 'g3b-u8'

export type WordArt =
  | { kind: 'emoji'; emoji: string }
  | { kind: 'color'; color: string; name: string }
  | { kind: 'number'; value: number; dots?: boolean }
  | { kind: 'preposition'; position: 'on' | 'in' | 'under' }
  | { kind: 'object'; shape: 'eraser' }
  | { kind: 'text' }

export interface Word {
  id: string
  word: string
  phonetic: string
  meaning: string
  example?: string
  exampleZh?: string
  tip?: string
  /** 交给语音合成的朗读文本；用于 Mr、Mrs 等缩写 */
  speakText?: string
  art: WordArt
  /** 教材主题/使用场景，方便家长和老师了解学习目标 */
  scene: string
}

export interface WordPack {
  id: PackId
  volume: VolumeId
  unit: number
  unitTitle: string
  title: string
  titleZh: string
  tagline: string
  icon: string
  color: string
  softColor: string
  words: Word[]
}

export interface Volume {
  id: VolumeId
  label: string
  subtitle: string
  english: string
}

export type LearnStep = 'discover' | 'listen' | 'spell'

export interface WordProgress {
  /** 0-3，分别对应：认识、听懂、会拼 */
  stars: number
  discoverAt?: string
  listenAt?: string
  spellAt?: string
  lastSeenAt?: string
}

export interface ProgressState {
  version: 1
  words: Record<string, WordProgress>
  completedSessions: number
  lastPlayedAt?: string
}

export interface PackStats {
  earnedStars: number
  maxStars: number
  masteredWords: number
  startedWords: number
  totalWords: number
}

export interface OverallStats {
  earnedStars: number
  maxStars: number
  masteredWords: number
  startedWords: number
  totalWords: number
  completedSessions: number
}
