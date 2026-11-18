import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ProgressBar } from '../../components/AppShell'
import { WordArt } from '../../components/WordArt'
import { Icon } from '../../components/Icon'
import type { IconName } from '../../components/Icon'
import { Mascot } from '../../components/Mascot'
import { WORD_PACKS, getPackCover } from '../../data/packs'
import { useProgress } from '../../progress/ProgressProvider'
import { getOverallStats, getPackStats } from '../../progress/model'

interface Badge {
  id: string
  title: string
  description: string
  icon: IconName
  color: string
  soft: string
  unlocked: boolean
}

export function ProgressScreen() {
  const { progress, reset } = useProgress()
  const stats = getOverallStats(progress, WORD_PACKS)
  const percent = stats.maxStars ? Math.round((stats.earnedStars / stats.maxStars) * 100) : 0

  const badges: Badge[] = [
    {
      id: 'first-step',
      title: '初次启程',
      description: '认识第一个单词',
      icon: 'spark',
      color: '#7c5cfc',
      soft: '#efe9ff',
      unlocked: stats.startedWords >= 1,
    },
    {
      id: 'speller',
      title: '拼写小达人',
      description: '把 1 个单词练到满星',
      icon: 'pencil',
      color: '#ff7a66',
      soft: '#ffe9e4',
      unlocked: stats.masteredWords >= 1,
    },
    {
      id: 'collector',
      title: '单词收藏家',
      description: `收集全部 ${stats.totalWords} 个单词`,
      icon: 'book',
      color: '#25b79b',
      soft: '#ddf7f0',
      unlocked: stats.startedWords >= stats.totalWords,
    },
    {
      id: 'star-master',
      title: '满星探险家',
      description: '让所有单词都亮起三颗星',
      icon: 'trophy',
      color: '#f0a82e',
      soft: '#fff1c9',
      unlocked: stats.masteredWords >= stats.totalWords,
    },
    {
      id: 'regular',
      title: '坚持小星星',
      description: '完成 3 次完整探险',
      icon: 'flame',
      color: '#4a8fe7',
      soft: '#e3efff',
      unlocked: stats.completedSessions >= 3,
    },
  ]

  const unlockedCount = badges.filter((badge) => badge.unlocked).length
  const lastPlayed = progress.lastPlayedAt
    ? new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric' }).format(
        new Date(progress.lastPlayedAt),
      )
    : null

  const handleReset = () => {
    if (window.confirm('确定要清空所有星星和学习记录吗？这个操作不能撤销。')) {
      reset()
    }
  }

  return (
    <div className="progress-page">
      <header className="page-hero page-hero--progress">
        <div>
          <span className="eyebrow">My star jar</span>
          <h1>我的星星罐</h1>
          <p>每一次看、听、拼都会变成一颗小星星。看看你的星球亮了多少吧！</p>
        </div>
        <span className="page-hero__mascot" aria-hidden="true">
          <Mascot mood="wink" />
        </span>
      </header>

      <section className="star-overview">
        <div
          className="star-ring"
          style={{ '--ring-percent': `${percent}%` } as CSSProperties}
          role="img"
          aria-label={`星星收集进度 ${percent}%`}
        >
          <div className="star-ring__inner">
            <span className="star-ring__star">
              <Icon name="star" size={28} />
            </span>
            <strong>{stats.earnedStars}</strong>
            <span>共 {stats.maxStars} 颗</span>
          </div>
        </div>

        <div className="star-overview__copy">
          <span className="eyebrow">Star power</span>
          <h2>
            {percent === 100
              ? '整片星球都亮啦！'
              : percent >= 50
                ? '已经点亮一大半啦！'
                : percent > 0
                  ? '星星正在一颗颗亮起来'
                  : '第一颗星星在等你'}
          </h2>
          <p>
            {percent === 100
              ? '所有单词都被你收入囊中，你就是单词星球的满星探险家。'
              : `再收集 ${stats.maxStars - stats.earnedStars} 颗星星，就能让单词星球全部亮起来。`}
          </p>
          <div className="star-overview__stats">
            <div>
              <strong>{stats.masteredWords}</strong>
              <span>满星单词</span>
            </div>
            <div>
              <strong>{stats.startedWords}</strong>
              <span>已认识</span>
            </div>
            <div>
              <strong>{stats.completedSessions}</strong>
              <span>完成探险</span>
            </div>
          </div>
          {lastPlayed && (
            <span className="last-played">
              <Icon name="spark" size={15} /> 上次探险：{lastPlayed}
            </span>
          )}
        </div>

        <Link to="/" className="btn btn--primary star-overview__cta">
          继续收集 <Icon name="arrow" size={19} />
        </Link>
      </section>

      <section className="badge-section" aria-labelledby="badges-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Badge shelf</span>
            <h2 id="badges-title">我的成就徽章</h2>
          </div>
          <p>
            已点亮 {unlockedCount} / {badges.length} 枚徽章
          </p>
        </div>
        <div className="badge-grid">
          {badges.map((badge) => (
            <article
              key={badge.id}
              className={`badge-card${badge.unlocked ? ' badge-card--unlocked' : ''}`}
              style={{ '--badge-color': badge.color, '--badge-soft': badge.soft } as CSSProperties}
            >
              <span className="badge-card__icon">
                {badge.unlocked ? <Icon name={badge.icon} size={27} /> : <Icon name="lock" size={23} />}
              </span>
              <div>
                <h3>{badge.title}</h3>
                <p>{badge.description}</p>
              </div>
              <span className="badge-card__status">{badge.unlocked ? '已点亮' : '未解锁'}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="pack-progress-section" aria-labelledby="pack-progress-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Planet progress</span>
            <h2 id="pack-progress-title">全册单元进度</h2>
          </div>
        </div>
        <div className="pack-progress-list">
          {WORD_PACKS.map((pack) => {
            const packStats = getPackStats(progress, pack)
            return (
              <article
                key={pack.id}
                className="pack-progress-card"
                style={{ '--pack-color': pack.color, '--pack-soft': pack.softColor } as CSSProperties}
              >
                <div className="pack-progress-card__art">
                  <WordArt word={getPackCover(pack)} />
                </div>
                <div className="pack-progress-card__body">
                  <div className="pack-progress-card__heading">
                    <h3>
                      <span className="pack-progress-card__volume">{pack.volume === 'grade3a' ? '三上' : '三下'}</span>
                      {pack.titleZh} <span>{pack.title}</span>
                    </h3>
                    <span>{packStats.earnedStars}/{packStats.maxStars} 星</span>
                  </div>
                  <ProgressBar
                    value={packStats.earnedStars}
                    max={packStats.maxStars}
                    color={pack.color}
                    label={`${pack.titleZh}进度`}
                  />
                  <div className="pack-progress-card__meta">
                    <span className="pack-progress-card__unit">Unit {pack.unit}</span>
                    <span>{packStats.masteredWords}/{pack.words.length} 个单词满星</span>
                    <Link to={`/adventure/${pack.id}`} className="text-link">
                      {packStats.masteredWords === pack.words.length ? '再玩一次' : '继续'} <Icon name="arrow" size={15} />
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <div className="reset-zone">
        <div>
          <strong>想重新开始？</strong>
          <p>清空星星不会影响你学会的单词，它们还在你的脑袋里。</p>
        </div>
        <button type="button" className="btn btn--danger-ghost" onClick={handleReset}>
          <Icon name="refresh" size={18} /> 清空学习记录
        </button>
      </div>
    </div>
  )
}
