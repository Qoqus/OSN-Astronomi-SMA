import type { ReactNode } from 'react'
import clsx from 'clsx'

export function PanelKontrol({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('rounded-[14px] border border-line bg-sunken/60 p-4', className)}>
      {children}
    </div>
  )
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
  accent = 'var(--color-ungu)',
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (n: number) => void
  format?: (n: number) => string
  accent?: string
}) {
  const fill = ((value - min) / (max - min)) * 100
  const teks = format ? format(value) : String(value)
  return (
    <label className="block select-none">
      <span className="mb-1 flex items-baseline justify-between gap-2">
        <span className="text-[12.5px] font-medium text-muted">{label}</span>
        <span className="font-mono text-[12.5px] text-ink tabular-nums">{teks}</span>
      </span>
      <input
        type="range"
        className="slider-kosmik"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        aria-valuetext={teks}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ ['--slider-accent' as string]: accent, ['--slider-fill' as string]: `${fill}%` }}
      />
    </label>
  )
}

export function Toggle({
  label,
  checked,
  onChange,
  accent = 'var(--color-cyan)',
}: {
  label: string
  checked: boolean
  onChange: (b: boolean) => void
  accent?: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 rounded-[10px] px-1 py-1.5 text-left transition hover:bg-surface/60"
    >
      <span className="text-[12.5px] font-medium text-muted">{label}</span>
      <span
        className={clsx(
          'relative h-5 w-9 shrink-0 rounded-full border transition-colors',
          checked ? 'border-transparent' : 'border-line bg-surface',
        )}
        style={checked ? { background: accent } : undefined}
      >
        <span
          className={clsx(
            'absolute top-0.5 h-3.5 w-3.5 rounded-full bg-ink transition-all',
            checked ? 'left-[18px]' : 'left-0.5',
          )}
        />
      </span>
    </button>
  )
}

export function Stepper({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: number
  options: number[]
  onChange: (n: number) => void
}) {
  return (
    <div className="select-none">
      <span className="mb-1 block text-[12.5px] font-medium text-muted">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={value === o}
            onClick={() => onChange(o)}
            className={clsx(
              'min-w-9 rounded-[9px] border px-2.5 py-1 font-mono text-[12.5px] transition',
              value === o
                ? 'border-cyan/60 bg-cyan-soft text-cyan'
                : 'border-line bg-surface text-muted hover:border-ungu/40',
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}

export function TombolReset({ onClick, label = 'Reset' }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-[10px] border border-line bg-surface px-3 py-1.5 text-[12.5px] font-medium text-muted transition hover:border-korall/50 hover:text-korall active:translate-y-px"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 3v5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </button>
  )
}

export function Nilai({
  label,
  nilai,
  satuan,
  accent = 'var(--color-ink)',
}: {
  label: string
  nilai: string
  satuan?: string
  accent?: string
}) {
  return (
    <div className="rounded-[10px] border border-line bg-surface px-3 py-2">
      <p className="text-[10.5px] uppercase tracking-[0.1em] text-faint">{label}</p>
      <p className="font-mono text-[15px] font-semibold tabular-nums" style={{ color: accent }}>
        {nilai}
        {satuan && <span className="ml-1 text-[11px] font-normal text-muted">{satuan}</span>}
      </p>
    </div>
  )
}

export function Preset({
  label,
  onClick,
  aktif,
}: {
  label: string
  onClick: () => void
  aktif?: boolean
}) {
  return (
    <button
      type="button"
      aria-pressed={aktif}
      onClick={onClick}
      className={clsx(
        'rounded-full border px-3 py-1 text-[12px] font-medium transition',
        aktif
          ? 'border-amber/60 bg-amber-soft text-amber'
          : 'border-line bg-surface text-muted hover:border-ungu/50 hover:text-ink',
      )}
    >
      {label}
    </button>
  )
}