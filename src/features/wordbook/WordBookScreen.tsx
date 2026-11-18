import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { AudioButton } from '../../components/AudioButton'
import { HighlightedSentence } from '../../components/HighlightedSentence'
import { Icon } from '../../components/Icon'
import { Stars } from '../../components/Stars'
import { WordArt } from '../../components/WordArt'
import { VOLUMES, WORD_PACKS, getPacksByVolume, getWordSpeech } from '../../data/packs'
import type { VolumeId, Word, WordPack } from '../../data/types'
import { useProgress } from '../../progress/ProgressProvider'
import { getOverallStats, getWordStars } from '../../progress/model'

function WordDetailModal({
  word,
  pack,
  onClose,
}: {
  word: Word
  pack: WordPack
  onClose: () => void
}) {
  const { progress } = useProgress()
  const stars = getWordStars(progress, word.id)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = previousOverflow
      previous?.focus()
    }
  }, [onClose])

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div
        className="word-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="word-modal-title"
        style={{ '--pack-color': pack.color, '--pack-soft': pack.softColor } as CSSProperties}
      >
        <button ref={closeRef} type="button" className="modal-close" onClick={onClose} aria-label="关闭单词详情">
          <Icon name="close" size={22} />
        </button>

        <div className="word-modal__visual">
          <span className="word-modal__pack">
            {pack.icon} Unit {pack.unit} · {pack.titleZh}
          </span>
          <div className="word-modal__art">
            <WordArt word={word} decorative={false} />
          </div>
          <div className="word-modal__mastery">
            <span>掌握的星星</span>
            <Stars value={stars} size={21} />
          </div>
        </div>

        <div className="word-modal__content">
          <div className="word-modal__title-row">
            <div>
              <h2 id="word-modal-title" className={word.word.length > 7 ? 'is-long-word' : undefined}>{word.word}</h2>
              <span className="phonetic">{word.phonetic}</span>
            </div>
            <span className="word-modal__meaning">{word.meaning}</span>
          </div>

          <div className="word-modal__audio">
            <AudioButton text={getWordSpeech(word)} label="听单词" />
            <AudioButton text={getWordSpeech(word)} slow label="慢速" variant="soft" />
          </div>

          {word.example ? (
            <div className="example-box">
              <span className="example-box__label">
                <Icon name="spark" size={15} /> 例句
              </span>
              <p className="example-box__en">
                <HighlightedSentence sentence={word.example} word={word.word} />
              </p>
              {word.exampleZh && <p className="example-box__zh">{word.exampleZh}</p>}
            </div>
          ) : (
            <div className="word-list-note word-list-note--modal">
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

          <div className="word-modal__footer">
            <span className="scene-tag">使用场景：{word.scene}</span>
            <Link to={`/adventure/${pack.id}`} className="btn btn--primary">
              去练习 <Icon name="arrow" size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export function WordBookScreen() {
  const { progress } = useProgress()
  const stats = getOverallStats(progress, WORD_PACKS)
  const [activeVolume, setActiveVolume] = useState<VolumeId>('grade3a')
  const [activeWord, setActiveWord] = useState<{ word: Word; pack: WordPack } | null>(null)
  const [query, setQuery] = useState('')
  const [unitFilter, setUnitFilter] = useState<'all' | number>(1)
  const packs = getPacksByVolume(activeVolume)
  const volume = VOLUMES.find((item) => item.id === activeVolume) ?? VOLUMES[0]
  const searchTerm = query.trim().toLowerCase()
  const filteredPacks = packs
    .filter((pack) => unitFilter === 'all' || pack.unit === unitFilter)
    .map((pack) => ({
      ...pack,
      words: pack.words.filter(
        (word) => !searchTerm || word.word.toLowerCase().includes(searchTerm) || word.meaning.includes(query.trim()),
      ),
    }))
    .filter((pack) => pack.words.length > 0)
  const visibleWordCount = filteredPacks.reduce((sum, pack) => sum + pack.words.length, 0)

  return (
    <div className="wordbook-page">
      <header className="page-hero page-hero--wordbook">
        <div>
          <span className="eyebrow">My word collection</span>
          <h1>单词图鉴</h1>
          <p>
            广州教科版（教育科学出版社）2026 三年级上下册，<span className="nowrap">16 个单元</span>、
            <span className="nowrap">{stats.totalWords} 个全量词条</span>。点一点卡片，还能再听一次发音。
          </p>
        </div>
        <div className="collection-badge">
          <span className="collection-badge__icon">
            <Icon name="book" size={30} />
          </span>
          <div>
            <strong>
              {stats.startedWords}
              <small> / {stats.totalWords}</small>
            </strong>
            <span>已收藏单词</span>
          </div>
        </div>
      </header>

      <div className="volume-tabs volume-tabs--wordbook" role="tablist" aria-label="按学年册筛选单词">
        {VOLUMES.map((item) => {
          const isActive = item.id === activeVolume
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`volume-tab${isActive ? ' is-active' : ''}`}
              onClick={() => {
                setActiveVolume(item.id)
                setUnitFilter(1)
                setQuery('')
              }}
            >
              <span className="volume-tab__icon" aria-hidden="true">
                {item.id === 'grade3a' ? 'A' : 'B'}
              </span>
              <span>
                <strong>{item.label}</strong>
                <small>{getPacksByVolume(item.id).length} 个单元 · {item.subtitle.split(' · ')[0]}</small>
              </span>
            </button>
          )
        })}
      </div>

      <div className="wordbook-filters">
        <label className="wordbook-search">
          <Icon name="search" size={18} />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              if (event.target.value.trim()) setUnitFilter('all')
            }}
            placeholder="搜索英文单词或中文意思"
            aria-label="搜索英文单词或中文意思"
          />
        </label>
        <label className="wordbook-unit-filter">
          <span>单元</span>
          <select
            value={unitFilter}
            onChange={(event) =>
              setUnitFilter(event.target.value === 'all' ? 'all' : Number(event.target.value))
            }
            aria-label="按单元筛选"
          >
            <option value="all">全部单元</option>
            {packs.map((pack) => (
              <option key={pack.id} value={pack.unit}>
                Unit {pack.unit} · {pack.titleZh}
              </option>
            ))}
          </select>
        </label>
        <span className="wordbook-results">{visibleWordCount} 个词条</span>
      </div>

      {filteredPacks.length === 0 && (
        <div className="wordbook-empty">
          <span aria-hidden="true">🔍</span>
          <strong>没有找到这个单词</strong>
          <p>换一个英文单词或中文意思试试，也可以清空搜索。</p>
          <button type="button" className="btn btn--ghost" onClick={() => setQuery('')}>
            清空搜索
          </button>
        </div>
      )}

      {filteredPacks.map((pack) => (
        <section
          key={pack.id}
          className="wordbook-section"
          style={{ '--pack-color': pack.color, '--pack-soft': pack.softColor } as CSSProperties}
          aria-labelledby={`wordbook-${pack.id}`}
        >
          <div className="wordbook-section__heading">
            <span className="wordbook-section__icon" aria-hidden="true">
              {pack.icon}
            </span>
            <div>
              <h2 id={`wordbook-${pack.id}`}>
                {pack.titleZh} <span>{pack.title}</span>
              </h2>
              <p>
                Unit {pack.unit} · {pack.unitTitle} · {pack.tagline}
              </p>
            </div>
            <span className="wordbook-section__count">{pack.words.length} 个单词</span>
          </div>

          <div className="word-grid">
            {pack.words.map((word) => {
              const stars = getWordStars(progress, word.id)
              return (
                <button
                  key={word.id}
                  type="button"
                  className={`word-card${stars === 3 ? ' word-card--mastered' : ''}`}
                  onClick={() => setActiveWord({ word, pack })}
                  aria-label={`查看单词 ${word.word}，${word.meaning}，${stars} 颗星`}
                >
                  <div className="word-card__art">
                    <WordArt word={word} />
                    <span className="word-card__sound" aria-hidden="true">
                      <Icon name="volume" size={16} />
                    </span>
                  </div>
                  <div className="word-card__body">
                    <div className="word-card__word-row">
                      <strong>{word.word}</strong>
                      <span>{word.phonetic}</span>
                    </div>
                    <p>{word.meaning}</p>
                    <div className="word-card__footer">
                      <Stars value={stars} size={15} />
                      <span>{stars === 3 ? '已掌握' : stars === 0 ? '待探索' : '学习中'}</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </section>
      ))}

      <p className="wordbook-note">
        当前显示：{volume.label} · 共 {visibleWordCount} 个词条
      </p>

      {activeWord && (
        <WordDetailModal word={activeWord.word} pack={activeWord.pack} onClose={() => setActiveWord(null)} />
      )}
    </div>
  )
}
