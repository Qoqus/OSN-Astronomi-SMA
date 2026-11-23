import { useId } from 'react'
import clsx from 'clsx'

export type EkspresiLumi = 'netral' | 'senang' | 'sedih' | 'raya' | 'tidur'

interface Props {
  ekspresi?: EkspresiLumi
  ukuran?: number
  className?: string
}

export function Lumi({ ekspresi = 'netral', ukuran = 96, className }: Props) {
  const uid = useId().replace(/[:]/g, '')
  const body = `lumiBody${uid}`
  const ring = `lumiRing${uid}`
  const tidur = ekspresi === 'tidur'
  const senang = ekspresi === 'senang' || ekspresi === 'raya'

  return (
    <svg
      viewBox="0 0 120 120"
      width={ukuran}
      height={ukuran}
      className={clsx(!tidur && 'lumi-bob', className)}
      role="img"
      aria-label={`Lumi, maskot bintang, ekspresi ${ekspresi}`}
    >
      <defs>
        <radialGradient id={body} cx="38%" cy="32%" r="80%">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="45%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6d28d9" />
        </radialGradient>
        <linearGradient id={ring} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#f043b4" />
        </linearGradient>
      </defs>

      <ellipse
        cx="60"
        cy="66"
        rx="46"
        ry="13"
        fill="none"
        stroke={`url(#${ring})`}
        strokeWidth="3"
        opacity="0.85"
        transform="rotate(-16 60 66)"
      />
      <circle cx="60" cy="60" r="33" fill={`url(#${body})`} />
      <circle cx="60" cy="60" r="33" fill="none" stroke="#f043b4" strokeOpacity="0.35" strokeWidth="1.5" />
      <circle cx="48" cy="46" r="6" fill="#ffffff" opacity="0.25" />

      {/* mata */}
      {tidur ? (
        <g stroke="#1e1b4b" strokeWidth="2.6" strokeLinecap="round" fill="none">
          <path d="M44 56q4 3 8 0" />
          <path d="M68 56q4 3 8 0" />
        </g>
      ) : ekspresi === 'raya' ? (
        <g fill="#ffb224">
          <path d="M48 52l1.6 3.4 3.4.5-2.5 2.4.6 3.5-3.1-1.7-3.1 1.7.6-3.5-2.5-2.4 3.4-.5Z" />
          <path d="M72 52l1.6 3.4 3.4.5-2.5 2.4.6 3.5-3.1-1.7-3.1 1.7.6-3.5-2.5-2.4 3.4-.5Z" />
        </g>
      ) : senang ? (
        <g stroke="#1e1b4b" strokeWidth="2.8" strokeLinecap="round" fill="none">
          <path d="M44 57q4-5 8 0" />
          <path d="M68 57q4-5 8 0" />
        </g>
      ) : ekspresi === 'sedih' ? (
        <g>
          <g className="lumi-blink">
            <circle cx="48" cy="57" r="3.4" fill="#1e1b4b" />
            <circle cx="72" cy="57" r="3.4" fill="#1e1b4b" />
          </g>
          <g stroke="#1e1b4b" strokeWidth="2.2" strokeLinecap="round" fill="none">
            <path d="M43 50q5-3 9-1" />
            <path d="M77 50q-5-3-9-1" />
          </g>
        </g>
      ) : (
        <g className="lumi-blink">
          <circle cx="48" cy="56" r="3.6" fill="#1e1b4b" />
          <circle cx="72" cy="56" r="3.6" fill="#1e1b4b" />
          <circle cx="49.2" cy="54.8" r="1.1" fill="#ffffff" />
          <circle cx="73.2" cy="54.8" r="1.1" fill="#ffffff" />
        </g>
      )}

      {/* pipi */}
      {senang && (
        <g fill="#f043b4" opacity="0.5">
          <circle cx="41" cy="66" r="4" />
          <circle cx="79" cy="66" r="4" />
        </g>
      )}

      {/* mulut */}
      {tidur ? (
        <circle cx="60" cy="71" r="2.4" fill="#1e1b4b" />
      ) : ekspresi === 'sedih' ? (
        <path d="M52 74q8-6 16 0" stroke="#1e1b4b" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      ) : senang ? (
        <path d="M50 68q10 12 20 0q-10 4-20 0Z" fill="#1e1b4b" />
      ) : (
        <path d="M53 70q7 6 14 0" stroke="#1e1b4b" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      )}

      {tidur && (
        <g fill="#b7b2d6" fontFamily="Space Mono, monospace" fontWeight="700">
          <text x="86" y="40" fontSize="12" className="lumi-zzz">z</text>
          <text x="94" y="30" fontSize="9" className="lumi-zzz" style={{ animationDelay: '0.6s' }}>z</text>
        </g>
      )}
      {ekspresi === 'raya' && (
        <g fill="#22d3ee">
          <path d="M20 30l1.4 3 3 .4-2.2 2.1.5 3-2.7-1.4-2.7 1.4.5-3-2.2-2.1 3-.4Z" />
          <path d="M98 78l1.2 2.6 2.6.4-1.9 1.8.4 2.6-2.3-1.2-2.3 1.2.4-2.6-1.9-1.8 2.6-.4Z" fill="#ffb224" />
        </g>
      )}
    </svg>
  )
}