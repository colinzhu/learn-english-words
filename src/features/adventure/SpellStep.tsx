import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { AudioButton } from '../../components/AudioButton'
import { WordArt } from '../../components/WordArt'
import { Icon } from '../../components/Icon'
import { Stars } from '../../components/Stars'
import { useSound } from '../../audio/SoundProvider'
import { getWordSpeech } from '../../data/packs'
import type { Word, WordPack } from '../../data/types'
import { lettersFromIds, makeLetterTiles } from './helpers'

export function SpellStep({
  word,
  pack,
  onPass,
  onContinue,
}: {
  word: Word
  pack: WordPack
  onPass: () => void
  onContinue: () => void
}) {
  const { speakWord, stop, sfx, speechSupported } = useSound()
  const [tiles] = useState(() => makeLetterTiles(word.word))
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [solved, setSolved] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [hintSlot, setHintSlot] = useState<number | null>(null)
  const [message, setMessage] = useState('按顺序点字母，把单词拼出来。')
  const shakeTimer = useRef<number | null>(null)
  const hintTimer = useRef<number | null>(null)

  const speechText = getWordSpeech(word)
  const letters = lettersFromIds(tiles, selectedIds)
  const currentHint = hintSlot !== null ? word.word[hintSlot] : null
  const hintedTileId = currentHint
    ? tiles.find((tile) => tile.char === currentHint && !selectedIds.includes(tile.id))?.id
    : undefined

  useEffect(() => {
    const timer = window.setTimeout(() => speakWord(speechText), 500)
    return () => window.clearTimeout(timer)
  }, [speechText, speakWord])

  useEffect(
    () => () => {
      stop()
      if (shakeTimer.current) window.clearTimeout(shakeTimer.current)
      if (hintTimer.current) window.clearTimeout(hintTimer.current)
    },
    [stop],
  )

  const markWrong = () => {
    sfx.wrong()
    setShaking(true)
    setMessage('差一点点！点“退一格”改一改，再试一次。')
    if (shakeTimer.current) window.clearTimeout(shakeTimer.current)
    shakeTimer.current = window.setTimeout(() => setShaking(false), 560)
  }

  const addTile = (tileId: string) => {
    if (solved || selectedIds.includes(tileId)) return
    const next = [...selectedIds, tileId]
    setSelectedIds(next)
    setHintSlot(null)
    if (hintTimer.current) window.clearTimeout(hintTimer.current)

    if (next.length === word.word.length) {
      if (lettersFromIds(tiles, next) === word.word) {
        setSolved(true)
        setMessage('拼写正确！')
        onPass()
        sfx.correct()
        window.setTimeout(() => speakWord(speechText), 320)
      } else {
        markWrong()
      }
    } else {
      setMessage('继续选字母吧。')
    }
  }

  const backspace = () => {
    if (solved || selectedIds.length === 0) return
    setSelectedIds((current) => current.slice(0, -1))
    setHintSlot(null)
    setMessage('再听一听，想想还缺哪个字母。')
  }

  const clear = () => {
    if (solved) return
    setSelectedIds([])
    setHintSlot(null)
    setMessage('清空啦，重新拼一次。')
  }

  const showHint = () => {
    if (solved) return
    const nextSlot = selectedIds.length
    if (nextSlot >= word.word.length) {
      setMessage('已经填满啦，先退一格再试试。')
      return
    }
    setHintSlot(nextSlot)
    setMessage(`提示：下一个字母是 “${word.word[nextSlot]}”。`)
    sfx.tap()
    if (hintTimer.current) window.clearTimeout(hintTimer.current)
    hintTimer.current = window.setTimeout(() => setHintSlot(null), 2200)
  }

  return (
    <section
      className="step-layout spell-step"
      style={{ '--pack-color': pack.color, '--pack-soft': pack.softColor } as CSSProperties}
      aria-labelledby="spell-title"
    >
      <div className="spell-step__visual">
        <span className="step-chip">
          <Icon name="pencil" size={16} /> 第 3 步 · 拼一拼
        </span>
        <div className="spell-step__art">
          <WordArt word={word} decorative={false} />
        </div>
        <span className="spell-step__meaning">{word.meaning}</span>
        <div className="spell-step__audio">
          <AudioButton text={speechText} label="听一听" />
          <AudioButton text={speechText} slow label="慢速" variant="soft" />
        </div>
        {!speechSupported && (
          <p className="inline-warning inline-warning--compact">
            语音不可用，请让家长读出：<strong>{word.word}</strong>
          </p>
        )}
      </div>

      <div className="spell-step__content">
        <span className="step-eyebrow">听音拼单词</span>
        <h1 id="spell-title">把单词拼出来</h1>
        <p className="spell-step__lead">
          先听一听，再按字母顺序点击卡片。拼对就能点亮第 3 颗星！
        </p>

        <div className={`letter-slots${shaking ? ' is-shaking' : ''}${word.word.length > 7 ? ' is-long' : ''}${word.word.length > 8 ? ' is-very-long' : ''}`} aria-label="单词拼写格">
          {word.word.split('').map((char, index) => {
            const filled = letters[index]
            const isHint = hintSlot === index && !filled
            return (
              <span
                key={`${char}-${index}`}
                className={`letter-slot${filled ? ' is-filled' : ''}${isHint ? ' is-hint' : ''}`}
                aria-label={`第 ${index + 1} 个字母${filled ? `：${filled}` : '：空'}`}
              >
                {filled ?? (isHint ? char : '')}
              </span>
            )
          })}
        </div>

        <div className="letter-pool" aria-label="字母卡片">
          {tiles.map((tile) => {
            const used = selectedIds.includes(tile.id)
            return (
              <button
                key={tile.id}
                type="button"
                className={`letter-tile${used ? ' is-used' : ''}${hintedTileId === tile.id ? ' is-hinted' : ''}`}
                onClick={() => addTile(tile.id)}
                disabled={used || solved}
                aria-label={`字母 ${tile.char}`}
              >
                {tile.char}
              </button>
            )
          })}
        </div>

        <p className="spell-message" aria-live="polite">
          <Icon name={solved ? 'check' : 'bulb'} size={17} /> {message}
        </p>

        <div className="spell-tools">
          <button type="button" className="tool-button" onClick={backspace} disabled={solved || selectedIds.length === 0}>
            <Icon name="back" size={18} /> 退一格
          </button>
          <button type="button" className="tool-button" onClick={clear} disabled={solved || selectedIds.length === 0}>
            <Icon name="refresh" size={18} /> 清空
          </button>
          <button type="button" className="tool-button tool-button--hint" onClick={showHint} disabled={solved}>
            <Icon name="bulb" size={18} /> 提示
          </button>
        </div>

        {solved && (
          <div className="feedback-banner feedback-banner--success spell-success">
            <span className="feedback-banner__icon">
              <Icon name="check" size={24} />
            </span>
            <div>
              <strong>拼对啦！{word.word}</strong>
              <span className="spell-success__stars">
                <Stars value={3} size={17} /> 第 3 颗星收入星星罐
              </span>
            </div>
            <button type="button" className="btn btn--primary" onClick={onContinue}>
              继续探险 <Icon name="arrow" size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
