import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { useStore } from '@/state/user-store'
import type { Tier } from '@/types'
import { KATALOG, TIER_DESKRIPSI, TIER_LABEL, type Bab } from '../../content/index'
import { babDikuasai, statusBab, evaluasiKesiapanModul } from '@/lib/chapter-status'
import { Chip } from '@/components/ui/Chip'
import { Icon } from '@/components/ui/Icon'
import { StatusTitik } from '@/components/ui/StatusTitik'
import { Button } from '@/components/ui/Button'
import { PetaBintang } from '@/components/peta/PetaBintang'

const TIER_URUT: Tier[] = ['fondasi', 'inti', 'lanjutan']

const TIER_WARNA: Record<Tier, string> = {
  fondasi: 'bg-cyan text-[#04222b]',
  inti: 'bg-ungu text-white',
  lanjutan: 'bg-magenta text-white',
}

function ChapterRow({ bab }: { bab: Bab }) {
  const state = useStore((s) => s.state)
  const navigate = useNavigate()
  const [buka, setBuka] = useState(false)
  const status = statusBab(bab, state)
  const kesiapan = evaluasiKesiapanModul(bab, state)

  return (
    <div className="border-t border-line first:border-t-0">
      <button
        onClick={() => setBuka((b) => !b)}
        aria-expanded={buka}
        className="flex w-full items-start gap-3 px-5 py-4 text-left transition hover:bg-sunken/30"
      >
        <StatusTitik status={status} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-[11.5px] font-medium tracking-wide text-faint">{bab.kode}</span>
            <span className="font-medium leading-snug">{bab.judul}</span>
            {status === 'dikuasai' ? (
              <Chip variasi="olive">dikuasai</Chip>
            ) : kesiapan.jumlahLolos > 0 ? (
              <span className="rounded-full border border-cyan/40 bg-cyan-soft/30 px-2 py-0.5 font-mono text-[10.5px] text-cyan">
                {kesiapan.jumlahLolos}/4 gerbang
              </span>
            ) : null}
            {!bab.tersedia && <Chip>segera</Chip>}
          </div>
          <p className="mt-0.5 text-[14px] leading-relaxed text-muted">{bab.ringkas}</p>
        </div>
        <Icon
          nama="chevron"
          ukuran={17}
          className={clsx('mt-1 shrink-0 text-faint transition-transform', buka && 'rotate-180')}
        />
      </button>

      {buka && (
        <div className="anim-masuk px-5 pb-5 pl-[3.05rem]">
          {/* Status 4 Gerbang Kesiapan */}
          <div className="mb-3.5 rounded-[10px] border border-line/80 bg-sunken/50 p-3">
            <div className="flex items-center justify-between text-[11.5px] font-mono">
              <span className="font-semibold text-cyan">Kesiapan 4 Gerbang Belajar</span>
              <span className="text-muted tabular-nums">{kesiapan.jumlahLolos}/4 lolos ({kesiapan.persentaseKesiapan}%)</span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1.5 text-[12px] sm:grid-cols-4">
              {kesiapan.gerbang.map((g) => (
                <div
                  key={g.id}
                  className={clsx(
                    'flex items-center gap-1.5 rounded-[6px] border px-2 py-1',
                    g.lulus
                      ? 'border-hijau/40 bg-hijau-soft/25 text-hijau'
                      : 'border-line/70 bg-surface/70 text-muted',
                  )}
                >
                  <Icon nama={g.lulus ? 'cek' : 'titik'} ukuran={11} />
                  <span className="truncate">{g.kategori}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="mb-2 text-[11.5px] font-medium uppercase tracking-[0.1em] text-faint">
            Isi materi bab · ± {bab.estimasiMenit} menit
          </p>
          <ul className="space-y-1 text-[14.5px] text-muted">
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
              {bab.prasyarat.map((p) => {
                const pb = KATALOG.find((x) => x.id === p)
                return (
                  <Chip key={p} variasi="garis">
                    {pb?.judul ?? p}
                  </Chip>
                )
              })}
            </div>
          )}
          <Button
            className="mt-4"
            variasi={bab.tersedia ? 'utama' : 'garis'}
            disabled={!bab.tersedia}
            onClick={() => navigate(`/bab/${bab.id}`)}
          >
            {bab.tersedia ? 'Buka bab' : 'Segera hadir'}
          </Button>
        </div>
      )}
    </div>
  )
}

function TampilanDaftar() {
  const state = useStore((s) => s.state)
  const dikuasai = babDikuasai(state)
  const [tier, setTier] = useState<Tier>(() => {
    const berikut = KATALOG.find((b) => b.tersedia && !dikuasai.has(b.id))
    return berikut?.tier ?? 'fondasi'
  })

  const babTier = KATALOG.filter((b) => b.tier === tier)
  const jumlahTier = (t: Tier) => KATALOG.filter((b) => b.tier === t).length

  return (
    <div className="anim-masuk">
      <div className="mb-4 flex gap-1.5 rounded-full border border-line bg-surface p-1">
        {TIER_URUT.map((t) => (
          <button
            key={t}
            onClick={() => setTier(t)}
            className={clsx(
              'flex-1 rounded-full px-2 py-2 text-[13px] font-medium transition',
              tier === t ? TIER_WARNA[t] : 'text-muted hover:text-ink',
            )}
          >
            {TIER_LABEL[t]}
            <span className={clsx('ml-1 text-[11px]', tier === t ? 'opacity-70' : 'text-faint')}>
              {jumlahTier(t)}
            </span>
          </button>
        ))}
      </div>

      <p className="mb-3 text-[13.5px] leading-relaxed text-faint">{TIER_DESKRIPSI[tier]}</p>

      <div className="kartu overflow-hidden">
        {babTier.map((b) => (
          <ChapterRow key={b.id} bab={b} />
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3 text-[12.5px] text-faint">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border border-faint/60" /> belum
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border border-cyan bg-cyan-soft" /> sedang
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border border-amber bg-amber" /> dikuasai
        </span>
      </div>
    </div>
  )
}

export function Peta() {
  const [mode, setMode] = useState<'bintang' | 'daftar'>('bintang')

  return (
    <div className="anim-masuk relative left-1/2 w-[min(1040px,calc(100vw-2.5rem))] -translate-x-1/2">
      <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[1.9rem] leading-tight">Peta belajar</h1>
          <p className="mt-1.5 max-w-[52ch] text-[15px] leading-relaxed text-muted">
            Tiga lapis: fondasi dulu, lalu astronomi inti, lalu lanjutan. Garis putus-putus
            menunjukkan prasyarat — klik sebuah bintang untuk melihat isi babnya.
          </p>
        </div>
        <div className="flex gap-1 rounded-full border border-line bg-surface p-1" role="tablist" aria-label="Tampilan peta">
          {(['bintang', 'daftar'] as const).map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={clsx(
                'rounded-full px-3.5 py-1.5 text-[13px] font-medium transition',
                mode === m ? 'bg-ungu text-white' : 'text-muted hover:text-ink',
              )}
            >
              {m === 'bintang' ? 'Peta bintang' : 'Tampilan daftar'}
            </button>
          ))}
        </div>
      </header>

      {mode === 'bintang' ? <PetaBintang /> : <TampilanDaftar />}
    </div>
  )
}