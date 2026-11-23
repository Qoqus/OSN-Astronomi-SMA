import { useEffect } from 'react'
import { useStore } from '@/state/user-store'
import { mainkanSuara } from '@/lib/sound'
import { Icon, type NamaIkon } from '@/components/ui/Icon'
import { Konfeti } from './Konfeti'

export function LapisanPerayaan() {
  const perayaan = useStore((s) => s.perayaan)
  const tutup = useStore((s) => s.tutupPerayaan)
  const item = perayaan[0]

  useEffect(() => {
    if (!item) return
    mainkanSuara('rayakan')
    const t = window.setTimeout(() => tutup(), 4200)
    return () => window.clearTimeout(t)
  }, [item, tutup])

  if (!item) return null

  let ikon: NamaIkon = 'bintang'
  let judul = ''
  let sub = ''
  if (item.jenis === 'level') {
    ikon = 'piala'
    judul = `Level ${item.level}!`
    sub = 'Langitmu makin luas. Terus menjelajah.'
  } else if (item.jenis === 'goal') {
    ikon = 'target'
    judul = 'Target harian tercapai!'
    sub = '+25 XP bonus. Konsistensi mengalahkan bakat.'
  } else {
    ikon = 'bintang'
    judul = 'Capaian baru terbuka!'
    sub = item.nama
  }

  return (
    <>
      <Konfeti />
      <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        <div
          role="status"
          className="anim-pop pointer-events-auto flex w-full max-w-[420px] items-center gap-3 rounded-[16px] border border-amber/40 bg-overlay/95 px-4 py-3 shadow-[0_0_30px_rgb(255_178_36/0.25)] backdrop-blur"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-soft text-amber">
            <Icon nama={ikon} ukuran={22} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-[1.02rem] font-semibold leading-snug">{judul}</p>
            <p className="truncate text-[12.5px] text-muted">{sub}</p>
          </div>
          <button
            onClick={tutup}
            aria-label="Tutup perayaan"
            className="shrink-0 rounded-full p-1 text-faint transition hover:text-ink"
          >
            <Icon nama="silang" ukuran={16} />
          </button>
        </div>
      </div>
    </>
  )
}