import { useStore } from '@/state/user-store'
import { xpUntukLevel } from '@/lib/gamification'

export function KartuXP() {
  const g = useStore((s) => s.state.gamifikasi)
  const awal = xpUntukLevel(g.level)
  const berikut = xpUntukLevel(g.level + 1)
  const frac = Math.max(0, Math.min(1, (g.xp - awal) / (berikut - awal || 1)))
  const R = 26
  const C = 2 * Math.PI * R

  return (
    <div className="kartu flex items-center gap-4 p-4">
      <div className="relative h-16 w-16 shrink-0">
        <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
          <circle cx="32" cy="32" r={R} fill="none" stroke="var(--color-line)" strokeWidth="5" />
          <circle
            cx="32"
            cy="32"
            r={R}
            fill="none"
            stroke="url(#xpGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - frac)}
            className="transition-[stroke-dashoffset] duration-500"
          />
          <defs>
            <linearGradient id="xpGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-display text-[1.2rem] font-semibold text-ink">
          {g.level}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display text-[1.15rem] leading-none">
          {g.xp} <span className="text-[0.8rem] font-normal text-faint">XP</span>
        </p>
        <p className="mt-1 text-[12px] text-faint">
          {berikut - g.xp} XP lagi menuju level {g.level + 1}
        </p>
      </div>
    </div>
  )
}