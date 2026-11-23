import type { StatusBab } from '@/types'

const WARNA: Record<StatusBab, string> = {
  belum: 'border-faint/60',
  sedang: 'border-cyan bg-cyan-soft shadow-[0_0_8px_rgb(34_211_238/0.5)]',
  dikuasai: 'border-amber bg-amber shadow-[0_0_8px_rgb(255_178_36/0.6)]',
}

export function StatusTitik({ status }: { status: StatusBab }) {
  return (
    <span
      className={`mt-[7px] inline-block h-2.5 w-2.5 shrink-0 rounded-full border ${WARNA[status]}`}
      aria-label={
        status === 'belum' ? 'belum dimulai' : status === 'sedang' ? 'sedang dipelajari' : 'dikuasai'
      }
    />
  )
}