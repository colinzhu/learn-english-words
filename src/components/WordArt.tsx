import type { CSSProperties } from 'react'
import type { Word, WordArt as WordArtData } from '../data/types'

const INK = '#24304a'

function ColorArt({ art }: { art: Extract<WordArtData, { kind: 'color' }> }) {
  return (
    <svg viewBox="0 0 160 160" className="word-art__swatch" aria-hidden="true">
      <circle cx="80" cy="82" r="57" fill={art.color} stroke={INK} strokeWidth="6" />
      <path d="M45 58c8-17 23-26 41-27" fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" opacity="0.5" />
      <circle cx="62" cy="81" r="12" fill="#fffdf7" stroke={INK} strokeWidth="3.5" />
      <circle cx="98" cy="81" r="12" fill="#fffdf7" stroke={INK} strokeWidth="3.5" />
      <circle cx="65" cy="84" r="5.5" fill={INK} />
      <circle cx="101" cy="84" r="5.5" fill={INK} />
      <circle cx="67" cy="82" r="1.8" fill="#fff" />
      <circle cx="103" cy="82" r="1.8" fill="#fff" />
      <path d="M70 104c7 9 14 9 21 0" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="44" cy="101" rx="9" ry="5" fill="#fff" opacity="0.3" />
      <ellipse cx="116" cy="101" rx="9" ry="5" fill="#fff" opacity="0.3" />
    </svg>
  )
}

function NumberArt({ art }: { art: Extract<WordArtData, { kind: 'number' }> }) {
  const dots = Array.from({ length: art.value }, (_, index) => index)
  return (
    <span className="word-art__number-wrap" aria-hidden="true">
      <span className={`word-art__number${art.value >= 10 ? ' is-wide' : ''}`}>{art.value}</span>
      {art.dots !== false && (
        <span
          className="word-art__dots"
          aria-hidden="true"
          style={{ '--dot-cols': Math.min(art.value, 10) } as CSSProperties}
        >
          {dots.map((dot) => (
            <i key={dot} />
          ))}
        </span>
      )}
    </span>
  )
}

function PrepositionArt({ art }: { art: Extract<WordArtData, { kind: 'preposition' }> }) {
  const position = art.position
  return (
    <svg viewBox="0 0 200 160" className="word-art__preposition" aria-hidden="true">
      <path d="M28 137h144" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" opacity="0.25" />
      {position === 'under' && (
        <>
          <circle cx="100" cy="125" r="18" fill="#ffcf4d" stroke={INK} strokeWidth="4.5" />
          <path d="M92 122c3-4 5-4 8 0M104 122c3-4 5-4 8 0" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
      <path d="M64 62h72v60H64Z" fill="#f2c9a0" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M64 62l36-18 36 18-36 19Z" fill="#ffe1bd" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M100 81v41" stroke={INK} strokeWidth="3" opacity="0.25" />
      {position === 'in' && (
        <>
          <path d="M64 94h72v28H64Z" fill="#f2c9a0" stroke={INK} strokeWidth="4" opacity="0.25" />
          <circle cx="100" cy="103" r="18" fill="#ffcf4d" stroke={INK} strokeWidth="4.5" />
          <path d="M92 100c3-4 5-4 8 0M104 100c3-4 5-4 8 0" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
      {position === 'on' && (
        <>
          <circle cx="100" cy="47" r="18" fill="#ffcf4d" stroke={INK} strokeWidth="4.5" />
          <path d="M92 44c3-4 5-4 8 0M104 44c3-4 5-4 8 0" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
      <path
        d={position === 'on' ? 'M148 34v24' : position === 'in' ? 'M148 96v22' : 'M148 118v14'}
        fill="none"
        stroke={INK}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="5 5"
        opacity="0.5"
      />
      <path
        d={position === 'on' ? 'M142 52l6 7 6-7' : position === 'in' ? 'M142 112l6 7 6-7' : 'M142 130l6 7 6-7'}
        fill="none"
        stroke={INK}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
    </svg>
  )
}

function EraserArt() {
  return (
    <svg viewBox="0 0 200 160" className="word-art__object" aria-hidden="true">
      <g transform="rotate(-14 100 90)">
        <rect x="48" y="61" width="104" height="61" rx="13" fill="#ff9db6" stroke={INK} strokeWidth="5" />
        <path d="M48 82h104v26c0 8-6 14-14 14H62c-8 0-14-6-14-14Z" fill="#7cc8f5" stroke={INK} strokeWidth="5" />
        <path d="M48 96h104" stroke={INK} strokeWidth="3" opacity="0.25" />
        <circle cx="88" cy="79" r="4.5" fill={INK} />
        <circle cx="112" cy="79" r="4.5" fill={INK} />
        <path d="M92 89c5 5 11 5 16 0" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        <path d="M65 70h25" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
      </g>
      <path d="M35 43c.4 5 2.6 7.2 7.6 7.6-5 .4-7.2 2.6-7.6 7.6-.4-5-2.6-7.2-7.6-7.6 5-.4 7.2-2.6 7.6-7.6Z" fill="#ffcf4d" stroke={INK} strokeWidth="2.5" />
      <circle cx="167" cy="130" r="4" fill="#25b79b" />
    </svg>
  )
}

function ArtContent({ art, word, textMode }: { art: WordArtData; word: Word; textMode: 'word' | 'meaning' }) {
  if (art.kind === 'emoji') {
    return (
      <span className="word-art__emoji" aria-hidden="true">
        {art.emoji}
      </span>
    )
  }
  if (art.kind === 'color') return <ColorArt art={art} />
  if (art.kind === 'number') return <NumberArt art={art} />
  if (art.kind === 'preposition') return <PrepositionArt art={art} />
  if (art.kind === 'object') return <EraserArt />
  if (textMode === 'meaning') {
    return (
      <span className="word-art__text" aria-hidden="true">
        <span className="word-art__text-meaning">{word.meaning}</span>
      </span>
    )
  }

  return (
    <span className="word-art__text" aria-hidden="true">
      <span className={`word-art__text-en${word.word.length > 6 ? ' is-long' : ''}`}>{word.word}</span>
    </span>
  )
}

export function WordArt({
  word,
  decorative = true,
  className,
  textMode = 'word',
}: {
  word: Word
  decorative?: boolean
  className?: string
  /** text 图形在听力选项里显示中文词义，避免直接泄露英文答案 */
  textMode?: 'word' | 'meaning'
}) {
  return (
    <span
      className={`word-art word-art--${word.art.kind}${className ? ` ${className}` : ''}`}
      role={decorative ? 'presentation' : 'img'}
      aria-label={decorative ? undefined : `${word.word} · ${word.meaning}的插画`}
    >
      <span className="word-art__halo" aria-hidden="true" />
      <span className="word-art__dot word-art__dot--one" aria-hidden="true" />
      <span className="word-art__dot word-art__dot--two" aria-hidden="true" />
      <span className="word-art__spark word-art__spark--one" aria-hidden="true">
        ✦
      </span>
      <span className="word-art__spark word-art__spark--two" aria-hidden="true">
        ✦
      </span>
      <ArtContent art={word.art} word={word} textMode={textMode} />
    </span>
  )
}
