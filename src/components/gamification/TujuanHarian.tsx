import { useStore } from '@/state/user-store'
import { hariIni } from '@/lib/gamification'
import { Icon } from '@/components/ui/Icon'
import clsx from 'clsx'

const PILIHAN = [5, 10, 15, 20]

export function TujuanHarian() {
  const g = useStore((s) => s.state.gamifikasi)
  const atur = useStore((s) => s.aturTujuanHarian)
  const hari = hariIni()
  const soal = g.harian[hari]?.soal ?? 0
  const frac = Math.max(0, Math.min(1, soal / g.dailyGoal))
  const selesai = soal >= g.dailyGoal
  const R = 26
  const C = 2 * Math.PI * R

  return (
    <div className="kartu p-4">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0">
          <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
            <circle cx="32" cy="32" r={R} fill="none" stroke="var(--color-line)" strokeWidth="5" />
            <circle
              cx="32"
              cy="32"
              r={R}
              fill="none"
              stroke={selesai ? 'var(--color-hijau)' : 'var(--color-cyan)'}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - frac)}
              className="transition-[stroke-dashoffset] duration-500"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-hijau">
            {selesai ? <Icon nama="cek" ukuran={22} /> : <Icon nama="target" ukuran={20} className="text-cyan" />}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[1.15rem] leading-none">
            {soal}
            <span className="text-faint">/{g.dailyGoal}</span>
            <span className="ml-1 text-[0.8rem] font-normal text-faint">soal hari ini</span>
          </p>
          <p className="mt-1 text-[12px] text-faint">
            {selesai ? 'Target harian tercapai. +25 XP!' : 'Target harian — jaga konsistensi.'}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5" role="group" aria-label="Pilih target harian">
        <span className="mr-1 text-[12px] text-faint">Target:</span>
        {PILIHAN.map((n) => (
          <button
            key={n}
            onClick={() => atur(n)}
            aria-pressed={g.dailyGoal === n}
            className={clsx(
              'rounded-full px-3 py-1 text-[12.5px] font-medium transition',
              g.dailyGoal === n
                ? 'bg-cyan-soft text-cyan shadow-[0_0_10px_rgb(34_211_238/0.3)]'
                : 'bg-sunken text-muted hover:text-ink',
            )}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}