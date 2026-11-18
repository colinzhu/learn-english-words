import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { AudioButton } from '../../components/AudioButton'
import { WordArt } from '../../components/WordArt'
import { Icon } from '../../components/Icon'
import { Mascot } from '../../components/Mascot'
import { Stars } from '../../components/Stars'
import { getWordSpeech } from '../../data/packs'
import type { Word, WordPack } from '../../data/types'
import { useProgress } from '../../progress/ProgressProvider'
import { getPackStats, getWordStars } from '../../progress/model'

export function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 52 }, (_, index) => ({
        left: (index * 37 + 11) % 100,
        delay: (index % 9) * 0.11,
        duration: 2.6 + (index % 5) * 0.33,
        rotate: (index * 47) % 360,
        size: 7 + (index % 4) * 3,
        color: ['#ffcf4d', '#ff7a66', '#7c5cfc', '#25b79b', '#6cc9ff', '#ff9db6'][index % 6],
        round: index % 3 === 0,
      })),
    [],
  )

  return (
    <div className="confetti-layer" aria-hidden="true">
      {pieces.map((piece, index) => (
        <i
          key={index}
          style={
            {
              '--left': `${piece.left}%`,
              '--delay': `${piece.delay}s`,
              '--duration': `${piece.duration}s`,
              '--rotate': `${piece.rotate}deg`,
              '--size': `${piece.size}px`,
              '--color': piece.color,
              '--radius': piece.round ? '50%' : '3px',
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

export function ResultStep({
  pack,
  words,
  sessionStars,
  hasMore,
  onReplay,
  onNextGroup,
  onHome,
}: {
  pack: WordPack
  words: Word[]
  sessionStars: number
  hasMore: boolean
  onReplay: () => void
  onNextGroup: () => void
  onHome: () => void
}) {
  const { progress } = useProgress()
  const packStats = getPackStats(progress, pack)
  const fullMarks = packStats.masteredWords === pack.words.length
  const remainingWords = packStats.totalWords - packStats.masteredWords

  return (
    <section
      className="result-step"
      style={{ '--pack-color': pack.color, '--pack-soft': pack.softColor } as CSSProperties}
      aria-labelledby="result-title"
    >
      <div className="result-step__hero">
        <span className="result-step__burst" aria-hidden="true">
          <Icon name="spark" size={30} />
          <Icon name="star" size={20} />
          <Icon name="star" size={14} />
        </span>
        <Mascot className="result-step__mascot" mood="cheer" />
        <span className="result-step__trophy" aria-hidden="true">
          <Icon name="trophy" size={38} />
        </span>
      </div>

      <span className="eyebrow">Adventure complete</span>
      <h1 id="result-title">{fullMarks ? '满星通关！' : '本组完成！'}</h1>
      <p className="result-step__lead">
        {fullMarks
          ? `你点亮了「${pack.titleZh}」的全部星星，每一个单词都认识了、听懂了、也会拼了！`
          : `你完成了本组 ${words.length} 个单词，还有 ${remainingWords} 个单词在等你。`}
      </p>

      <div className="result-stats">
        <div className="result-stat result-stat--star">
          <span className="result-stat__icon">
            <Icon name="star" size={24} />
          </span>
          <strong>{sessionStars}</strong>
          <span>本次收集星星</span>
        </div>
        <div className="result-stat result-stat--words">
          <span className="result-stat__icon">
            <Icon name="book" size={24} />
          </span>
          <strong>{words.length}</strong>
          <span>本组完成单词</span>
        </div>
        <div className="result-stat result-stat--master">
          <span className="result-stat__icon">
            <Icon name="trophy" size={24} />
          </span>
          <strong>
            {packStats.masteredWords}/{pack.words.length}
          </strong>
          <span>单元满星进度</span>
        </div>
      </div>

      <div className="result-review">
        <div className="result-review__heading">
          <h2>今天的收获</h2>
          <span>点小喇叭再听一遍</span>
        </div>
        <div className="result-word-grid">
          {words.map((word) => (
            <div key={word.id} className="result-word-card">
              <div className="result-word-card__art">
                <WordArt word={word} />
              </div>
              <div className="result-word-card__body">
                <div>
                  <strong>{word.word}</strong>
                  <span>{word.meaning}</span>
                </div>
                <Stars value={getWordStars(progress, word.id)} size={14} />
              </div>
              <AudioButton text={getWordSpeech(word)} variant="icon" />
            </div>
          ))}
        </div>
      </div>

      <div className="result-actions">
        {hasMore ? (
          <button type="button" className="btn btn--primary btn--large" onClick={onNextGroup}>
            <Icon name="arrow" size={20} /> 继续下一组
          </button>
        ) : (
          <button type="button" className="btn btn--primary btn--large" onClick={onReplay}>
            <Icon name="refresh" size={20} /> 再玩一次
          </button>
        )}
        <button type="button" className="btn btn--ghost" onClick={onHome}>
          <Icon name="home" size={20} /> 回到探险地图
        </button>
        <Link to="/wordbook" className="text-link result-actions__link">
          打开单词图鉴 <Icon name="arrow" size={16} />
        </Link>
      </div>
    </section>
  )
}
