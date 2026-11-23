import clsx from 'clsx'
import type { ButtonHTMLAttributes } from 'react'

type Variasi = 'utama' | 'sukses' | 'bahaya' | 'garis' | 'tenang'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variasi?: Variasi
}

const DASAR =
  'inline-flex items-center justify-center gap-2 rounded-[14px] px-5 py-3 text-[15px] font-semibold transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/50 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-not-allowed disabled:opacity-40 active:translate-y-[2px]'

const VARIASI: Record<Variasi, string> = {
  utama:
    'border-b-4 border-ungu-tua bg-gradient-to-b from-ungu to-indigo text-white shadow-[0_0_20px_rgb(139_92_246/0.3)] hover:brightness-110 active:border-b-2',
  sukses:
    'border-b-4 border-[#16a34a] bg-gradient-to-b from-hijau to-[#22c55e] text-[#06210f] hover:brightness-110 active:border-b-2',
  bahaya:
    'border-b-4 border-[#b91c1c] bg-gradient-to-b from-korall to-[#ef4444] text-white hover:brightness-110 active:border-b-2',
  garis:
    'border border-line border-b-4 bg-surface text-ink hover:border-ungu/50 active:border-b-2',
  tenang: 'text-cyan hover:underline underline-offset-4 px-2 active:translate-y-0',
}

export function Button({ variasi = 'utama', className, type = 'button', ...sisa }: Props) {
  return <button type={type} className={clsx(DASAR, VARIASI[variasi], className)} {...sisa} />
}