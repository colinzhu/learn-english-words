let cachedVoice: SpeechSynthesisVoice | null = null
let voicesBound = false

export const speechSupported =
  typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window

function pickEnglishVoice(): SpeechSynthesisVoice | null {
  if (!speechSupported) return null
  const voices = window.speechSynthesis.getVoices()
  if (voices.length === 0) return null

  const preferredNames = ['Samantha', 'Ava', 'Allison', 'Google US English', 'Microsoft Aria']
  for (const name of preferredNames) {
    const match = voices.find((voice) => voice.name.includes(name))
    if (match) return match
  }

  return (
    voices.find((voice) => voice.lang === 'en-US' && voice.localService) ??
    voices.find((voice) => voice.lang === 'en-US') ??
    voices.find((voice) => voice.lang.startsWith('en')) ??
    null
  )
}

export function primeSpeech(): void {
  if (!speechSupported || voicesBound) return
  voicesBound = true
  cachedVoice = pickEnglishVoice()
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    cachedVoice = pickEnglishVoice()
  })
}

export interface SpeakOptions {
  rate?: number
  pitch?: number
  onStart?: () => void
  onEnd?: () => void
  onError?: () => void
}

/**
 * 使用浏览器内置的英文语音朗读。音色取决于设备，无需下载音频。
 */
export function speak(text: string, options: SpeakOptions = {}): boolean {
  if (!speechSupported) {
    options.onError?.()
    return false
  }

  primeSpeech()
  const synth = window.speechSynthesis
  synth.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.rate = options.rate ?? 0.86
  utterance.pitch = options.pitch ?? 1.05
  utterance.volume = 1
  if (cachedVoice) utterance.voice = cachedVoice

  utterance.onstart = () => options.onStart?.()
  utterance.onend = () => options.onEnd?.()
  utterance.onerror = (event) => {
    // 用户快速切换页面时会触发 interrupted/canceled，不必当作错误。
    if (event.error !== 'interrupted' && event.error !== 'canceled') options.onError?.()
    options.onEnd?.()
  }

  synth.speak(utterance)
  return true
}

export function stopSpeech(): void {
  if (speechSupported) window.speechSynthesis.cancel()
}
