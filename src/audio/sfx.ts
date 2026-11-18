let context: AudioContext | null = null
let muted = false

export function setSfxMuted(value: boolean): void {
  muted = value
  if (value) stopAll()
}

function getContext(): AudioContext | null {
  if (muted || typeof window === 'undefined') return null
  const AudioContextClass = window.AudioContext
  if (!AudioContextClass) return null
  if (!context) context = new AudioContextClass()
  if (context.state === 'suspended') void context.resume()
  return context
}

export function unlockAudio(): void {
  const ctx = getContext()
  if (!ctx) return
  // 静默播放一个采样，解锁 iOS 的音频上下文。
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  gain.gain.value = 0.0001
  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.start()
  oscillator.stop(ctx.currentTime + 0.01)
}

function tone(
  frequency: number,
  start: number,
  duration: number,
  volume = 0.12,
  type: OscillatorType = 'sine',
): void {
  const ctx = getContext()
  if (!ctx) return
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + start)
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + start)
  gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + start + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration)
  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.start(ctx.currentTime + start)
  oscillator.stop(ctx.currentTime + start + duration + 0.03)
}

export function playTap(): void {
  tone(620, 0, 0.06, 0.05, 'triangle')
}

export function playCorrect(): void {
  tone(523.25, 0, 0.12, 0.1, 'triangle')
  tone(659.25, 0.1, 0.12, 0.11, 'triangle')
  tone(783.99, 0.2, 0.24, 0.12, 'triangle')
}

export function playWrong(): void {
  tone(220, 0, 0.14, 0.09, 'sawtooth')
  tone(174, 0.12, 0.2, 0.07, 'sawtooth')
}

export function playStar(): void {
  tone(880, 0, 0.1, 0.08, 'sine')
  tone(1174.66, 0.08, 0.2, 0.09, 'sine')
}

export function playWin(): void {
  const notes = [523.25, 659.25, 783.99, 1046.5]
  notes.forEach((note, index) => tone(note, index * 0.13, 0.24, 0.11, 'triangle'))
  tone(1318.5, 0.56, 0.5, 0.1, 'sine')
}

export function stopAll(): void {
  if (context && context.state === 'running') {
    void context.suspend()
  }
}
