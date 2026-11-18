import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useSound } from '../../audio/SoundProvider'
import { ProgressBar } from '../../components/AppShell'
import { Icon } from '../../components/Icon'
import type { IconName } from '../../components/Icon'
import { StarBadge } from '../../components/Mascot'
import { getPack } from '../../data/packs'
import type { LearnStep, WordPack } from '../../data/types'
import { useProgress } from '../../progress/ProgressProvider'
import { getWordStars } from '../../progress/model'
import { DiscoverStep } from './DiscoverStep'
import { selectSessionWords } from './helpers'
import { ListenStep } from './ListenStep'
import { ResultStep, Confetti } from './ResultStep'
import { SpellStep } from './SpellStep'

const STEPS: { id: LearnStep; label: string; icon: IconName }[] = [
  { id: 'discover', label: '看一看', icon: 'eye' },
  { id: 'listen', label: '听一听', icon: 'headphone' },
  { id: 'spell', label: '拼一拼', icon: 'pencil' },
]

function AdventureSession({ pack }: { pack: WordPack }) {
  const navigate = useNavigate()
  const { progress, awardStep, finishSession } = useProgress()
  const { sfx, muted, toggleMuted, stop } = useSound()
  const [sessionWords, setSessionWords] = useState(() =>
    selectSessionWords(pack.words, (wordId) => getWordStars(progress, wordId)),
  )
  const [wordIndex, setWordIndex] = useState(0)
  const [step, setStep] = useState<LearnStep>('discover')
  const [sessionStars, setSessionStars] = useState(0)
  const [finished, setFinished] = useState(false)
  const [doneSteps, setDoneSteps] = useState<LearnStep[]>([])
  const [furthestStepIndex, setFurthestStepIndex] = useState(0)
  const passed = useRef(new Set<string>())

  const word = sessionWords[wordIndex]
  const stepIndex = STEPS.findIndex((item) => item.id === step)
  const totalSteps = sessionWords.length * STEPS.length
  const completedSteps = finished ? totalSteps : wordIndex * STEPS.length + furthestStepIndex
  const hasMoreWords = pack.words.some((item) => getWordStars(progress, item.id) < 3)

  useEffect(() => () => stop(), [stop])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [wordIndex, step, finished])

  const handlePass = () => {
    const key = `${word.id}:${step}`
    if (passed.current.has(key)) return
    passed.current.add(key)
    awardStep(word.id, step)
    setSessionStars((stars) => stars + 1)
    setDoneSteps((steps) => (steps.includes(step) ? steps : [...steps, step]))
    sfx.star()
  }

  const goToStep = (target: LearnStep) => {
    const targetIndex = STEPS.findIndex((item) => item.id === target)
    if (targetIndex < 0) return
    setStep(target)
    setFurthestStepIndex((index) => Math.max(index, targetIndex))
    stop()
    sfx.tap()
  }

  const goNext = () => {
    if (step === 'discover') {
      setStep('listen')
      setFurthestStepIndex((index) => Math.max(index, 1))
      return
    }
    if (step === 'listen') {
      setStep('spell')
      setFurthestStepIndex((index) => Math.max(index, 2))
      return
    }
    if (wordIndex >= sessionWords.length - 1) {
      finishSession()
      setFinished(true)
      sfx.win()
      return
    }
    setWordIndex((index) => index + 1)
    setStep('discover')
    setDoneSteps([])
    setFurthestStepIndex(0)
  }

  const completeDiscover = () => {
    handlePass()
    goNext()
  }

  const replay = () => {
    passed.current.clear()
    setWordIndex(0)
    setStep('discover')
    setSessionStars(0)
    setFinished(false)
    setDoneSteps([])
    setFurthestStepIndex(0)
  }

  const nextGroup = () => {
    const nextWords = selectSessionWords(pack.words, (wordId) => getWordStars(progress, wordId))
    passed.current.clear()
    setSessionWords(nextWords)
    setWordIndex(0)
    setStep('discover')
    setSessionStars(0)
    setFinished(false)
    setDoneSteps([])
    setFurthestStepIndex(0)
  }

  const exit = () => {
    if (!finished && sessionStars > 0 && !window.confirm('要离开探险吗？已经收集的星星会保存。')) {
      return
    }
    navigate('/')
  }

  return (
    <div
      className="adventure-screen"
      style={{ '--pack-color': pack.color, '--pack-soft': pack.softColor } as CSSProperties}
    >
      <header className="session-header">
        <button type="button" className="session-close" onClick={exit} aria-label="退出探险">
          <Icon name="close" size={23} />
        </button>

        <div className="session-progress">
          <div className="session-progress__top">
            <span className="session-pack">
              <span aria-hidden="true">{pack.icon}</span> {pack.titleZh}
            </span>
            <span className="session-word-count">
              {finished ? '本组完成！' : `本组第 ${wordIndex + 1} / ${sessionWords.length} 个单词`}
            </span>
          </div>
          <ProgressBar
            value={completedSteps}
            max={totalSteps}
            color={pack.color}
            label="本组学习进度"
          />
        </div>

        <div className="session-tools">
          <StarBadge count={sessionStars} />
          <button
            type="button"
            className="round-tool round-tool--soft"
            onClick={toggleMuted}
            aria-pressed={muted}
            aria-label={muted ? '打开声音' : '关闭声音'}
          >
            <Icon name={muted ? 'mute' : 'volume'} size={20} />
          </button>
        </div>
      </header>

      {!finished && (
        <div className="session-steps" aria-label="学习步骤">
          {stepIndex > 0 && (
            <button
              type="button"
              className="session-back-step"
              onClick={() => goToStep(STEPS[stepIndex - 1].id)}
            >
              <Icon name="back" size={14} /> 上一步
            </button>
          )}
          {STEPS.map((item, index) => {
            const isDone = doneSteps.includes(item.id)
            const state = index === stepIndex ? 'current' : isDone ? 'done' : 'todo'
            return (
              <button
                key={item.id}
                type="button"
                className={`session-step-pill is-${state}`}
                aria-current={state === 'current' ? 'step' : undefined}
                aria-label={`${isDone ? '复习' : '前往'}${item.label}`}
                onClick={() => goToStep(item.id)}
              >
                <span className="session-step-pill__icon">
                  {isDone ? <Icon name="check" size={14} /> : <Icon name={item.icon} size={14} />}
                </span>
                {item.label}
              </button>
            )
          })}
        </div>
      )}

      <main className="session-stage">
        {finished ? (
          <>
            <Confetti />
            <ResultStep
              pack={pack}
              words={sessionWords}
              sessionStars={sessionStars}
              hasMore={hasMoreWords}
              onReplay={replay}
              onNextGroup={nextGroup}
              onHome={() => navigate('/')}
            />
          </>
        ) : (
          <div key={`${word.id}-${step}`} className="stage-transition">
            {step === 'discover' && (
              <DiscoverStep word={word} pack={pack} onComplete={completeDiscover} />
            )}
            {step === 'listen' && (
              <ListenStep word={word} pack={pack} onPass={handlePass} onContinue={goNext} />
            )}
            {step === 'spell' && (
              <SpellStep word={word} pack={pack} onPass={handlePass} onContinue={goNext} />
            )}
          </div>
        )}
      </main>

      <footer className="session-footer">
        <span>
          <Icon name="spark" size={14} /> 星星会自动保存
        </span>
        <span className="session-footer__hint">听不清？点“慢速”再听一次</span>
      </footer>
    </div>
  )
}

export function AdventureScreen() {
  const { packId } = useParams()
  const pack = getPack(packId)
  if (!pack) return <Navigate to="/" replace />
  return <AdventureSession key={pack.id} pack={pack} />
}
