import { useState } from 'react'
import type { CSSProperties } from 'react'
import { AudioButton } from '../../components/AudioButton'
import { Icon } from '../../components/Icon'
import { Mascot } from '../../components/Mascot'
import { PHRASE_UNITS, TOTAL_PHRASES } from '../../data/phrases'
import { VOLUMES, getPacksByVolume } from '../../data/packs'
import type { PackId, VolumeId } from '../../data/types'

export function PhrasesScreen() {
  const [activeVolume, setActiveVolume] = useState<VolumeId>('grade3a')
  const volumePacks = getPacksByVolume(activeVolume)
  const [selectedPackId, setSelectedPackId] = useState<PackId>(volumePacks[0].id)
  const volume = VOLUMES.find((item) => item.id === activeVolume) ?? VOLUMES[0]
  const pack = volumePacks.find((item) => item.id === selectedPackId) ?? volumePacks[0]
  const phraseUnit = PHRASE_UNITS.find((unit) => unit.packId === pack.id)
  const phrases = phraseUnit?.phrases ?? []

  const changeVolume = (id: VolumeId) => {
    const packs = getPacksByVolume(id)
    setActiveVolume(id)
    setSelectedPackId(packs[0].id)
  }

  return (
    <div className="phrases-page">
      <header className="page-hero page-hero--phrases">
        <div>
          <span className="eyebrow">Chunks & sentence stems</span>
          <h1>句型卡</h1>
          <p>
            教材里的重点语块和半结构句型，按单元收进口袋。先听一遍，再跟着读三遍，最后试着自己换词说一说。
          </p>
        </div>
        <div className="phrase-total">
          <span className="phrase-total__icon">
            <Icon name="chat" size={28} />
          </span>
          <div>
            <strong>{TOTAL_PHRASES}</strong>
            <span>张句型卡</span>
          </div>
        </div>
        <span className="page-hero__mascot" aria-hidden="true">
          <Mascot mood="wink" />
        </span>
      </header>

      <div className="volume-tabs volume-tabs--phrases" role="tablist" aria-label="选择学年册">
        {VOLUMES.map((item) => {
          const isActive = item.id === activeVolume
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`volume-tab${isActive ? ' is-active' : ''}`}
              onClick={() => changeVolume(item.id)}
            >
              <span className="volume-tab__icon" aria-hidden="true">
                {item.id === 'grade3a' ? 'A' : 'B'}
              </span>
              <span>
                <strong>{item.label}</strong>
                <small>{getPacksByVolume(item.id).length} 个单元 · 广州教科版</small>
              </span>
            </button>
          )
        })}
      </div>

      <div className="phrase-controls">
        <label className="phrase-unit-filter">
          <span>选择单元</span>
          <select
            value={pack.id}
            onChange={(event) => setSelectedPackId(event.target.value as PackId)}
            aria-label="选择句型单元"
          >
            {volumePacks.map((item) => (
              <option key={item.id} value={item.id}>
                Unit {item.unit} · {item.titleZh}
              </option>
            ))}
          </select>
        </label>
        <span className="phrase-controls__count">
          {volume.label} · Unit {pack.unit} · {phrases.length} 张
        </span>
      </div>

      <section
        className="phrase-unit"
        style={{ '--pack-color': pack.color, '--pack-soft': pack.softColor } as CSSProperties}
        aria-labelledby="phrase-unit-title"
      >
        <div className="phrase-unit__heading">
          <span className="phrase-unit__icon" aria-hidden="true">
            {pack.icon}
          </span>
          <div>
            <span className="eyebrow">
              Unit {pack.unit} · {pack.unitTitle}
            </span>
            <h2 id="phrase-unit-title">{pack.titleZh}</h2>
            <p>{pack.tagline}</p>
          </div>
          <span className="phrase-unit__count">{phrases.length} 句</span>
        </div>

        <div className="phrase-tip">
          <Icon name="bulb" size={18} />
          <span>
            带着省略号的句子是“句型骨架”，播放时会用一个完整例句来示范。试着把省略号换成自己的词吧。
          </span>
        </div>

        <div className="phrase-grid">
          {phrases.map((phrase, index) => (
            <article key={phrase.id} className="phrase-card">
              <span className="phrase-card__number">{String(index + 1).padStart(2, '0')}</span>
              <p className="phrase-card__en">{phrase.text}</p>
              <p className="phrase-card__zh">{phrase.meaning}</p>
              {phrase.speakText && phrase.speakText !== phrase.text && (
                <p className="phrase-card__sample">
                  <span>朗读示例</span>
                  {phrase.speakText}
                </p>
              )}
              <div className="phrase-card__actions">
                <AudioButton text={phrase.speakText ?? phrase.text} label="听句子" />
                <AudioButton text={phrase.speakText ?? phrase.text} slow label="慢速" variant="soft" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <p className="phrase-footnote">
        当前为{volume.label} · Unit {pack.unit} 的教材 Chunks and Sentence Stems。Review 与 Road Helper Day
        的句型将在下一轮补充。
      </p>
    </div>
  )
}
