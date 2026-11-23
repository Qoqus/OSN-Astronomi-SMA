import { useStore } from '@/state/user-store'
import { statusStreak, titikMingguan } from '@/lib/gamification'
import { Icon } from '@/components/ui/Icon'
import clsx from 'clsx'

export function KartuStreak() {
  const g = useStore((s) => s.state.gamifikasi)
  const titik = titikMingguan(g)
  const status = statusStreak(g)

  return (
    <div className="kartu flex items-center gap-4 p-4">
      <span
        className={clsx(
          'flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-soft text-amber',
          status === 'aktif' && 'shadow-[0_0_18px_rgb(255_178_36/0.45)]',
        )}
      >
        <Icon nama="api" ukuran={26} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-display text-[1.4rem] leading-none">
          {g.streakCount}
          <span className="ml-1 text-[0.8rem] font-normal text-faint">hari beruntun</span>
        </p>
        <p className="mt-1 truncate text-[12px] text-faint">
          {status === 'aktif'
            ? 'Streak menyala hari ini.'
            : status === 'belum'
              ? 'Jawab satu soal untuk menjaga streak.'
              : 'Streak putus — mulai lagi hari ini.'}
        </p>
      </div>
      <div className="flex shrink-0 gap-1" aria-label="Aktivitas tujuh hari terakhir">
        {titik.map((t) => (
          <span
            key={t.hari}
            title={`${t.hari}: ${t.soal} soal`}
            className={clsx(
              'h-2.5 w-2.5 rounded-full',
              t.aktif ? 'bg-amber shadow-[0_0_6px_rgb(255_178_36/0.6)]' : 'bg-line',
            )}
          />
        ))}
      </div>
    </div>
  )
}