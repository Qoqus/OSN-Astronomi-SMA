import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import clsx from 'clsx'
import { useStore } from '@/state/user-store'
import { TIER_LABEL, babById } from '../../content/index'
import { soalUntukBab } from '@/lib/soal'
import { sesiKuisBab } from '@/lib/quiz-builder'
import { rincianPenguasaanBab, statusBab } from '@/lib/chapter-status'
import { mainkanSuara } from '@/lib/sound'
import { LessonLoader } from '@/mdx/LessonLoader'
import { TopBar } from '@/components/ui/TopBar'
import { Chip } from '@/components/ui/Chip'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { PanelGerbangKesiapan } from '@/components/bab/PanelGerbangKesiapan'

interface TocItem {
  id: string
  judul: string
  tag?: string
}

function buatSlug(teks: string, indeks: number): string {
  const dasar = teks
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return dasar || `bagian-${indeks + 1}`
}

export function Bab() {
  const { babId = '' } = useParams()
  const bab = babById.get(babId)
  const state = useStore((s) => s.state)
  const bukaBab = useStore((s) => s.bukaBab)
  const toggleSubBabSelesai = useStore((s) => s.toggleSubBabSelesai)
  const mulaiSesi = useStore((s) => s.mulaiSesi)
  const navigate = useNavigate()

  const wadahMateriRef = useRef<HTMLDivElement | null>(null)
  const [daftarIsi, setDaftarIsi] = useState<TocItem[]>([])
  const [bagianAktif, setBagianAktif] = useState<string>('')

  const soal = useMemo(() => (bab ? soalUntukBab(bab) : []), [bab?.id])

  useEffect(() => {
    if (bab?.tersedia) bukaBab(bab.id)
  }, [bab?.id, bab?.tersedia, bukaBab])

  useEffect(() => {
    const akar = wadahMateriRef.current
    if (!akar || !bab?.tersedia) {
      setDaftarIsi([])
      return
    }

    let observer: IntersectionObserver | null = null

    const indeksUlang = () => {
      const elemenBagian = Array.from(akar.querySelectorAll<HTMLElement>('[data-toc-bagian]'))
      const targetElemen: HTMLElement[] =
        elemenBagian.length > 0
          ? elemenBagian
          : Array.from(akar.querySelectorAll<HTMLElement>('.prose-materi > h2, .prose-materi h2'))

      const seen = new Set<string>()
      const items: TocItem[] = []

      targetElemen.forEach((el, idx) => {
        const judul =
          el.getAttribute('data-toc-bagian')?.trim() ||
          el.textContent?.trim() ||
          `Bagian ${idx + 1}`
        const tag = el.getAttribute('data-toc-tag')?.trim() || undefined
        let id = el.id || buatSlug(judul, idx)
        if (seen.has(id)) id = `${id}-${idx + 1}`
        seen.add(id)
        if (!el.id) el.id = id
        items.push({ id, judul, tag })
      })

      setDaftarIsi((prev) => {
        if (
          prev.length === items.length &&
          prev.every(
            (p, i) =>
              p.id === items[i].id && p.judul === items[i].judul && p.tag === items[i].tag,
          )
        ) {
          return prev
        }
        return items
      })
      if (items.length > 0) {
        setBagianAktif((prev) => (items.some((x) => x.id === prev) ? prev : items[0].id))
      }

      if (observer) observer.disconnect()
      if (targetElemen.length > 0) {
        observer = new IntersectionObserver(
          (entries) => {
            const tampak = entries
              .filter((e) => e.isIntersecting)
              .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
            if (tampak.length > 0 && tampak[0].target instanceof HTMLElement) {
              setBagianAktif(tampak[0].target.id)
            }
          },
          { rootMargin: '-96px 0px -65% 0px', threshold: 0.01 },
        )
        targetElemen.forEach((el) => observer?.observe(el))
      }
    }

    indeksUlang()
    const mo = new MutationObserver(() => indeksUlang())
    mo.observe(akar, { childList: true, subtree: true })

    return () => {
      mo.disconnect()
      if (observer) observer.disconnect()
    }
  }, [bab?.id, bab?.tersedia])

  function gulirKeBagian(id: string) {
    mainkanSuara('pilih')
    setBagianAktif(id)
    let target = document.getElementById(id)
    if (!target && wadahMateriRef.current) {
      target =
        wadahMateriRef.current.querySelector<HTMLElement>(`[data-toc-bagian*="${id}"]`) ||
        wadahMateriRef.current.querySelector<HTMLElement>(`[id*="${id}"]`)
    }
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      target.classList.add('ring-2', 'ring-cyan', 'ring-offset-2', 'ring-offset-bg')
      setTimeout(() => target?.classList.remove('ring-2', 'ring-cyan', 'ring-offset-2', 'ring-offset-bg'), 2400)
    }
  }

  function lompatKeSubBab(sb: { id: string; judul: string }, idx: number) {
    mainkanSuara('pilih')
    let target = document.getElementById(sb.id)
    if (!target && wadahMateriRef.current) {
      const sections = Array.from(
        wadahMateriRef.current.querySelectorAll<HTMLElement>('section[data-toc-bagian]'),
      )
      target =
        sections.find((s) => {
          const judul = s.getAttribute('data-toc-bagian')?.toLowerCase() ?? ''
          const id = s.id.toLowerCase()
          return id === sb.id.toLowerCase() || judul.includes(sb.judul.toLowerCase().slice(0, 10))
        }) || sections[idx] || null
    }
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      target.classList.add('ring-2', 'ring-cyan', 'ring-offset-2', 'ring-offset-bg')
      setTimeout(() => target?.classList.remove('ring-2', 'ring-cyan', 'ring-offset-2', 'ring-offset-bg'), 2400)
    }
  }

  if (!bab) {
    return (
      <div>
        <TopBar judul="Materi" />
        <div className="kartu p-6">
          <p className="font-display text-[1.3rem]">Bab tidak ditemukan.</p>
          <p className="mt-1.5 text-[15px] text-muted">Mungkin tautannya salah.</p>
          <Link to="/peta" className="mt-4 inline-block">
            <Button variasi="garis">Kembali ke peta</Button>
          </Link>
        </div>
      </div>
    )
  }

  const status = statusBab(bab, state)
  const rincian = rincianPenguasaanBab(bab, state)
  const subBabSelesai = state.bab[bab.id]?.subBabSelesai ?? []

  function mulaiKuis() {
    if (!bab) return
    const sesi = sesiKuisBab(`Kuis: ${bab.judul}`, bab.id, soal)
    if (sesi) {
      mulaiSesi(sesi)
      navigate('/kuis')
    }
  }

  return (
    <div className="anim-masuk pb-24 md:pb-0">
      <TopBar
        judul={`${bab.kode} · ${TIER_LABEL[bab.tier]}`}
        kanan={
          status === 'dikuasai' ? (
            <Chip variasi="olive">dikuasai</Chip>
          ) : status === 'sedang' ? (
            <Chip>sedang berjalan</Chip>
          ) : undefined
        }
      />

      <header className="mb-6">
        <h1 className="text-[2rem] leading-tight">{bab.judul}</h1>
        <p className="mt-2 max-w-[66ch] text-[15.5px] leading-relaxed text-muted">{bab.ringkas}</p>
        <p className="mt-3 text-[13px] text-faint">
          ± {bab.estimasiMenit} menit membaca · {soal.length} soal latihan
        </p>
      </header>

      {bab.tersedia ? (
        <>
          <section className="mb-6 space-y-4">
            <PanelGerbangKesiapan
              bab={bab}
              state={state}
              soalCount={soal.length}
              onMulaiKuis={mulaiKuis}
              onGulirKeBagian={gulirKeBagian}
            />

            {bab.subBab.length > 0 && (
              <div className="kartu p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-faint">
                      Daftar sub-bab materi
                    </p>
                    <span className="text-[12px] tabular-nums text-muted">
                      {subBabSelesai.length}/{bab.subBab.length} selesai
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      mainkanSuara('pilih')
                      const firstSec = wadahMateriRef.current?.querySelector<HTMLElement>(
                        'section[data-toc-bagian], .prose-materi section',
                      )
                      if (firstSec) {
                        firstSec.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        firstSec.classList.add('ring-2', 'ring-cyan', 'ring-offset-2', 'ring-offset-bg')
                        setTimeout(() => firstSec.classList.remove('ring-2', 'ring-cyan', 'ring-offset-2', 'ring-offset-bg'), 2400)
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-[8px] border border-cyan/40 bg-cyan-soft/40 px-3 py-1 font-mono text-[12px] font-semibold text-cyan transition hover:border-cyan hover:bg-cyan-soft/70 active:scale-[0.98]"
                  >
                    <span>Mulai Baca Materi</span>
                    <Icon nama="panah" ukuran={12} className="rotate-90" />
                  </button>
                </div>
                <div className="mt-2.5">
                  <ProgressBar
                    nilai={subBabSelesai.length / bab.subBab.length}
                    label="Progres sub-bab"
                  />
                </div>
                <ul className="mt-3.5 grid gap-2 sm:grid-cols-2">
                  {bab.subBab.map((sb, idx) => {
                    const selesai = subBabSelesai.includes(sb.id)
                    return (
                      <li
                        key={sb.id}
                        className="group flex items-center gap-2 rounded-[10px] border border-line/75 bg-surface/70 px-2.5 py-2 transition hover:border-cyan/50 hover:bg-sunken/60"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            mainkanSuara(selesai ? 'pilih' : 'benar')
                            toggleSubBabSelesai(bab.id, sb.id)
                          }}
                          aria-label={`Tandai ${sb.judul} ${selesai ? 'belum selesai' : 'selesai'}`}
                          title={selesai ? 'Tandai belum selesai' : 'Tandai selesai'}
                          className={clsx(
                            'flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-[5px] border transition',
                            selesai
                              ? 'border-hijau bg-hijau text-[#06210f]'
                              : 'border-line bg-surface hover:border-cyan',
                          )}
                        >
                          {selesai && <Icon nama="cek" ukuran={11} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => lompatKeSubBab(sb, idx)}
                          className="flex min-w-0 flex-1 items-center justify-between text-left"
                        >
                          <span
                            className={clsx(
                              'truncate text-[13.5px] transition',
                              selesai ? 'text-muted line-through opacity-75' : 'text-ink group-hover:text-cyan',
                            )}
                          >
                            <span className="mr-1.5 font-mono text-[11px] text-faint">
                              {idx + 1}.
                            </span>
                            {sb.judul}
                          </span>
                          <span className="shrink-0 pl-1 font-mono text-[11px] text-cyan opacity-70 group-hover:opacity-100">
                            Buka →
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </section>

          {daftarIsi.length > 0 && (
            <div className="mb-5 lg:hidden">
              <label
                htmlFor="lompat-bagian-mobile"
                className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-faint"
              >
                Navigasi bagian modul
              </label>
              <select
                id="lompat-bagian-mobile"
                value={bagianAktif}
                onChange={(e) => gulirKeBagian(e.target.value)}
                className="w-full rounded-[10px] border border-line bg-surface px-3 py-2 text-[13.5px] text-ink outline-none focus:border-cyan/60"
              >
                {daftarIsi.map((item, idx) => (
                  <option key={item.id} value={item.id}>
                    {String(idx + 1).padStart(2, '0')}. {item.judul}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div
            className={clsx(
              daftarIsi.length > 0 &&
                'lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start lg:gap-8',
            )}
          >
            {daftarIsi.length > 0 && (
              <aside className="hidden lg:sticky lg:top-20 lg:block">
                <nav
                  aria-label="Daftar isi navigasi bagian"
                  className="max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-[16px] border border-line bg-surface/85 p-4"
                >
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan">
                    Navigasi bagian
                  </p>
                  <ul className="mt-3 space-y-1">
                    {daftarIsi.map((item, idx) => {
                      const aktif = item.id === bagianAktif
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => gulirKeBagian(item.id)}
                            className={clsx(
                              'flex w-full items-start gap-2 rounded-[8px] px-2.5 py-1.5 text-left text-[13px] leading-snug transition',
                              aktif
                                ? 'bg-cyan-soft/45 font-medium text-cyan'
                                : 'text-muted hover:bg-sunken/70 hover:text-ink',
                            )}
                          >
                            <span className="mt-0.5 shrink-0 font-mono text-[11px] tabular-nums text-faint">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            <span className="min-w-0 flex-1">{item.judul}</span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                  {soal.length > 0 && (
                    <div className="mt-4 border-t border-line/70 pt-3">
                      <button
                        type="button"
                        onClick={mulaiKuis}
                        className="w-full rounded-[10px] border border-cyan/35 bg-cyan-soft/30 px-3 py-2 text-[12.5px] font-semibold text-cyan transition hover:border-cyan/65 hover:bg-cyan-soft/55"
                      >
                        Uji kuis ({soal.length} soal)
                      </button>
                    </div>
                  )}
                </nav>
              </aside>
            )}

            <div className="min-w-0" ref={wadahMateriRef}>
              <LessonLoader babId={bab.id} path={bab.file} />

              {soal.length > 0 && (
                <section className="kartu mt-8 hidden p-5 md:block">
                  <p className="font-display text-[1.35rem] leading-snug">Uji pemahaman bab ini</p>
                  <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">
                    {soal.length} soal campuran — pilihan ganda, pilihan jamak, isian angka, dan
                    soal esai dengan evaluator AI. Setiap soal punya pembahasan bertahap.
                  </p>
                  <Button className="mt-4" onClick={mulaiKuis}>
                    Mulai kuis bab
                  </Button>
                </section>
              )}
            </div>
          </div>

          <div className="fixed inset-x-0 bottom-[calc(4.4rem+env(safe-area-inset-bottom))] z-20 px-4 md:hidden">
            <div className="mx-auto max-w-[560px] rounded-full border border-line bg-surface/95 px-3 py-2 shadow-[0_4px_20px_rgb(0_0_0/0.5)] backdrop-blur">
              <div className="flex items-center gap-3">
                <p className="flex-1 pl-2 text-[12.5px] leading-tight text-muted">
                  Sudah baca? Uji dengan {soal.length} soal.
                </p>
                <Button onClick={mulaiKuis} disabled={soal.length === 0} className="px-4 py-2 text-[13.5px]">
                  Uji pemahaman
                </Button>
              </div>
            </div>
          </div>
          <div className="h-20 md:hidden" aria-hidden />
        </>
      ) : (
        <div className="kartu p-6">
          <Chip>segera hadir</Chip>
          <p className="mt-3 font-display text-[1.3rem]">Bab ini sedang disusun.</p>
          <p className="mt-1.5 text-[15px] leading-relaxed text-muted">
            Materi ditulis bertahap. Sementara itu, kamu bisa memperkuat bab yang sudah tersedia.
          </p>
          <Link to="/peta" className="mt-4 inline-block">
            <Button variasi="garis">Buka peta belajar</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
