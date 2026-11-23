interface Props {
  nilai: number
  label?: string
  warna?: 'ungu' | 'hijau' | 'amber' | 'cyan' | 'magenta'
}

const ISI: Record<NonNullable<Props['warna']>, string> = {
  ungu: 'bg-gradient-to-r from-ungu to-indigo shadow-[0_0_12px_rgb(139_92_246/0.5)]',
  hijau: 'bg-gradient-to-r from-hijau to-[#22c55e] shadow-[0_0_12px_rgb(74_222_128/0.5)]',
  amber: 'bg-gradient-to-r from-amber to-[#ff9600] shadow-[0_0_12px_rgb(255_178_36/0.5)]',
  cyan: 'bg-gradient-to-r from-cyan to-[#0ea5e9] shadow-[0_0_12px_rgb(34_211_238/0.5)]',
  magenta: 'bg-gradient-to-r from-magenta to-[#c026d3] shadow-[0_0_12px_rgb(240_67_180/0.5)]',
}

export function ProgressBar({ nilai, label, warna = 'ungu' }: Props) {
  const persen = Math.max(0, Math.min(100, Math.round(nilai * 100)))
  return (
    <div
      className="h-[7px] w-full overflow-hidden rounded-full bg-sunken ring-1 ring-line/60"
      role="progressbar"
      aria-valuenow={persen}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? 'progres'}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-300 ease-out ${ISI[warna]}`}
        style={{ width: `${persen}%` }}
      />
    </div>
  )
}