import clsx from 'clsx'
import type { ReactNode } from 'react'

type Variasi = 'netral' | 'olive' | 'garis' | 'cyan' | 'magenta' | 'amber' | 'hijau' | 'korall'

interface Props {
  children: ReactNode
  variasi?: Variasi
  className?: string
}

const VARIASI: Record<Variasi, string> = {
  netral: 'bg-sunken text-muted',
  olive: 'bg-ungu-soft text-ungu',
  garis: 'border border-line text-muted',
  cyan: 'bg-cyan-soft text-cyan',
  magenta: 'bg-magenta-soft text-magenta',
  amber: 'bg-amber-soft text-amber',
  hijau: 'bg-hijau-soft text-hijau',
  korall: 'bg-korall-soft text-korall',
}

export function Chip({ children, variasi = 'netral', className }: Props) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12.5px] font-medium leading-tight',
        VARIASI[variasi],
        className,
      )}
    >
      {children}
    </span>
  )
}