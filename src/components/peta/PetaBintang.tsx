import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { useStore } from '@/state/user-store'
import { KATALOG, babById } from '../../../content/index'
import { statusBab } from '@/lib/chapter-status'
import type { StatusBab } from '@/types'
import { Chip } from '@/components/ui/Chip'
import { Button } from '@/components/ui/Button'
import { StatusTitik } from '@/components/ui/StatusTitik'
import { NODES, EDGES, ZONA, LEBAR, TINGGI } from './peta-layout'

const WARNA_STATUS: Record<StatusBab, { isi: string; garis: string; teks: string }> = {
  belum: { isi: 'var(--color-surface)', garis: 'var(--color-faint)', teks: 'var(--color-faint)' },
  sedang: { isi: 'var(--color-cyan-soft)', garis: 'var(--color-cyan)', teks: 'var(--color-cyan)' },
  dikuasai: { isi: 'var(--color-amber)', garis: 'var(--color-amber)', teks: 'var(--color-canvas)' },
}

const WARNA_TIER: Record<string, string> = {
  fondasi: 'var(--color-cyan)',
  inti: 'var(--color-ungu)',
  lanjutan: 'var(--color-magenta)',
}

export function PetaBintang() {
  const state = useStore((s) => s.state)
  const navigate = useNavigate()
  const [dipilih, setDipilih] = useState<string>(() => {
    const berikut = KATALOG.find((b) => b.tersedia && statusBab(b, state) !== 'dikuasai')
    return berikut?.id ?? 'f1'
  })
  const [hover, setHover] = useState<string | null>(null)

  const bab = babById.get(dipilih)
  const status = bab ? statusBab(bab, state) : 'belum'
  const aktif = hover ?? dipilih

  return (
    <div>
      <div className="relative overflow-hidden rounded-[16px] border border-line bg-sunken/60">
        <svg viewBox={`0 0 ${LEBAR} ${TINGGI}`} className="w-full" role="group"
          aria-label="Peta bintang jalur belajar: tiga zona tier dengan node bab dan garis prasyarat">
          <defs>
            {ZONA.map((z) => (
              <radialGradient key={z.tier} id={`nebula-${z.tier}`}>
                <stop offset="0%" stopColor={WARNA_TIER[z.tier]} stopOpacity="0.16" />
                <stop offset="70%" stopColor={WARNA_TIER[z.tier]} stopOpacity="0.04" />
                <stop offset="100%" stopColor={WARNA_TIER[z.tier]} stopOpacity="0" />
              </radialGradient>
            ))}
          </defs>

          {ZONA.map((z) => (
            <g key={z.tier}>
              <rect x={z.x} y={z.y} width={z.w} height={z.h} rx="26" fill={`url(#nebula-${z.tier})`}
                stroke={WARNA_TIER[z.tier]} strokeOpacity="0.18" strokeWidth="1" />
              <text x={z.cx} y={z.y + 24} textAnchor="middle" fill={WARNA_TIER[z.tier]} fontSize="13"
                fontWeight="600" letterSpacing="0.08em" opacity="0.85">
                {z.label.toUpperCase()}
              </text>
            </g>
          ))}

          {EDGES.map((e, i) => {
            const nyala = e.dari === aktif || e.ke === aktif
            return (
              <path key={i} d={e.d} fill="none"
                stroke={nyala ? 'var(--color-amber)' : 'var(--color-line)'}
                strokeWidth={nyala ? 2 : 1.2} opacity={nyala ? 0.85 : 0.6}
                strokeDasharray={nyala ? undefined : '5 5'} />
            )
          })}

          {NODES.map((n) => {
            const b = babById.get(n.id)
            const st = b ? statusBab(b, state) : 'belum'
            const w = WARNA_STATUS[st]
            const terpilih = n.id === dipilih
            const dihover = n.id === hover
            return (
              <g key={n.id} tabIndex={0} role="button"
                aria-label={`${n.kode} ${n.judul}, status ${st}`}
                aria-pressed={terpilih}
                className="cursor-pointer focus:outline-none"
                onClick={() => setDipilih(n.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setDipilih(n.id) } }}
                onPointerEnter={() => setHover(n.id)}
                onPointerLeave={() => setHover((h) => (h === n.id ? null : h))}
                onFocus={() => setDipilih(n.id)}
              >
                <circle cx={n.x} cy={n.y} r="24" fill="transparent" />
                {(terpilih || dihover) && (
                  <circle cx={n.x} cy={n.y} r="20" fill={w.garis} opacity="0.16" />
                )}
                <circle cx={n.x} cy={n.y} r={terpilih ? 15 : 13} fill={w.isi} stroke={w.garis}
                  strokeWidth={terpilih ? 2.6 : 1.8} />
                <text x={n.x} y={n.y + 3.5} textAnchor="middle" fontSize="9" fontWeight="700" fill={w.teks}
                  className="pointer-events-none select-none">
                  {n.kode}
                </text>
                <text x={n.x} y={n.y + 30} textAnchor="middle" fontSize="8.5"
                  fill={terpilih || dihover ? 'var(--color-ink)' : 'var(--color-faint)'}
                  className="pointer-events-none select-none">
                  {n.judul.length > 26 ? n.judul.slice(0, 24) + '…' : n.judul}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {bab && (
        <div className="anim-masuk kartu mt-4 p-5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <StatusTitik status={status} />
            <span className="text-[11.5px] font-medium tracking-wide text-faint">{bab.kode}</span>
            <h2 className="font-display text-[1.15rem] font-semibold leading-snug">{bab.judul}</h2>
            {status === 'dikuasai' && <Chip variasi="olive">dikuasai</Chip>}
            {!bab.tersedia && <Chip>segera</Chip>}
          </div>
          <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">{bab.ringkas}</p>
          <p className="mt-3 text-[11.5px] font-medium uppercase tracking-[0.1em] text-faint">
            Isi bab · ± {bab.estimasiMenit} menit
          </p>
          <ul className="mt-1 grid gap-1 text-[14px] text-muted sm:grid-cols-2">
            {bab.subBab.map((s, i) => (
              <li key={s.id} className="flex gap-2">
                <span className="tabular-nums text-faint">{i + 1}.</span>
                {s.judul}
              </li>
            ))}
          </ul>
          {bab.prasyarat.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-[12.5px] text-faint">Prasyarat:</span>
              {bab.prasyarat.map((p) => (
                <button key={p} onClick={() => setDipilih(p)} className="no-underline">
                  <Chip variasi="garis">{babById.get(p)?.judul ?? p}</Chip>
                </button>
              ))}
            </div>
          )}
          <Button className="mt-4" variasi={bab.tersedia ? 'utama' : 'garis'} disabled={!bab.tersedia}
            onClick={() => navigate(`/bab/${bab.id}`)}>
            {bab.tersedia ? 'Buka bab' : 'Segera hadir'}
          </Button>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12.5px] text-faint">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full border border-faint/60" /> belum</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full border border-cyan bg-cyan-soft" /> sedang</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full border border-amber bg-amber" /> dikuasai</span>
        <span className={clsx('flex items-center gap-1.5')}><span className="h-px w-5 border-t border-dashed border-line" /> prasyarat</span>
      </div>
    </div>
  )
}