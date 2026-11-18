import { useEffect } from 'react'
import type { CSSProperties } from 'react'
import { AudioButton } from '../../components/AudioButton'
import { HighlightedSentence } from '../../components/HighlightedSentence'
import { WordArt } from '../../components/WordArt'
import { Icon } from '../../components/Icon'
import { useSound } from '../../audio/SoundProvider'
import { getWordSpeech } from '../../data/packs'
import type { Word, WordPack } from '../../data/types'

export function DiscoverStep({
  word,
  pack,
  onComplete,
}: {
  word: Word
  pack: WordPack
  onComplete: () => void
}) {
  const { speakWord, stop, speechSupported } = useSound()
  const speechText = getWordSpeech(word)

  useEffect(() => {
    const timer = window.setTimeout(() => speakWord(speechText), 500)
    return () => {
      window.clearTimeout(timer)
      stop()
    }
  }, [speechText, speakWord, stop])

  return (
    <section
      className="step-layout discover-step"
      style={{ '--pack-color': pack.color, '--pack-soft': pack.softColor } as CSSProperties}
      aria-labelledby="discover-word"
    >
      <div className="discover-step__visual">
        <span className="step-chip">
          <Icon name="eye" size={16} /> 第 1 步 · 看一看
        </span>
        <div className="discover-step__art">
          <WordArt word={word} decorative={false} />
        </div>
        <span className="discover-step__scene">{word.scene}</span>
        <span className="visual-doodle visual-doodle--one" aria-hidden="true">
          <Icon name="spark" size={22} />
        </span>
        <span className="visual-doodle visual-doodle--two" aria-hidden="true">
          <Icon name="star" size={18} />
        </span>
      </div>

      <div className="discover-step__content">
        <span className="step-eyebrow">认识新单词</span>
        <div className="discover-word-row">
          <div>
            <h1 id="discover-word" className={`big-word${word.word.length > 7 ? ' is-long' : ''}`}>
              {word.word}
            </h1>
            <span className="phonetic phonetic--large">{word.phonetic}</span>
          </div>
          <span className="meaning-pill">{word.meaning}</span>
        </div>

        <div className="discover-audio-row">
          <AudioButton text={speechText} label="听发音" />
          <AudioButton text={speechText} slow label="慢速跟读" variant="soft" />
        </div>
        {!speechSupported && (
          <p className="inline-warning">
            这台设备的浏览器暂时不能朗读。可以请家长读一遍：<strong>{word.word}</strong>
          </p>
        )}

        {word.example ? (
          <div className="example-box example-box--discover">
            <span className="example-box__label">
              <Icon name="spark" size={15} /> 例句 · 用起来
            </span>
            <p className="example-box__en">
              <HighlightedSentence sentence={word.example} word={word.word} />
            </p>
            {word.exampleZh && <p className="example-box__zh">{word.exampleZh}</p>}
          </div>
        ) : (
          <div className="word-list-note">
            <span className="tip-box__icon">
              <Icon name="book" size={20} />
            </span>
            <div>
              <strong>教材 Word List 拓展词</strong>
              <p>先听发音、记住拼写，再试着用它说一句话。</p>
            </div>
          </div>
        )}

        {word.tip && (
          <div className="tip-box">
            <span className="tip-box__icon">
              <Icon name="bulb" size={20} />
            </span>
            <div>
              <strong>拼读小提示</strong>
              <p>{word.tip}</p>
            </div>
          </div>
        )}

        <button type="button" className="btn btn--primary btn--large step-cta" onClick={onComplete}>
          我记住啦，去听一听
          <Icon name="arrow" size={21} />
        </button>
      </div>
    </section>
  )
}
