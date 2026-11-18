import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { AudioButton } from '../../components/AudioButton'
import { WordArt } from '../../components/WordArt'
import { Icon } from '../../components/Icon'
import { useSound } from '../../audio/SoundProvider'
import { getWordSpeech } from '../../data/packs'
import type { Word, WordPack } from '../../data/types'
import { buildListenOptions } from './helpers'

const OPTION_LABELS = ['A', 'B', 'C']

export function ListenStep({
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
  const [solved, setSolved] = useState(false)
  const [wrongIds, setWrongIds] = useState<string[]>([])
  const [wrongCount, setWrongCount] = useState(0)
  const speechText = getWordSpeech(word)
  const options = useMemo(() => buildListenOptions(word, pack.words), [word, pack.words])

  useEffect(() => {
    const timer = window.setTimeout(() => speakWord(speechText), 450)
    return () => {
      window.clearTimeout(timer)
      stop()
    }
  }, [speechText, speakWord, stop])

  const choose = (option: Word) => {
    if (solved || wrongIds.includes(option.id)) return
    if (option.id === word.id) {
      setSolved(true)
      onPass()
      sfx.correct()
      window.setTimeout(() => speakWord(speechText), 380)
      return
    }
    setWrongIds((current) => [...current, option.id])
    setWrongCount((count) => count + 1)
    sfx.wrong()
  }

  return (
    <section
      className="step-layout listen-step"
      style={{ '--pack-color': pack.color, '--pack-soft': pack.softColor } as CSSProperties}
      aria-labelledby="listen-title"
    >
      <div className="listen-step__header">
        <span className="step-chip">
          <Icon name="headphone" size={16} /> 第 2 步 · 听一听
        </span>
        <h1 id="listen-title">听一听，选出正确的一项</h1>
        <p>点击喇叭听清楚，选出对应的图片或中文意思。选错了也没关系，可以再试一次。</p>

        <div className="listen-player">
          <span className="listen-player__disc" aria-hidden="true">
            <Icon name="volume" size={30} />
            <span className="listen-player__pulse" />
          </span>
          <div className="listen-player__actions">
            <AudioButton text={speechText} label="再听一遍" className="audio-button--hero" />
            <AudioButton text={speechText} slow label="慢速" variant="soft" />
          </div>
        </div>
        {!speechSupported && (
          <p className="inline-warning">
            语音不可用，请让家长读出这个单词：<strong>{word.word}</strong>
          </p>
        )}
      </div>

      <div className="listen-options" role="group" aria-label="图片选项">
        {options.map((option, index) => {
          const isWrong = wrongIds.includes(option.id)
          const isCorrect = solved && option.id === word.id
          return (
            <button
              key={option.id}
              type="button"
              className={`listen-option${isWrong ? ' is-wrong' : ''}${isCorrect ? ' is-correct' : ''}`}
              onClick={() => choose(option)}
              disabled={solved || isWrong}
              aria-label={`选项 ${OPTION_LABELS[index]}`}
              aria-pressed={isCorrect}
            >
              <span className="listen-option__label">{OPTION_LABELS[index]}</span>
              <div className="listen-option__art">
                <WordArt
                  word={option}
                  textMode={option.art.kind === 'text' ? 'meaning' : 'word'}
                />
              </div>
              {isCorrect && (
                <span className="listen-option__result">
                  <Icon name="check" size={18} /> {option.word}
                </span>
              )}
              {isWrong && (
                <span className="listen-option__cross" aria-hidden="true">
                  <Icon name="close" size={20} />
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="listen-feedback" aria-live="polite">
        {solved ? (
          <div className="feedback-banner feedback-banner--success">
            <span className="feedback-banner__icon">
              <Icon name="check" size={24} />
            </span>
            <div>
              <strong>耳朵真灵！这是“{word.word}”</strong>
              <span>{word.meaning} · {word.phonetic}</span>
            </div>
            <button type="button" className="btn btn--primary" onClick={onContinue}>
              去拼一拼 <Icon name="arrow" size={18} />
            </button>
          </div>
        ) : wrongCount > 0 ? (
          <div className="feedback-banner feedback-banner--gentle">
            <span className="feedback-banner__icon feedback-banner__icon--gentle">
              <Icon name={wrongCount >= 2 ? 'bulb' : 'headphone'} size={22} />
            </span>
            <div>
              <strong>{wrongCount >= 2 ? '只剩最后一个啦，再听一次吧' : '差一点点，再听一次'}</strong>
              <span>把听到的单词和图片对一对。</span>
            </div>
          </div>
        ) : (
          <div className="listen-tip">
            <Icon name="spark" size={17} /> 小提示：先听完整的单词，再听清结尾的声音。
          </div>
        )}
      </div>
    </section>
  )
}
