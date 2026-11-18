import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../../components/Icon'
import { Mascot } from '../../components/Mascot'
import { ProgressBar } from '../../components/AppShell'
import { WordArt } from '../../components/WordArt'
import { VOLUMES, WORD_PACKS, getPackCover, getPacksByVolume } from '../../data/packs'
import type { VolumeId } from '../../data/types'
import { useProgress } from '../../progress/ProgressProvider'
import { getNextPack, getOverallStats, getPackStats } from '../../progress/model'

function greeting() {
  const hour = new Date().getHours()
  if (hour < 11) return '早上好'
  if (hour < 18) return '下午好'
  return '晚上好'
}

const STEPS = [
  {
    number: '01',
    icon: 'eye' as const,
    title: '看一看',
    text: '图片和单词手拉手，一眼就记住',
    color: '#7c5cfc',
    soft: '#efe9ff',
  },
  {
    number: '02',
    icon: 'headphone' as const,
    title: '听一听',
    text: '跟着语音读一读，耳朵更灵敏',
    color: '#ff7a66',
    soft: '#ffe9e4',
  },
  {
    number: '03',
    icon: 'pencil' as const,
    title: '拼一拼',
    text: '点击字母卡，把单词拼出来',
    color: '#25b79b',
    soft: '#ddf7f0',
  },
]

export function HomeScreen() {
  const { progress } = useProgress()
  const stats = getOverallStats(progress, WORD_PACKS)
  const nextPack = getNextPack(WORD_PACKS, progress)
  const nextStats = getPackStats(progress, nextPack)
  const [activeVolume, setActiveVolume] = useState<VolumeId>(nextPack.volume)
  const volume = VOLUMES.find((item) => item.id === activeVolume) ?? VOLUMES[0]
  const volumePacks = getPacksByVolume(activeVolume)
  const volumeStats = volumePacks.reduce(
    (total, pack) => {
      const packStats = getPackStats(progress, pack)
      return {
        earned: total.earned + packStats.earnedStars,
        max: total.max + packStats.maxStars,
        mastered: total.mastered + packStats.masteredWords,
        words: total.words + packStats.totalWords,
      }
    },
    { earned: 0, max: 0, mastered: 0, words: 0 },
  )
  const percent = stats.maxStars ? Math.round((stats.earnedStars / stats.maxStars) * 100) : 0

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero__copy">
          <span className="hero__hello">
            <span className="hero__hello-dot" aria-hidden="true" />
            {greeting()}，小小探险家
          </span>
          <h1 className="hero__title">
            出发去
            <span className="hero__title-highlight">单词星球</span>
            <span className="hero__title-spark" aria-hidden="true">
              <Icon name="spark" size={30} />
            </span>
          </h1>
          <p className="hero__lead">
            看图片、听发音、拼字母，把今天的单词装进口袋。每天 <span className="nowrap">10 分钟</span>
            ，变成英语小达人！
          </p>
          <div className="hero__actions">
            <Link to={`/adventure/${nextPack.id}`} className="btn btn--primary btn--large">
              <span>{stats.startedWords > 0 ? '继续探险' : '开始探险'}</span>
              <Icon name="arrow" size={21} />
            </Link>
            <Link to="/wordbook" className="btn btn--ghost">
              <Icon name="book" size={20} />
              翻开单词图鉴
            </Link>
          </div>
          <div className="hero__mini-stats" aria-label="学习进度摘要">
            <div>
              <strong>{stats.earnedStars}</strong>
              <span>收集星星</span>
            </div>
            <div className="hero__mini-divider" aria-hidden="true" />
            <div>
              <strong>{stats.masteredWords}</strong>
              <span>满星单词</span>
            </div>
            <div className="hero__mini-divider" aria-hidden="true" />
            <div>
              <strong>{percent}%</strong>
              <span>星球进度</span>
            </div>
          </div>
        </div>

        <div className="hero__art" aria-hidden="true">
          <div className="hero__orbit hero__orbit--outer" />
          <div className="hero__orbit hero__orbit--inner" />
          <span className="hero__planet-ring" />
          <span className="float-chip float-chip--cat">hi</span>
          <span className="float-chip float-chip--apple">red</span>
          <span className="float-chip float-chip--book">ruler</span>
          <span className="float-star float-star--one">
            <Icon name="star" size={24} />
          </span>
          <span className="float-star float-star--two">
            <Icon name="star" size={15} />
          </span>
          <Mascot className="hero__mascot" mood="cheer" />
          <span className="hero__speech">
            今天也一起
            <br />
            收集新单词吧！
          </span>
        </div>
      </section>

      <section className="home-section" aria-labelledby="planets-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Guangzhou Edition · Grade 3</span>
            <h2 id="planets-title">选择你的单词星球</h2>
          </div>
          <p>每个单元有 12–27 个词条，每次学 8 个；完成看、听、拼，点亮三颗星。</p>
        </div>

        <div className="volume-tabs" role="tablist" aria-label="选择学年册">
          {VOLUMES.map((item) => {
            const packs = getPacksByVolume(item.id)
            const unitCount = packs.length
            const isActive = item.id === activeVolume
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="volume-panel"
                className={`volume-tab${isActive ? ' is-active' : ''}`}
                onClick={() => setActiveVolume(item.id)}
              >
                <span className="volume-tab__icon" aria-hidden="true">
                  {item.id === 'grade3a' ? 'A' : 'B'}
                </span>
                <span>
                  <strong>{item.label}</strong>
                  <small>{unitCount} 个单元 · {item.english}</small>
                </span>
              </button>
            )
          })}
        </div>

        <div id="volume-panel" role="tabpanel" className="volume-panel">
          <div className="volume-summary">
            <span className="volume-summary__badge" aria-hidden="true">
              {volume.id === 'grade3a' ? 'A' : 'B'}
            </span>
            <div className="volume-summary__copy">
              <strong>{volume.label}</strong>
              <span>{volume.subtitle} · {volumeStats.mastered}/{volumeStats.words} 个单词满星</span>
            </div>
            <div className="volume-summary__progress">
              <ProgressBar
                value={volumeStats.earned}
                max={volumeStats.max}
                label={`${volume.label}星星进度`}
              />
              <span>{volumeStats.earned}/{volumeStats.max} 星</span>
            </div>
          </div>

          <div className="pack-grid pack-grid--six">
            {volumePacks.map((pack, index) => {
              const packStats = getPackStats(progress, pack)
              const done = packStats.masteredWords === pack.words.length
              return (
                <Link
                  key={pack.id}
                  to={`/adventure/${pack.id}`}
                  className={`pack-card${done ? ' pack-card--done' : ''}`}
                  style={
                    {
                      '--pack-color': pack.color,
                      '--pack-soft': pack.softColor,
                      '--pack-delay': `${index * 55}ms`,
                    } as CSSProperties
                  }
                >
                  <div className="pack-card__header">
                    <span className="pack-card__icon" aria-hidden="true">
                      {pack.icon}
                    </span>
                    <span className="pack-card__unit">Unit {pack.unit}</span>
                    <span className="pack-card__meta">
                      {done ? (
                        <>
                          <Icon name="check" size={15} /> 已点亮
                        </>
                      ) : (
                        `${packStats.startedWords}/${pack.words.length} 已探索`
                      )}
                    </span>
                  </div>

                  <div className="pack-card__main">
                    <div className="pack-card__text">
                      <span className="pack-card__english">{pack.title}</span>
                      <h3>{pack.titleZh}</h3>
                      <p>{pack.tagline}</p>
                      <span className="pack-card__go">
                        {done ? '再玩一次' : packStats.startedWords > 0 ? '继续探索' : '进入星球'}
                        <Icon name="arrow" size={18} />
                      </span>
                    </div>
                    <div className="pack-card__art">
                      <WordArt word={getPackCover(pack)} />
                    </div>
                  </div>

                  <div className="pack-card__footer">
                    <span className="pack-card__star-count">
                      <Icon name="star" size={15} />
                      {packStats.masteredWords}/{pack.words.length} 满星
                    </span>
                    <span className="pack-card__stars">
                      {packStats.earnedStars}/{packStats.maxStars} 星
                    </span>
                    <ProgressBar
                      value={packStats.earnedStars}
                      max={packStats.maxStars}
                      className="pack-card__progress"
                      label={`${pack.titleZh}星星进度`}
                    />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="home-section steps-section" aria-labelledby="steps-title">
        <div className="section-heading section-heading--compact">
          <div>
            <span className="eyebrow">How it works</span>
            <h2 id="steps-title">探险三步曲</h2>
          </div>
          <p>眼睛、耳朵、小手一起动起来，记得更牢。</p>
        </div>
        <div className="steps-grid">
          {STEPS.map((step) => (
            <article
              key={step.number}
              className="step-card"
              style={{ '--step-color': step.color, '--step-soft': step.soft } as CSSProperties}
            >
              <span className="step-card__number">{step.number}</span>
              <span className="step-card__icon">
                <Icon name={step.icon} size={25} />
              </span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </article>
          ))}
          <article className="next-planet-card">
            <span className="next-planet-card__label">
              <Icon name="spark" size={16} /> 今日推荐
            </span>
            <h3>{nextPack.titleZh}</h3>
            <p>
              还差 <strong>{nextStats.totalWords - nextStats.masteredWords}</strong> 个单词就能点亮这个单元。
            </p>
            <Link to={`/adventure/${nextPack.id}`} className="text-link">
              马上出发 <Icon name="arrow" size={16} />
            </Link>
          </article>
        </div>
      </section>

      <section className="phrase-banner" aria-labelledby="phrase-banner-title">
        <span className="phrase-banner__icon" aria-hidden="true">
          <Icon name="chat" size={30} />
        </span>
        <div className="phrase-banner__copy">
          <span className="eyebrow">Chunks & sentence stems</span>
          <h2 id="phrase-banner-title">把重点句子也装进口袋</h2>
          <p>按单元听读教材里的语块和句型，先跟读，再试着自己换词说一句。</p>
        </div>
        <Link to="/phrases" className="btn btn--primary">
          打开句型卡 <Icon name="arrow" size={18} />
        </Link>
      </section>
    </div>
  )
}
