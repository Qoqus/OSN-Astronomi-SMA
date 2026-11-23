import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { useStore } from '@/state/user-store'
import { statusBab } from '@/lib/chapter-status'
import { mainkanSuara } from '@/lib/sound'
import { babById } from '../../content/index'
import { Chip } from '@/components/ui/Chip'
import { Icon } from '@/components/ui/Icon'
import { TeksMath } from '@/components/ui/TeksMath'
import { Gambar } from '@/components/figures'
import { VisualParametrik } from '@/components/visuals'
import { Interaktif } from '@/components/widgets'
import { SUMBER_LEDGER } from '../../content/sumber'
import { gunakanBabId } from './konteks'

export { VisualParametrik }

function buatSlug(teks: string): string {
  return teks
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function Sorot({
  warna = 'amber',
  children,
}: {
  warna?: 'amber' | 'cyan' | 'hijau' | 'magenta'
  children: ReactNode
}) {
  return (
    <mark
      className={clsx(
        'stabilo',
        warna === 'cyan' && 'stabilo--cyan',
        warna === 'hijau' && 'stabilo--hijau',
        warna === 'magenta' && 'stabilo--magenta',
      )}
    >
      {children}
    </mark>
  )
}

export function Bagian({
  id,
  judul,
  tag,
  children,
}: {
  id?: string
  judul: string
  tag?: string
  children: ReactNode
}) {
  const anchorId = id ?? buatSlug(judul)
  return (
    <section
      id={anchorId}
      data-toc-bagian={judul}
      data-toc-tag={tag ?? ''}
      className="mt-10 scroll-mt-24 first:mt-4"
    >
      {tag && (
        <p className="not-prose mb-1 font-mono text-[11px] font-medium tracking-[0.08em] text-cyan/85">
          {tag}
        </p>
      )}
      <h2 id={`${anchorId}-judul`} className="!mt-0">
        {judul}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  )
}

export function IdentitasModul({
  kode,
  tier,
  klaster,
  posisi,
  estimasi,
  tingkat,
  prasyarat = [],
  koneksi = [],
  lanjutan = [],
  sumberUtama = [],
}: {
  kode: string
  judul?: string
  tier?: string
  klaster?: string
  posisi?: string
  estimasi: string
  tingkat: string
  prasyarat?: { id: string; label: string }[]
  koneksi?: { id: string; label: string; peran?: string }[]
  lanjutan?: { id: string; label: string; peran?: string }[]
  sumberUtama?: string[]
}) {
  const labelTier = tier ?? klaster ?? ''
  const daftarKoneksi = koneksi.length > 0 ? koneksi : lanjutan

  return (
    <section className="not-prose my-5 rounded-[16px] border border-line bg-surface/85 p-5">
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12.5px] font-mono text-muted">
        <span className="font-semibold text-cyan">{kode}</span>
        {labelTier && (
          <>
            <span aria-hidden="true">·</span>
            <span>{labelTier}</span>
          </>
        )}
        {posisi && (
          <>
            <span aria-hidden="true">·</span>
            <span>{posisi}</span>
          </>
        )}
        <span aria-hidden="true">·</span>
        <span className="tabular-nums">{estimasi}</span>
        <span aria-hidden="true">·</span>
        <span>{tingkat}</span>
      </div>

      <div className="mt-4 grid gap-3 border-t border-line/70 pt-4 sm:grid-cols-2">
        <div>
          <p className="text-[11.5px] font-mono font-semibold text-faint">Prasyarat konseptual</p>
          {prasyarat.length === 0 ? (
            <p className="mt-1 text-[13.5px] text-muted">
              Titik awal — cukup aljabar & aritmetika dasar.
            </p>
          ) : (
            <ul className="mt-1.5 space-y-1 text-[13.5px]">
              {prasyarat.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/bab/${p.id}`}
                    className="text-cyan underline-offset-2 hover:underline"
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <p className="text-[11.5px] font-mono font-semibold text-faint">Koneksi lanjutan</p>
          {daftarKoneksi.length === 0 ? (
            <p className="mt-1 text-[13.5px] text-muted">Modul sintesis akhir kurikulum.</p>
          ) : (
            <ul className="mt-1.5 space-y-1 text-[13.5px]">
              {daftarKoneksi.map((k) => (
                <li key={k.id} className="text-muted">
                  <Link
                    to={`/bab/${k.id}`}
                    className="text-ink underline-offset-2 hover:text-cyan hover:underline"
                  >
                    {k.label}
                  </Link>
                  {k.peran ? <span className="text-faint"> — {k.peran}</span> : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {sumberUtama.length > 0 && (
        <div className="mt-3.5 border-t border-line/70 pt-3 text-[12.5px] text-faint">
          <span>Rujukan primer: </span>
          <span className="font-mono text-muted">{sumberUtama.join(' · ')}</span>
        </div>
      )}
    </section>
  )
}

interface SimpulKonsepInput {
  id: string
  label?: string
  judul?: string
  ringkas?: string
  peran: string
  ke?: string[]
  terkait?: string[]
}

export function PetaKonsep({
  judul = 'Peta konsep & ketergantungan ide',
  simpul = [],
}: {
  judul?: string
  simpul: SimpulKonsepInput[]
}) {
  const normalSimpul = simpul.map((s) => ({
    id: s.id,
    label: s.label ?? s.judul ?? s.id,
    ringkas: s.ringkas,
    peran: s.peran ?? '',
    ke: s.ke ?? s.terkait ?? [],
  }))
  const [aktif, setAktif] = useState<string | null>(normalSimpul[0]?.id ?? null)
  const labelMap = new Map(normalSimpul.map((s) => [s.id, s.label]))
  const simpulAktif = normalSimpul.find((s) => s.id === aktif) ?? null
  const terhubungKe = new Set(simpulAktif?.ke ?? [])
  const sumberDari = new Set(
    normalSimpul.filter((s) => s.ke.includes(aktif ?? '')).map((s) => s.id),
  )

  return (
    <section className="not-prose my-6 rounded-[16px] border border-line bg-sunken/70 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-mono text-[11.5px] font-semibold tracking-[0.06em] text-cyan">
          {judul}
        </p>
        <p className="text-[12px] text-faint">
          Pilih simpul untuk melacak prasyarat masuk dan konsekuensi lanjutan
        </p>
      </div>

      <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {normalSimpul.map((item, idx) => {
          const dipilih = item.id === aktif
          const adalahPrasyarat = sumberDari.has(item.id)
          const adalahTujuan = terhubungKe.has(item.id)
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                mainkanSuara('pilih')
                setAktif(dipilih ? null : item.id)
              }}
              aria-pressed={dipilih}
              className={clsx(
                'flex flex-col items-start rounded-[12px] border p-3.5 text-left transition',
                dipilih
                  ? 'border-cyan/70 bg-cyan-soft/35'
                  : adalahTujuan
                    ? 'border-hijau/50 bg-hijau-soft/25'
                    : adalahPrasyarat
                      ? 'border-amber/50 bg-amber-soft/25'
                      : 'border-line bg-surface/85 hover:border-ungu/50',
              )}
            >
              <div className="flex w-full items-baseline justify-between gap-2 text-[11px] font-mono text-faint">
                <span className="tabular-nums">{String(idx + 1).padStart(2, '0')}</span>
                <span>
                  {dipilih
                    ? '● Fokus'
                    : adalahPrasyarat
                      ? '← Prasyarat'
                      : adalahTujuan
                        ? '→ Lanjutan'
                        : ''}
                </span>
              </div>
              <div className="mt-1 font-display text-[15px] font-semibold leading-snug text-ink">
                <TeksMath teks={item.label} />
              </div>
              {item.ringkas && (
                <div className="mt-1 font-mono text-[12px] leading-snug text-cyan/90">
                  <TeksMath teks={item.ringkas} />
                </div>
              )}
              <div className="mt-1 text-[13px] leading-relaxed text-muted">
                <TeksMath teks={item.peran} />
              </div>
              {item.ke.length > 0 && (
                <div className="mt-2 border-t border-line/60 pt-1.5 font-mono text-[11.5px] text-faint">
                  → {item.ke.map((targetId) => labelMap.get(targetId) ?? targetId).join(', ')}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}

export function Epistemik({
  jenis,
  judul,
  children,
}: {
  jenis: 'fakta' | 'model' | 'aproksimasi' | 'interpretasi'
  judul?: string
  children: ReactNode
}) {
  const cfg = {
    fakta: {
      label: 'Fakta observasi & definisi eksak',
      simbol: '●',
      kelasKartu: 'border-hijau/35 bg-hijau-soft/20',
      kelasLabel: 'text-hijau',
    },
    model: {
      label: 'Model teoretis & asumsi ideal',
      simbol: '◆',
      kelasKartu: 'border-cyan/35 bg-cyan-soft/20',
      kelasLabel: 'text-cyan',
    },
    aproksimasi: {
      label: 'Aproksimasi terkendali',
      simbol: '≈',
      kelasKartu: 'border-amber/40 bg-amber-soft/20',
      kelasLabel: 'text-amber',
    },
    interpretasi: {
      label: 'Interpretasi astrofisika',
      simbol: '◈',
      kelasKartu: 'border-ungu/40 bg-ungu-soft/25',
      kelasLabel: 'text-cyan',
    },
  }[jenis]

  return (
    <aside className={clsx('not-prose my-5 rounded-[14px] border p-4 sm:px-5', cfg.kelasKartu)}>
      <p className={clsx('mb-1.5 flex items-center gap-2 font-mono text-[11.5px] font-semibold', cfg.kelasLabel)}>
        <span aria-hidden="true">{cfg.simbol}</span>
        <span>{judul ? `${cfg.label} · ${judul}` : cfg.label}</span>
      </p>
      <div className="prose-materi text-[15.5px] leading-relaxed">{children}</div>
    </aside>
  )
}

export function BatasValiditas({
  judul = 'Batas validitas & kapan rumus gagal',
  aturan,
  syarat,
  gagalJika,
  akibat,
}: {
  judul?: string
  aturan?: { rumus: string; berlakuJika: string; gagalJika: string; akibat?: string }[]
  syarat?: string[]
  gagalJika?: string
  akibat?: string
}) {
  const daftarAturan =
    aturan && aturan.length > 0
      ? aturan
      : syarat || gagalJika
        ? [
            {
              rumus: '',
              berlakuJika: (syarat ?? []).join(' · '),
              gagalJika: gagalJika ?? '',
              akibat,
            },
          ]
        : []

  return (
    <section className="not-prose my-6 rounded-[16px] border border-amber/35 bg-sunken/85 p-5">
      <div className="mb-3 flex items-center gap-2 font-mono text-[11.5px] font-semibold text-amber">
        <Icon nama="api" ukuran={15} />
        <span>{judul}</span>
      </div>
      <div className="space-y-3">
        {daftarAturan.map((a, idx) => (
          <div
            key={idx}
            className="rounded-[12px] border border-line/85 bg-surface/80 p-4"
          >
            {a.rumus && (
              <p className="mb-2.5 font-mono text-[14px] font-semibold text-ink">
                <TeksMath teks={a.rumus} />
              </p>
            )}
            <div className="grid gap-2.5 text-[13.5px] sm:grid-cols-2">
              {a.berlakuJika && (
                <div className="rounded-[8px] border border-hijau/25 bg-hijau-soft/15 px-3 py-2">
                  <p className="font-mono text-[11px] font-semibold text-hijau">● Berlaku jika</p>
                  <div className="mt-0.5 leading-relaxed text-ink/90">
                    {syarat && syarat.length > 1 && !aturan ? (
                      <ul className="list-disc space-y-1 pl-4">
                        {syarat.map((s, si) => (
                          <li key={si}>
                            <TeksMath teks={s} />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <TeksMath teks={a.berlakuJika} />
                    )}
                  </div>
                </div>
              )}
              {a.gagalJika && (
                <div className="rounded-[8px] border border-korall/30 bg-korall-soft/20 px-3 py-2">
                  <p className="font-mono text-[11px] font-semibold text-korall">▲ Gagal / bias jika</p>
                  <p className="mt-0.5 leading-relaxed text-ink/90">
                    <TeksMath teks={a.gagalJika} />
                  </p>
                </div>
              )}
            </div>
            {a.akibat && (
              <p className="mt-2 text-[13px] leading-relaxed text-muted">
                <span className="font-medium text-ink">Konsekuensi: </span>
                <TeksMath teks={a.akibat} />
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export function Miskonsepsi({
  judul = 'Miskonsepsi umum & cara mendeteksinya',
  daftar,
  items,
}: {
  judul?: string
  daftar?: { salah: string; kenapaKeliru: string; caraDeteksi: string; benar: string }[]
  items?: { salah: string; kenapaKeliru: string; caraDeteksi: string; benar: string }[]
}) {
  const list = daftar ?? items ?? []
  return (
    <section className="not-prose my-6 space-y-3">
      <div className="flex items-center gap-2 font-mono text-[11.5px] font-semibold text-amber">
        <Icon nama="silang" ukuran={14} />
        <span>{judul}</span>
      </div>
      {list.map((item, idx) => (
        <article
          key={idx}
          className="rounded-[14px] border border-line bg-surface/85 p-4 sm:p-5"
        >
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-[10px] border border-korall/35 bg-korall-soft/20 p-3.5">
              <p className="font-mono text-[11px] font-semibold text-korall">✕ Anggapan keliru</p>
              <p className="mt-1 text-[14.5px] leading-relaxed text-ink">
                <TeksMath teks={item.salah} />
              </p>
            </div>
            <div className="rounded-[10px] border border-hijau/35 bg-hijau-soft/20 p-3.5">
              <p className="font-mono text-[11px] font-semibold text-hijau">✓ Formulasi tepat</p>
              <p className="mt-1 text-[14.5px] leading-relaxed text-ink">
                <TeksMath teks={item.benar} />
              </p>
            </div>
          </div>
          <div className="mt-3 space-y-1.5 border-t border-line/70 pt-3 text-[13.5px] leading-relaxed text-muted">
            <p>
              <span className="font-medium text-ink">Mengapa keliru: </span>
              <TeksMath teks={item.kenapaKeliru} />
            </p>
            <p>
              <span className="font-medium text-cyan">Cara mendeteksi: </span>
              <TeksMath teks={item.caraDeteksi} />
            </p>
          </div>
        </article>
      ))}
    </section>
  )
}

const LABEL_TIPE_LATIHAN: Record<
  'konseptual' | 'derivasi' | 'fermi' | 'analisis_data' | 'terbuka',
  string
> = {
  konseptual: 'Konseptual',
  derivasi: 'Derivasi kalkulus/aljabar',
  fermi: 'Estimasi Fermi',
  analisis_data: 'Analisis data',
  terbuka: 'Masalah terbuka',
}

function ItemLatihanBertingkat({
  item,
  nomor,
  babId,
}: {
  item: {
    id: string
    tipe: 'konseptual' | 'derivasi' | 'fermi' | 'analisis_data' | 'terbuka'
    pertanyaan: string
    petunjuk?: string
    langkahKunci: string[]
    rubrik: string[]
  }
  nomor: number
  babId: string
}) {
  const keyRef = `latihan-${item.id}`
  const tersimpan = useStore((s) => s.state.bab[babId]?.refleksi?.[keyRef] ?? '')
  const simpan = useStore((s) => s.simpanRefleksi)
  const [teks, setTeks] = useState(tersimpan)
  const [bukaPetunjuk, setBukaPetunjuk] = useState(false)
  const [bukaKunci, setBukaKunci] = useState(false)

  useEffect(() => {
    if (teks === tersimpan) return
    const t = setTimeout(() => simpan(babId, keyRef, teks), 450)
    return () => clearTimeout(t)
  }, [teks, tersimpan, babId, keyRef, simpan])

  return (
    <article className="rounded-[14px] border border-line bg-surface/85 p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2 text-[12px] font-mono text-faint">
        <span className="text-cyan">
          Latihan {String(nomor).padStart(2, '0')} · {LABEL_TIPE_LATIHAN[item.tipe]}
        </span>
      </div>
      <div className="mt-2 text-[15.5px] leading-relaxed text-ink">
        <TeksMath teks={item.pertanyaan} />
      </div>

      <textarea
        value={teks}
        onChange={(e) => setTeks(e.target.value)}
        rows={3}
        placeholder="Tulis sketsa penurunan, estimasi orde besar, atau langkah kerjamu di sini (tersimpan otomatis)…"
        className="mt-3 w-full resize-y rounded-[10px] border border-line bg-sunken/70 px-3.5 py-2.5 font-mono text-[13.5px] leading-relaxed text-ink outline-none transition focus:border-cyan/60"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {item.petunjuk && (
          <button
            type="button"
            onClick={() => {
              mainkanSuara('pilih')
              setBukaPetunjuk((v) => !v)
            }}
            className="rounded-[8px] border border-line bg-sunken/60 px-3 py-1.5 text-[12.5px] font-medium text-muted transition hover:border-amber/50 hover:text-ink"
          >
            {bukaPetunjuk ? 'Sembunyikan petunjuk' : 'Tampilkan petunjuk'}
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            mainkanSuara('pilih')
            setBukaKunci((v) => !v)
          }}
          className="rounded-[8px] border border-cyan/35 bg-cyan-soft/35 px-3 py-1.5 text-[12.5px] font-medium text-cyan transition hover:border-cyan/60 hover:bg-cyan-soft/55"
        >
          {bukaKunci ? 'Tutup kunci & rubrik' : 'Buka kunci & rubrik penilaian'}
        </button>
      </div>

      {bukaPetunjuk && item.petunjuk && (
        <div className="anim-masuk mt-3 rounded-[10px] border border-amber/30 bg-amber-soft/20 px-3.5 py-2.5 text-[13.5px] leading-relaxed text-ink/90">
          <span className="font-mono text-[11.5px] font-semibold text-amber">Petunjuk: </span>
          <TeksMath teks={item.petunjuk} />
        </div>
      )}

      {bukaKunci && (
        <div className="anim-masuk mt-3 space-y-3 rounded-[12px] border border-cyan/25 bg-sunken/90 p-4">
          <div>
            <p className="font-mono text-[11.5px] font-semibold text-cyan">
              Kunci langkah penyelesaian
            </p>
            <ol className="mt-2 list-decimal space-y-1.5 pl-5 font-mono text-[13.25px] leading-relaxed text-ink/95">
              {item.langkahKunci.map((l, i) => (
                <li key={i}>
                  <TeksMath teks={l} />
                </li>
              ))}
            </ol>
          </div>
          {item.rubrik.length > 0 && (
            <div className="border-t border-line/70 pt-3">
              <p className="font-mono text-[11.5px] font-semibold text-hijau">Rubrik penilaian</p>
              <ul className="mt-1.5 list-disc space-y-1 pl-5 text-[13px] leading-relaxed text-muted">
                {item.rubrik.map((r, i) => (
                  <li key={i}>
                    <TeksMath teks={r} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </article>
  )
}

export function LatihanBertingkat({
  judul = 'Latihan bertingkat (konseptual → derivasi → Fermi → data → terbuka)',
  soal,
}: {
  judul?: string
  soal: {
    id: string
    tipe: 'konseptual' | 'derivasi' | 'fermi' | 'analisis_data' | 'terbuka'
    pertanyaan: string
    petunjuk?: string
    langkahKunci: string[]
    rubrik: string[]
  }[]
}) {
  const babId = gunakanBabId()
  return (
    <section id="latihan-bertingkat-section" className="not-prose my-6 space-y-4">
      <div className="flex items-center gap-2 font-mono text-[11.5px] font-semibold text-cyan">
        <Icon nama="latihan" ukuran={14} />
        <span>{judul}</span>
      </div>
      {soal.map((item, idx) => (
        <ItemLatihanBertingkat key={item.id} item={item} nomor={idx + 1} babId={babId} />
      ))}
    </section>
  )
}

const LABEL_TIPE_LOGIKA: Record<
  'kenapa' | 'apa_salah' | 'ubah_asumsi' | 'bandingkan_model' | 'prediksi_akibat',
  string
> = {
  kenapa: 'Kenapa?',
  apa_salah: 'Apa yang salah?',
  ubah_asumsi: 'Ubah asumsi',
  bandingkan_model: 'Bandingkan model',
  prediksi_akibat: 'Prediksi akibat',
}

interface ResponsAiLogika {
  skor: number
  benar: boolean
  ringkasan: string
  kekuatan: string[]
  perbaikan: string[]
  konsepTerlewat: string[]
}

function ItemUjianLogika({
  item,
  nomor,
  babId,
}: {
  item: {
    id: string
    tipe: 'kenapa' | 'apa_salah' | 'ubah_asumsi' | 'bandingkan_model' | 'prediksi_akibat'
    pertanyaan: string
    petunjuk?: string
    rubrik: string[]
    jawabanKunci: string
  }
  nomor: number
  babId: string
}) {
  const keyRef = `logika-${item.id}`
  const tersimpan = useStore((s) => s.state.bab[babId]?.refleksi?.[keyRef] ?? '')
  const simpan = useStore((s) => s.simpanRefleksi)
  const [teks, setTeks] = useState(tersimpan)
  const [bukaPetunjuk, setBukaPetunjuk] = useState(false)
  const [bukaKunci, setBukaKunci] = useState(false)
  const [memuatAi, setMemuatAi] = useState(false)
  const [galatAi, setGalatAi] = useState<string | null>(null)
  const [hasilAi, setHasilAi] = useState<ResponsAiLogika | null>(null)

  useEffect(() => {
    if (teks === tersimpan) return
    const t = setTimeout(() => simpan(babId, keyRef, teks), 450)
    return () => clearTimeout(t)
  }, [teks, tersimpan, babId, keyRef, simpan])

  async function evaluasiDenganAi() {
    if (teks.trim().length < 10) {
      setGalatAi('Tulis argumen logismu minimal beberapa kata sebelum meminta evaluasi AI.')
      return
    }
    mainkanSuara('pilih')
    setMemuatAi(true)
    setGalatAi(null)
    try {
      const res = await fetch('/api/evaluasi-esai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pertanyaan: `[Ujian Logika — ${LABEL_TIPE_LOGIKA[item.tipe]}] ${item.pertanyaan}`,
          topik: babById.get(babId)?.judul ?? babId.toUpperCase(),
          level: 'olimpiade',
          jawabanSiswa: teks.trim(),
          rubrik: item.rubrik.map((poin) => ({ poin, bobot: 1 })),
          jawabanTeladan: item.jawabanKunci,
          pembahasan: item.rubrik,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setGalatAi(data.error ?? 'Evaluator AI belum tersedia saat ini; gunakan rubrik mandiri.')
      } else {
        setHasilAi(data as ResponsAiLogika)
        mainkanSuara(data.benar ? 'benar' : 'salah')
      }
    } catch {
      setGalatAi('Tidak dapat menghubungi server evaluator AI. Gunakan rubrik mandiri.')
    } finally {
      setMemuatAi(false)
    }
  }

  return (
    <article className="rounded-[14px] border border-ungu/35 bg-surface/90 p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2 text-[12px] font-mono">
        <span className="font-semibold text-cyan">
          Ujian Logika {String(nomor).padStart(2, '0')} · {LABEL_TIPE_LOGIKA[item.tipe]}
        </span>
      </div>
      <p className="mt-2 text-[15.5px] font-medium leading-relaxed text-ink">
        <TeksMath teks={item.pertanyaan} />
      </p>

      <textarea
        value={teks}
        onChange={(e) => setTeks(e.target.value)}
        rows={4}
        placeholder="Uji logikamu: sebutkan definisi, asumsi yang terlibat, dan rantai sebab-akibat matematisnya…"
        className="mt-3 w-full resize-y rounded-[10px] border border-line bg-sunken/70 px-3.5 py-2.5 text-[14.5px] leading-relaxed text-ink outline-none transition focus:border-cyan/60"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {item.petunjuk && (
          <button
            type="button"
            onClick={() => {
              mainkanSuara('pilih')
              setBukaPetunjuk((v) => !v)
            }}
            className="rounded-[8px] border border-line bg-sunken/60 px-3 py-1.5 text-[12.5px] font-medium text-muted transition hover:border-amber/50 hover:text-ink"
          >
            {bukaPetunjuk ? 'Tutup petunjuk' : 'Petunjuk'}
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            mainkanSuara('pilih')
            setBukaKunci((v) => !v)
          }}
          className="rounded-[8px] border border-cyan/35 bg-cyan-soft/35 px-3 py-1.5 text-[12.5px] font-medium text-cyan transition hover:border-cyan/60 hover:bg-cyan-soft/55"
        >
          {bukaKunci ? 'Tutup rubrik & model' : 'Lihat rubrik & jawaban model'}
        </button>
        <button
          type="button"
          onClick={() => void evaluasiDenganAi()}
          disabled={memuatAi}
          className="inline-flex items-center gap-1.5 rounded-[8px] border border-ungu/45 bg-ungu-soft/45 px-3 py-1.5 text-[12.5px] font-medium text-ink transition hover:border-ungu/75 disabled:opacity-50"
        >
          <Icon nama="ai" ukuran={14} />
          <span>{memuatAi ? 'Mengevaluasi…' : 'Evaluasi argumen (AI)'}</span>
        </button>
      </div>

      {bukaPetunjuk && item.petunjuk && (
        <div className="anim-masuk mt-3 rounded-[10px] border border-amber/30 bg-amber-soft/20 px-3.5 py-2.5 text-[13.5px] leading-relaxed text-ink/90">
          <span className="font-mono text-[11.5px] font-semibold text-amber">Petunjuk: </span>
          <TeksMath teks={item.petunjuk} />
        </div>
      )}

      {galatAi && (
        <p className="mt-3 rounded-[10px] border border-amber/35 bg-amber-soft/20 px-3.5 py-2 text-[13px] text-amber">
          {galatAi}
        </p>
      )}

      {hasilAi && (
        <div className="anim-masuk mt-3 space-y-2 rounded-[12px] border border-ungu/35 bg-sunken/85 p-4 text-[13.5px]">
          <div className="flex items-center justify-between">
            <span className={clsx('font-mono text-[12px] font-semibold', hasilAi.benar ? 'text-hijau' : 'text-amber')}>
              {hasilAi.benar ? '✓ Argumen kuat' : '▲ Perlu penajaman'}
            </span>
            <span className="font-mono text-[12px] tabular-nums text-muted">
              Skor rubrik: {Math.round(hasilAi.skor * 100)}%
            </span>
          </div>
          <p className="leading-relaxed text-ink">{hasilAi.ringkasan}</p>
          {hasilAi.perbaikan.length > 0 && (
            <ul className="list-disc space-y-1 pl-5 text-muted">
              {hasilAi.perbaikan.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {bukaKunci && (
        <div className="anim-masuk mt-3 space-y-3 rounded-[12px] border border-cyan/25 bg-sunken/90 p-4">
          <div>
            <p className="font-mono text-[11.5px] font-semibold text-cyan">Jawaban model</p>
            <p className="mt-1.5 text-[14px] leading-relaxed text-ink/95">
              <TeksMath teks={item.jawabanKunci} />
            </p>
          </div>
          <div className="border-t border-line/70 pt-3">
            <p className="font-mono text-[11.5px] font-semibold text-hijau">
              Kriteria kebenaran (rubrik)
            </p>
            <ul className="mt-1.5 list-disc space-y-1 pl-5 text-[13px] leading-relaxed text-muted">
              {item.rubrik.map((r, i) => (
                <li key={i}>
                  <TeksMath teks={r} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </article>
  )
}

export function UjianLogika({
  judul = 'Ujian logika & uji batas asumsi',
  items,
}: {
  judul?: string
  items: {
    id: string
    tipe: 'kenapa' | 'apa_salah' | 'ubah_asumsi' | 'bandingkan_model' | 'prediksi_akibat'
    pertanyaan: string
    petunjuk?: string
    rubrik: string[]
    jawabanKunci: string
  }[]
}) {
  const babId = gunakanBabId()
  return (
    <section id="ujian-logika-section" className="not-prose my-6 space-y-4">
      <div className="flex items-center gap-2 font-mono text-[11.5px] font-semibold text-cyan">
        <Icon nama="target" ukuran={14} />
        <span>{judul}</span>
      </div>
      {items.map((item, idx) => (
        <ItemUjianLogika key={item.id} item={item} nomor={idx + 1} babId={babId} />
      ))}
    </section>
  )
}

const LABEL_GERBANG: Record<string, string> = {
  derivasi: 'Derivasi',
  logika: 'Logika',
  fermi: 'Fermi',
  observasi: 'Observasi',
  konsep: 'Konsep',
}

const EMPTY_MASTERY_MAP: Record<string, boolean> = {}

export function ChecklistMastery({
  judul = 'Checklist penguasaan modul (self-audit)',
  items,
}: {
  judul?: string
  items: { id: string; teks: string; gerbang: 'derivasi' | 'logika' | 'fermi' | 'observasi' | 'konsep' }[]
}) {
  const babId = gunakanBabId()
  const masteryMap = useStore((s) => s.state.bab[babId]?.masteryChecklist ?? EMPTY_MASTERY_MAP)
  const toggleMasteryItem = useStore((s) => s.toggleMasteryItem)
  const selesai = items.filter((item) => Boolean(masteryMap[item.id])).length

  return (
    <section id="checklist-mastery" className="not-prose my-6 rounded-[16px] border border-hijau/30 bg-surface/85 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-mono text-[11.5px] font-semibold text-hijau">
          <Icon nama="cek" ukuran={15} />
          <span>{judul}</span>
        </div>
        <span className="font-mono text-[12px] tabular-nums text-muted">
          {selesai}/{items.length} tercentang
        </span>
      </div>

      <ul className="mt-3.5 space-y-2">
        {items.map((item) => {
          const aktif = Boolean(masteryMap[item.id])
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => {
                  mainkanSuara(aktif ? 'pilih' : 'benar')
                  toggleMasteryItem(babId, item.id)
                }}
                aria-pressed={aktif}
                className={clsx(
                  'flex w-full items-start gap-3 rounded-[10px] border px-3.5 py-2.5 text-left transition',
                  aktif
                    ? 'border-hijau/45 bg-hijau-soft/25 text-ink'
                    : 'border-line bg-sunken/50 text-ink/90 hover:border-ungu/45',
                )}
              >
                <span
                  className={clsx(
                    'mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-[4px] border',
                    aktif
                      ? 'border-hijau bg-hijau text-[#06210f]'
                      : 'border-line bg-surface',
                  )}
                >
                  {aktif && <Icon nama="cek" ukuran={12} />}
                </span>
                <span className="flex-1 text-[14px] leading-relaxed">
                  <span className="mr-2 font-mono text-[11.5px] text-cyan">
                    {LABEL_GERBANG[item.gerbang]} ·
                  </span>
                  <span className={aktif ? 'line-through opacity-75' : ''}>
                    <TeksMath teks={item.teks} />
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export function ReferensiSumber({
  sumberIds,
  pemetaan = [],
  catatan,
}: {
  sumberIds: string[]
  pemetaan?: { sumberId: string; rujukan: string }[]
  catatan?: string
}) {
  const petaRujukan = new Map(pemetaan.map((p) => [p.sumberId, p.rujukan]))

  return (
    <section className="not-prose my-6 rounded-[16px] border border-line bg-sunken/75 p-5">
      <div className="mb-3 flex items-center gap-2 font-mono text-[11.5px] font-semibold text-cyan">
        <Icon nama="referensi" ukuran={15} />
        <span>Referensi akademik & tautan Source Ledger</span>
      </div>

      <ul className="space-y-2.5">
        {sumberIds.map((sid) => {
          const s = SUMBER_LEDGER[sid]
          if (!s) return null
          const detail = petaRujukan.get(sid)
          return (
            <li
              key={sid}
              className="rounded-[10px] border border-line/80 bg-surface/75 px-3.5 py-2.5 text-[13.5px]"
            >
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 font-mono text-[11.5px] text-faint">
                <span className="font-semibold text-cyan">{s.id}</span>
                <span aria-hidden="true">·</span>
                <span>{s.jenis}</span>
                <span aria-hidden="true">·</span>
                <span>Akses {s.tanggalAkses}</span>
              </div>
              <p className="mt-0.5 font-medium text-ink">{s.judul}</p>
              <p className="text-[12.5px] text-muted">
                {s.penulisInstitusi} — <span className="font-mono">{s.identitas}</span>
              </p>
              {detail && (
                <p className="mt-1 text-[12.5px] text-cyan/90">
                  Cakupan bab ini: {detail}
                </p>
              )}
            </li>
          )
        })}
      </ul>

      {catatan && (
        <p className="mt-3 border-t border-line/70 pt-3 text-[13px] leading-relaxed text-muted">
          {catatan}
        </p>
      )}
    </section>
  )
}

export function Tujuan({ children }: { children: ReactNode }) {
  return (
    <section className="not-prose my-6 rounded-[16px] border border-ungu/30 bg-gradient-to-br from-ungu-soft/75 via-surface/90 to-sunken/90 p-5 shadow-[0_6px_24px_rgb(5_4_18/0.35)]">
      <div className="mb-2.5 flex items-center gap-2 text-[11.5px] font-mono font-semibold uppercase tracking-[0.14em] text-cyan">
        <Icon nama="target" ukuran={15} />
        <span>Target penguasaan bab</span>
      </div>
      <div className="prose-materi text-[15.5px] [&_li]:text-ink/95 [&_strong]:bg-none [&_strong]:p-0 [&_strong]:text-ink [&_strong]:shadow-none [&_ul]:mt-1">
        {children}
      </div>
    </section>
  )
}

export function Prasyarat({ babIds = [] }: { babIds?: string[] }) {
  const state = useStore((s) => s.state)
  if (babIds.length === 0) {
    return (
      <p className="not-prose my-4 text-[14px] text-faint">
        Tidak ada prasyarat — cocok jadi titik awal.
      </p>
    )
  }
  return (
    <div className="not-prose my-4 flex flex-wrap items-center gap-2">
      <span className="text-[13px] text-faint">Prasyarat:</span>
      {babIds.map((id) => {
        const bab = babById.get(id)
        if (!bab) return null
        const status = statusBab(bab, state)
        return (
          <Link key={id} to={bab.tersedia ? `/bab/${id}` : '/peta'} className="no-underline">
            <Chip variasi={status === 'dikuasai' ? 'olive' : 'netral'}>
              {bab.judul}
              {status === 'dikuasai' ? ' · selesai' : ''}
            </Chip>
          </Link>
        )
      })}
    </div>
  )
}

export function Poin({
  judul,
  defaultOpen = true,
  children,
}: {
  judul: string
  defaultOpen?: boolean
  children: ReactNode
}) {
  const [buka, setBuka] = useState(defaultOpen)
  return (
    <section className="not-prose kartu my-5 overflow-hidden border-line/90">
      <button
        type="button"
        onClick={() => setBuka((b) => !b)}
        aria-expanded={buka}
        className={clsx(
          'flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-sunken/50',
          buka && 'border-b border-line/70 bg-sunken/35',
        )}
      >
        <span className="font-display text-[1.12rem] font-semibold leading-snug text-ink">
          {judul}
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11.5px] font-mono text-faint">
          <span className="hidden sm:inline">{buka ? 'Tutup' : 'Buka'}</span>
          <Icon
            nama="chevron"
            ukuran={18}
            className={clsx('shrink-0 text-cyan/80 transition-transform', buka && 'rotate-180')}
          />
        </span>
      </button>
      {buka && (
        <div className="anim-masuk prose-materi px-5 pb-6 pt-5 text-[16.5px] sm:px-6">
          {children}
        </div>
      )}
    </section>
  )
}

export function Contoh({
  judul,
  olimpiade = false,
  children,
}: {
  judul?: string
  olimpiade?: boolean
  children: ReactNode
}) {
  const semuaAnak = Children.toArray(children).filter(isValidElement)
  const soalPengantar: ReactElement[] = []
  const langkah: ReactElement[] = []

  for (const el of semuaAnak) {
    const punyaNomor = Boolean(el.props && typeof el.props === 'object' && 'nomor' in el.props)
    if (el.type === Langkah || punyaNomor || langkah.length > 0) {
      langkah.push(el)
    } else {
      soalPengantar.push(el)
    }
  }

  const [tampil, setTampil] = useState(1)
  const semuaTerbuka = tampil >= langkah.length

  function bukaSemuaAtauRingkas() {
    mainkanSuara('pilih')
    setTampil(semuaTerbuka ? 1 : langkah.length)
  }

  return (
    <section className="not-prose proses-pengerjaan my-6 overflow-hidden rounded-[16px] border border-cyan/30 bg-sunken/90 shadow-[0_8px_28px_rgb(4_6_20/0.45)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan/20 bg-surface/85 px-5 py-3.5">
        <div className="min-w-0">
          <p className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan">
            <Icon nama="kalkulator" ukuran={14} />
            <span>{olimpiade ? 'Rantai olimpiade · Proses pengerjaan' : 'Proses pengerjaan'}</span>
          </p>
          {judul && (
            <p className="mt-1 font-display text-[1.08rem] font-semibold leading-snug text-ink">
              {judul}
            </p>
          )}
        </div>

        {langkah.length > 1 && (
          <button
            type="button"
            onClick={bukaSemuaAtauRingkas}
            className="shrink-0 rounded-lg border border-cyan/30 bg-cyan-soft/45 px-2.5 py-1 font-mono text-[11.5px] font-medium text-cyan transition hover:border-cyan/60 hover:bg-cyan-soft/75"
          >
            {semuaTerbuka ? 'Mode bertahap' : `Buka semua (${langkah.length})`}
          </button>
        )}
      </div>

      <div className="p-5 sm:p-6">
        {soalPengantar.length > 0 && (
          <div className="mb-5 rounded-[12px] border border-line/90 bg-surface/75 px-4 py-3 text-[15px] leading-relaxed text-ink/95 [&_strong]:text-cyan">
            {soalPengantar}
          </div>
        )}

        <div className="space-y-4">
          {langkah.slice(0, tampil).map((el, i) =>
            isValidElement(el)
              ? cloneElement(
                  el as ReactElement<{ no?: number; nomor?: number; isLast?: boolean }>,
                  {
                    no: i + 1,
                    isLast: i === Math.min(tampil, langkah.length) - 1,
                    key: i,
                  },
                )
              : el,
          )}
        </div>

        {tampil < langkah.length && (
          <div className="mt-5 flex items-center justify-between gap-3 border-t border-cyan/15 pt-4">
            <span className="font-mono text-[12px] text-faint tabular-nums">
              Langkah {tampil} dari {langkah.length}
            </span>
            <button
              type="button"
              onClick={() => {
                mainkanSuara('pilih')
                setTampil((n) => Math.min(n + 1, langkah.length))
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-cyan/40 bg-cyan-soft/60 px-3.5 py-1.5 font-mono text-[12.5px] font-medium text-cyan transition hover:border-cyan/70 hover:bg-cyan-soft"
            >
              Langkah berikutnya <Icon nama="panah" ukuran={14} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export function Langkah({
  no,
  nomor,
  isLast = false,
  children,
}: {
  no?: number
  nomor?: number
  isLast?: boolean
  children: ReactNode
}) {
  const indeks = no ?? nomor
  const labelAngka = typeof indeks === 'number' ? String(indeks).padStart(2, '0') : '··'

  return (
    <div className="anim-masuk flex gap-3.5">
      <div className="flex shrink-0 flex-col items-center">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan/40 bg-cyan-soft/75 font-mono text-[11.5px] font-semibold text-cyan tabular-nums">
          {labelAngka}
        </span>
        {!isLast && <span className="mt-1.5 w-px flex-1 bg-cyan/20" aria-hidden="true" />}
      </div>
      <div className="langkah-isi min-w-0 flex-1 pb-1 pt-0.5">{children}</div>
    </div>
  )
}

export function Refleksi({
  id = 'refleksi-utama',
  pertanyaan,
  children,
}: {
  id?: string
  pertanyaan?: string
  children?: ReactNode
}) {
  const babId = gunakanBabId()
  const tersimpan = useStore((s) => s.state.bab[babId]?.refleksi?.[id] ?? '')
  const simpan = useStore((s) => s.simpanRefleksi)
  const [teks, setTeks] = useState(tersimpan)
  const [status, setStatus] = useState<'idle' | 'menyimpan' | 'tersimpan'>('idle')

  useEffect(() => {
    if (teks === tersimpan) return
    setStatus('menyimpan')
    const t = setTimeout(() => {
      simpan(babId, id, teks)
      setStatus('tersimpan')
    }, 450)
    return () => clearTimeout(t)
  }, [teks, tersimpan, babId, id, simpan])

  return (
    <section className="not-prose my-6 rounded-[16px] border border-dashed border-ungu/45 bg-ungu-soft/30 p-5">
      <p className="mb-2 flex items-center gap-2 font-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-cyan">
        <Icon nama="bintang" ukuran={14} /> Renungkan sebentar
      </p>
      {pertanyaan ? (
        <p className="mb-3 text-[16px] leading-relaxed text-ink">
          <TeksMath teks={pertanyaan} />
        </p>
      ) : (
        children && <div className="prose-materi mb-3 text-[16px] leading-relaxed">{children}</div>
      )}
      <textarea
        value={teks}
        onChange={(e) => setTeks(e.target.value)}
        rows={3}
        placeholder="Tulis pemahamanmu dengan kata-katamu sendiri…"
        className="w-full resize-y rounded-[10px] border border-line bg-surface px-3.5 py-3 text-[15.5px] outline-none transition focus:border-cyan/60"
      />
      <p className="mt-1.5 h-4 text-[12px] text-faint">
        {status === 'menyimpan'
          ? 'Menyimpan…'
          : status === 'tersimpan'
            ? 'Tersimpan di perangkatmu.'
            : '\u00a0'}
      </p>
    </section>
  )
}

export function CekPaham({
  id,
  pertanyaan,
  opsi,
  jawaban,
  penjelasan,
}: {
  id: string
  pertanyaan: string
  opsi: string[]
  jawaban: number
  penjelasan?: string
}) {
  const babId = gunakanBabId()
  const simpan = useStore((s) => s.simpanCheckpoint)
  const [dipilih, setDipilih] = useState<number | null>(null)
  const sudah = dipilih !== null
  const benar = dipilih === jawaban

  function pilih(i: number) {
    if (sudah) return
    setDipilih(i)
    const tepat = i === jawaban
    mainkanSuara(tepat ? 'benar' : 'salah')
    simpan(babId, id, tepat)
  }

  return (
    <section
      id={id ? `cek-paham-${id}` : 'cek-pemahaman-section'}
      data-anchor="cek-pemahaman"
      className="not-prose kartu my-6 p-5 scroll-mt-24"
    >
      <p className="mb-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-amber">
        Cek pemahaman cepat
      </p>
      <p className="mb-3.5 text-[16px] font-medium leading-relaxed text-ink">
        <TeksMath teks={pertanyaan} />
      </p>
      <div className="space-y-2">
        {opsi.map((o, i) => {
          const terpilih = dipilih === i
          const kunci = sudah && i === jawaban
          return (
            <button
              key={i}
              type="button"
              onClick={() => pilih(i)}
              disabled={sudah}
              className={clsx(
                'flex w-full items-start gap-3 rounded-[10px] border px-3.5 py-2.5 text-left text-[15px] transition',
                kunci
                  ? 'border-hijau/60 bg-hijau-soft/70'
                  : terpilih
                    ? 'border-korall/50 bg-korall-soft'
                    : 'border-line bg-surface hover:border-ungu/45',
                sudah && !kunci && !terpilih && 'opacity-60',
              )}
            >
              <span className="mt-0.5 font-mono text-[12px] font-semibold text-faint">
                {'ABCDEF'[i]}
              </span>
              <span className="flex-1">
                <TeksMath teks={o} />
              </span>
              {kunci && <Icon nama="cek" ukuran={16} className="mt-1 text-hijau" />}
              {terpilih && !kunci && <Icon nama="silang" ukuran={16} className="mt-1 text-korall" />}
            </button>
          )
        })}
      </div>
      {sudah && (
        <p className="anim-masuk mt-3 rounded-[10px] border border-line/80 bg-sunken px-3.5 py-2.5 text-[14px] leading-relaxed text-muted">
          <span className={clsx('font-semibold', benar ? 'text-hijau' : 'text-amber')}>
            {benar ? 'Tepat. ' : 'Belum tepat. '}
          </span>
          {penjelasan && <TeksMath teks={penjelasan} />}
        </p>
      )}
    </section>
  )
}

export function Figure({
  judul,
  caption,
  children,
}: {
  judul?: string
  caption?: string
  children: ReactNode
}) {
  return (
    <figure className="not-prose my-6 rounded-[14px] border border-line bg-sunken/50 p-4">
      {judul && <p className="mb-2 font-mono text-[12px] font-medium text-cyan/90">{judul}</p>}
      <div>{children}</div>
      {caption && (
        <figcaption className="mt-2.5 text-[13px] leading-relaxed text-muted">{caption}</figcaption>
      )}
    </figure>
  )
}

export function Rumus({
  judul,
  children,
}: {
  judul?: string
  children: ReactNode
}) {
  return (
    <div className="not-prose rumus-stage">
      {judul && (
        <p className="mb-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan">
          {judul}
        </p>
      )}
      <div className="text-center">{children}</div>
    </div>
  )
}

export function Catatan({
  variasi = 'info',
  judul,
  children,
}: {
  variasi?: 'info' | 'tips' | 'awas'
  judul?: string
  children: ReactNode
}) {
  const konfigurasi = {
    info: {
      kartu: 'border-info/35 bg-gradient-to-br from-info-soft/75 to-surface/85',
      labelWarna: 'text-info',
      labelDefault: 'Catatan penting',
      ikon: 'bintang' as const,
      stabiloWarna: 'text-info',
    },
    tips: {
      kartu: 'border-hijau/35 bg-gradient-to-br from-hijau-soft/65 to-surface/85',
      labelWarna: 'text-hijau',
      labelDefault: 'Tips olimpiade',
      ikon: 'target' as const,
      stabiloWarna: 'text-hijau',
    },
    awas: {
      kartu: 'border-amber/40 bg-gradient-to-br from-amber-soft/75 to-surface/85',
      labelWarna: 'text-amber',
      labelDefault: 'Waspada jebakan',
      ikon: 'api' as const,
      stabiloWarna: 'text-amber',
    },
  }[variasi]

  return (
    <aside className={clsx('not-prose my-5 rounded-[14px] border p-4 sm:px-5', konfigurasi.kartu)}>
      <div
        className={clsx(
          'mb-1.5 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em]',
          konfigurasi.labelWarna,
        )}
      >
        <Icon nama={konfigurasi.ikon} ukuran={14} />
        <span>{judul ?? konfigurasi.labelDefault}</span>
      </div>
      <div className="prose-materi text-[15.5px] leading-relaxed">{children}</div>
    </aside>
  )
}

export function Konstanta({
  data,
}: {
  data: { simbol: string; nilai: string; satuan?: string }[]
}) {
  return (
    <div className="not-prose my-5 overflow-x-auto rounded-[12px] border border-line bg-surface/80">
      <table className="w-full text-[14.5px]">
        <thead>
          <tr className="bg-sunken/85 text-left font-mono text-[11px] uppercase tracking-[0.1em] text-cyan/90">
            <th className="px-4 py-2.5 font-semibold">Besaran</th>
            <th className="px-4 py-2.5 font-semibold">Nilai</th>
            <th className="px-4 py-2.5 font-semibold">Satuan</th>
          </tr>
        </thead>
        <tbody>
          {data.map((k, i) => (
            <tr
              key={`${k.simbol}-${k.satuan ?? ''}-${i}`}
              className="border-t border-line/80 transition hover:bg-sunken/45"
            >
              <td className="px-4 py-2.5 font-medium text-ink">{k.simbol}</td>
              <td className="px-4 py-2.5 font-mono text-[13.5px] tabular-nums text-amber">
                {k.nilai}
              </td>
              <td className="px-4 py-2.5 font-mono text-[13px] text-muted">{k.satuan ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const komponenMDX = {
  h1: (p: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="mt-2 text-[1.9rem] leading-tight" {...p} />
  ),
  h2: (p: React.HTMLAttributes<HTMLHeadingElement>) => <h2 {...p} />,
  h3: (p: React.HTMLAttributes<HTMLHeadingElement>) => <h3 {...p} />,
  p: (p: React.HTMLAttributes<HTMLParagraphElement>) => <p {...p} />,
  ul: (p: React.HTMLAttributes<HTMLUListElement>) => <ul {...p} />,
  ol: (p: React.HTMLAttributes<HTMLOListElement>) => <ol {...p} />,
  li: (p: React.HTMLAttributes<HTMLLIElement>) => <li {...p} />,
  a: (p: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...p} />,
  strong: (p: React.HTMLAttributes<HTMLElement>) => <strong {...p} />,
  em: (p: React.HTMLAttributes<HTMLElement>) => <em {...p} />,
  mark: (p: React.HTMLAttributes<HTMLElement>) => <mark {...p} />,
  blockquote: (p: React.HTMLAttributes<HTMLQuoteElement>) => <blockquote {...p} />,
  hr: () => <hr />,
  table: (p: React.HTMLAttributes<HTMLTableElement>) => <table {...p} />,
  thead: (p: React.HTMLAttributes<HTMLTableSectionElement>) => <thead {...p} />,
  tbody: (p: React.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...p} />,
  tr: (p: React.HTMLAttributes<HTMLTableRowElement>) => <tr {...p} />,
  th: (p: React.HTMLAttributes<HTMLTableCellElement>) => <th {...p} />,
  td: (p: React.HTMLAttributes<HTMLTableCellElement>) => <td {...p} />,
  Bagian,
  IdentitasModul,
  PetaKonsep,
  Epistemik,
  BatasValiditas,
  Miskonsepsi,
  LatihanBertingkat,
  UjianLogika,
  ChecklistMastery,
  ReferensiSumber,
  Tujuan,
  Prasyarat,
  Poin,
  Contoh,
  Langkah,
  Refleksi,
  CekPaham,
  Figure,
  Gambar,
  VisualParametrik,
  Interaktif,
  Rumus,
  Catatan,
  Konstanta,
  Sorot,
}
