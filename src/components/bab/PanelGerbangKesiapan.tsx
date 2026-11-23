import { useState } from 'react'
import clsx from 'clsx'
import type { Bab } from '../../../content/index'
import type { LearningState } from '@/types'
import { evaluasiKesiapanModul } from '@/lib/curriculum-readiness'
import { mainkanSuara } from '@/lib/sound'
import { Chip } from '@/components/ui/Chip'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'

interface PanelGerbangKesiapanProps {
  bab: Bab
  state: LearningState
  soalCount: number
  onMulaiKuis: () => void
  onGulirKeBagian?: (targetId: string) => void
}

export function PanelGerbangKesiapan({
  bab,
  state,
  soalCount,
  onMulaiKuis,
  onGulirKeBagian,
}: PanelGerbangKesiapanProps) {
  const [bukaPenjelasan, setBukaPenjelasan] = useState(false)
  const evaluasi = evaluasiKesiapanModul(bab, state)

  function navigasiKeBagian(gerbangId: string, anchorId?: string) {
    mainkanSuara('pilih')
    let el: HTMLElement | null = null

    if (anchorId) {
      el = document.getElementById(anchorId)
    }

    if (!el) {
      if (gerbangId === 'derivasi') {
        el =
          document.getElementById('checklist-mastery') ||
          document.getElementById('latihan-bertingkat-section') ||
          document.querySelector<HTMLElement>('[data-toc-bagian*="Derivasi"]') ||
          document.querySelector<HTMLElement>('[data-toc-bagian*="Kalkulus"]') ||
          document.querySelector<HTMLElement>('[data-toc-bagian*="PDB"]') ||
          document.querySelector<HTMLElement>('[data-toc-bagian*="Vektor"]') ||
          document.querySelector<HTMLElement>('[data-toc-bagian*="Logaritma"]') ||
          document.querySelector<HTMLElement>('.prose-materi section')
      } else if (gerbangId === 'logika') {
        el =
          document.getElementById('ujian-logika-section') ||
          document.querySelector<HTMLElement>('[data-toc-bagian*="Logika"]') ||
          document.querySelector<HTMLElement>('[data-toc-bagian*="Miskonsepsi"]') ||
          document.querySelector<HTMLElement>('[id*="logika"]') ||
          document.querySelector<HTMLElement>('[id*="miskonsepsi"]')
      } else if (gerbangId === 'fermi_observasi') {
        el =
          document.getElementById('cek-pemahaman-section') ||
          document.querySelector<HTMLElement>('[data-anchor="cek-pemahaman"]') ||
          document.querySelector<HTMLElement>('[data-toc-bagian*="Observasi"]') ||
          document.querySelector<HTMLElement>('[data-toc-bagian*="Fermi"]') ||
          document.querySelector<HTMLElement>('[data-toc-bagian*="Pemahaman"]') ||
          document.querySelector<HTMLElement>('[data-toc-bagian*="Instrumen"]') ||
          document.querySelector<HTMLElement>('[data-toc-bagian*="Spektrograf"]') ||
          document.querySelector<HTMLElement>('[data-toc-bagian*="Detektor"]') ||
          document.querySelector<HTMLElement>('.proses-pengerjaan')
      }
    }

    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      el.classList.add('ring-2', 'ring-cyan', 'ring-offset-2', 'ring-offset-bg')
      setTimeout(() => {
        el?.classList.remove('ring-2', 'ring-cyan', 'ring-offset-2', 'ring-offset-bg')
      }, 2400)
    } else if (onGulirKeBagian && anchorId) {
      onGulirKeBagian(anchorId)
    }
  }

  const ikonPerGerbang = {
    derivasi: 'kalkulator' as const,
    logika: 'target' as const,
    fermi_observasi: 'bintang' as const,
    retensi_kuis: 'trofi' as const,
  }

  return (
    <section className="kartu relative overflow-hidden border border-line/90 p-5 shadow-[0_4px_24px_rgb(2_6_23/0.3)]">
      {/* Header Protokol */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line/70 pb-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan">
              Protokol Kesiapan Mandiri
            </span>
            <Chip
              variasi={
                evaluasi.statusKesiapan === 'siap_penuh'
                  ? 'hijau'
                  : evaluasi.statusKesiapan === 'hampir_siap'
                    ? 'cyan'
                    : evaluasi.statusKesiapan === 'berkembang'
                      ? 'amber'
                      : 'netral'
              }
            >
              {evaluasi.labelKesiapan}
            </Chip>
          </div>
          <h2 className="mt-1 font-display text-[1.25rem] font-semibold leading-snug text-ink">
            4 Gerbang Kesiapan Belajar Modul {bab.kode}
          </h2>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">
            {evaluasi.rekomendasiTindakan}
          </p>
        </div>

        <div className="flex flex-col items-end shrink-0">
          <span className="font-mono text-[18px] font-semibold tabular-nums text-cyan">
            {evaluasi.persentaseKesiapan}%
          </span>
          <span className="text-[11px] font-mono text-faint">
            {evaluasi.jumlahLolos} dari 4 gerbang lolos
          </span>
        </div>
      </div>

      {/* Progress Bar Utama */}
      <div className="mt-3">
        <ProgressBar
          nilai={evaluasi.persentaseKesiapan / 100}
          label="Persentase Kesiapan Modul"
        />
      </div>

      {/* Grid 4 Gerbang */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {evaluasi.gerbang.map((g) => {
          const ikon = ikonPerGerbang[g.id]
          const lolos = g.lulus

          return (
            <div
              key={g.id}
              className={clsx(
                'flex flex-col justify-between rounded-[12px] border p-3.5 transition',
                lolos
                  ? 'border-hijau/40 bg-hijau-soft/20 text-ink'
                  : 'border-line/90 bg-surface/85 hover:border-line',
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 font-mono text-[11.5px] font-semibold text-cyan">
                    <Icon nama={ikon} ukuran={13} />
                    <span>Gerbang {g.nomor} · {g.kategori}</span>
                  </span>
                  <span
                    className={clsx(
                      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[11px] font-medium',
                      lolos
                        ? 'border border-hijau/50 bg-hijau-soft/75 text-hijau'
                        : 'border border-amber/40 bg-amber-soft/40 text-amber',
                    )}
                  >
                    {lolos ? (
                      <>
                        <Icon nama="cek" ukuran={11} /> Lolos
                      </>
                    ) : (
                      <>
                        <Icon nama="api" ukuran={11} /> Berjalan
                      </>
                    )}
                  </span>
                </div>

                <p className="mt-1 font-display text-[14.5px] font-semibold text-ink">
                  {g.judul}
                </p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
                  {g.ringkasan}
                </p>

                {/* Sub-kriteria */}
                <div className="mt-2.5 space-y-1.5 border-t border-line/60 pt-2 text-[12px]">
                  {g.kriteria.map((k, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 text-muted">
                        <span
                          className={clsx(
                            'h-1.5 w-1.5 rounded-full',
                            k.tercapai ? 'bg-hijau' : 'bg-faint',
                          )}
                          aria-hidden="true"
                        />
                        <span>{k.label}</span>
                      </span>
                      <span
                        className={clsx(
                          'font-mono tabular-nums text-[11px]',
                          k.tercapai ? 'text-hijau' : 'text-faint',
                        )}
                      >
                        {k.detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tombol aksi kontekstual */}
              <div className="mt-3.5 border-t border-line/50 pt-2.5">
                {g.id === 'retensi_kuis' ? (
                  <Button
                    variasi={lolos ? 'garis' : 'utama'}
                    className="w-full text-[12.5px] py-1.5"
                    onClick={() => {
                      mainkanSuara(lolos ? 'benar' : 'pilih')
                      onMulaiKuis()
                    }}
                  >
                    {lolos
                      ? `Latihan ulang kuis (${soalCount} soal)`
                      : `Mulai sesi kuis bab (${soalCount} soal)`}
                  </Button>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigasiKeBagian(g.id, g.targetAnchorId)}
                    className="flex w-full items-center justify-center gap-2 rounded-[10px] border border-cyan/40 bg-cyan-soft/35 px-3.5 py-2 text-[12.5px] font-semibold text-cyan shadow-sm transition hover:border-cyan hover:bg-cyan-soft/60 hover:text-white active:scale-[0.98]"
                  >
                    <Icon nama={ikon} ukuran={14} />
                    <span>
                      {g.id === 'derivasi'
                        ? 'Buka & Pelajari Derivasi'
                        : g.id === 'logika'
                          ? 'Buka Ujian Logika & Nalar'
                          : 'Buka Observasi & Pemahaman'}
                    </span>
                    <Icon nama="panah" ukuran={12} />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Accordion Penjelasan Protokol */}
      <div className="mt-4 border-t border-line/70 pt-3">
        <button
          type="button"
          onClick={() => {
            mainkanSuara('pilih')
            setBukaPenjelasan((v) => !v)
          }}
          className="flex w-full items-center justify-between text-left font-mono text-[11.5px] text-faint transition hover:text-ink"
        >
          <span>Standar Akademik & Bobot Kelulusan 4 Gerbang</span>
          <span className="flex items-center gap-1 text-cyan">
            <span>{bukaPenjelasan ? 'Sembunyikan' : 'Pelajari kriteria'}</span>
            <Icon
              nama="chevron"
              ukuran={14}
              className={clsx('transition-transform', bukaPenjelasan && 'rotate-180')}
            />
          </span>
        </button>

        {bukaPenjelasan && (
          <div className="anim-masuk mt-3 space-y-2 rounded-[10px] border border-cyan/20 bg-sunken/60 p-3.5 text-[12.5px] leading-relaxed text-muted">
            <p>
              <strong className="text-ink">1. Gerbang Derivasi (Ambang 100%):</strong> Menuntut
              penurunan persamaan inti langsung dari hukum dasar dan prinsip pertama tanpa melompati
              langkah kalkulus, serta memahami batas validitas matematisnya.
            </p>
            <p>
              <strong className="text-ink">2. Gerbang Audit Logika (Ambang ≥ 80%):</strong> Menuntut
              pengujian asumsi tersembunyi, mendeteksi derivasi palsu, memprediksi akibat pengubahan
              asumsi, dan menyelesaikan Ujian Logika dengan umpan balik rubrik/AI.
            </p>
            <p>
              <strong className="text-ink">3. Gerbang Estimasi Fermi & Observasi:</strong> Menuntut
              kemampuan estimasi orde besar pangkat sepuluh (±0,5 dekade) sebelum menghitung angka
              eksak dan menghubungkan rumus ke instrumen pengamatan astronomi nyata.
            </p>
            <p>
              <strong className="text-ink">4. Gerbang Retensi Spaced Repetition:</strong> Menuntut
              penyelesaian minimal 8 soal unik dalam minimal 2 sesi berbeda yang berjarak minimal 7
              hari dengan akurasi rata-rata ≥ 80% untuk menjamin memori tersimpan permanen.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
