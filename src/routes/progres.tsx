import { useRef, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { useStore } from '@/state/user-store'
import type { Tier } from '@/types'
import { KATALOG, TIER_LABEL, TOPIK } from '../../content/index'
import { babDikuasai, statistikTopik } from '@/lib/chapter-status'
import { rekomendasiBerikut, ringkasanProgres } from '@/lib/adaptive'
import { daftarCapaian } from '@/lib/achievements'
import { eksporBackup, parseBackup } from '@/lib/backup'
import { SEMUA_SOAL, soalUntukTopik } from '@/lib/soal'
import { jadwalUlangan } from '@/lib/retrieval'
import { sesiSantai } from '@/lib/quiz-builder'
import { modeRemote } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { Icon } from '@/components/ui/Icon'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { KartuXP } from '@/components/gamification/KartuXP'
import { KartuStreak } from '@/components/gamification/KartuStreak'
import { TujuanHarian } from '@/components/gamification/TujuanHarian'

const TIER_URUT: Tier[] = ['fondasi', 'inti', 'lanjutan']
const BARU_MS = 7 * 24 * 60 * 60 * 1000

export function Progres() {
  const profil = useStore((s) => s.profil)
  const state = useStore((s) => s.state)
  const keluar = useStore((s) => s.keluar)
  const mulaiSesi = useStore((s) => s.mulaiSesi)
  const imporState = useStore((s) => s.imporState)
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const [pesanCadangan, setPesanCadangan] = useState('')

  const ringkasan = ringkasanProgres(state)
  const dikuasai = babDikuasai(state)
  const capaian = daftarCapaian(state)
  const stat = statistikTopik(state)
  const rekom = rekomendasiBerikut(state)
  const ulangan = jadwalUlangan(state.attempts, SEMUA_SOAL)
  const jumlahTerbuka = capaian.filter((c) => c.terbuka).length

  function latihTopik(topik: string) {
    const sesi = sesiSantai(`Latihan: ${TOPIK[topik] ?? topik}`, soalUntukTopik(topik))
    if (sesi) {
      mulaiSesi(sesi)
      navigate('/kuis')
    }
  }

  function jalankanRekomendasi() {
    if (rekom.jenis === 'bab' && rekom.babId) {
      navigate(`/bab/${rekom.babId}`)
      return
    }
    latihTopik(rekom.topik ?? '')
  }

  function keluarProfil() {
    keluar()
    navigate('/masuk', { replace: true })
  }

  function ekspor() {
    if (!profil) return
    const blob = new Blob([eksporBackup(profil, state)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const tautan = document.createElement('a')
    tautan.href = url
    tautan.download = `ruanglangit-${profil.normalizedName.replace(/\s+/g, '-')}.json`
    tautan.click()
    URL.revokeObjectURL(url)
    setPesanCadangan('Cadangan diunduh.')
  }

  async function impor(e: ChangeEvent<HTMLInputElement>) {
    const berkas = e.target.files?.[0]
    e.target.value = ''
    if (!berkas) return
    const tambahan = parseBackup(await berkas.text())
    if (!tambahan) {
      setPesanCadangan('File tidak dikenali — pilih cadangan Ruang Langit (.json).')
      return
    }
    const sebelum = useStore.getState().state.attempts.length
    imporState(tambahan)
    const sesudah = useStore.getState().state.attempts.length
    setPesanCadangan(`Cadangan digabungkan — ${Math.max(0, sesudah - sebelum)} jawaban baru.`)
  }

  return (
    <div className="anim-masuk space-y-6">
      <header>
        <h1 className="text-[1.9rem] leading-tight">Progres</h1>
        <p className="mt-1.5 text-[15px] text-muted">
          Ringkasan yang jujur, bukan sekadar angka besar.
        </p>
      </header>

      <section className="kartu p-5">
        <h2 className="text-[13px] font-medium text-muted">Aktivitas</h2>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-olive-soft font-display text-[1.15rem] text-olive">
            {profil?.displayName.trim().charAt(0).toUpperCase() ?? '?'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{profil?.displayName ?? 'Siswa'}</p>
            <p className="text-[12.5px] text-faint">
              {modeRemote ? 'Profil Supabase · lintas perangkat' : 'Profil lokal · browser ini'}
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 divide-x divide-line border-t border-line pt-4">
          <div className="pr-4">
            <p className="font-display text-[1.7rem] leading-none">{ringkasan.percobaan}</p>
            <p className="mt-1 text-[12px] text-faint">Percobaan tercatat</p>
          </div>
          <div className="pl-4">
            <p className="font-display text-[1.7rem] leading-none">
              {ringkasan.akurasi === null ? '—' : `${Math.round(ringkasan.akurasi * 100)}%`}
            </p>
            <p className="mt-1 text-[12px] text-faint">Akurasi boolean keseluruhan</p>
          </div>
        </div>
      </section>

      <section className="kartu p-5">
        <h2 className="text-[13px] font-medium text-muted">Bukti belajar saat ini</h2>
        <p className="mt-1 text-[12.5px] leading-relaxed text-faint">
          Metrik ini meringkas percobaan tersimpan, bukan tes paralel atau bukti bahwa fitur menyebabkan peningkatan.
        </p>
        {stat.length === 0 ? (
          <p className="mt-3 text-[14px] text-muted">Belum cukup bukti. Kerjakan latihan bertopik untuk mulai membangun peta hasil.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {stat.map((s) => {
              const tertunda = ulangan.find((u) => u.topik === s.topik)
              const cukup = s.soalUnik >= 8 && s.sesi >= 2
              return (
                <div key={s.topik} className="border-t border-line pt-3 first:border-t-0 first:pt-0">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px]">{TOPIK[s.topik] ?? s.topik}</p>
                      <p className="text-[12px] text-faint">
                        {s.soalUnik} soal unik · {s.sesi} sesi · {s.level.join(', ') || 'level belum tercatat'}
                      </p>
                    </div>
                    <span className="text-[13px] font-medium tabular-nums">{Math.round(s.skorRataRata * 100)}%</span>
                  </div>
                  <p className="mt-1 text-[12px] text-muted">
                    {tertunda
                      ? tertunda.cukupSoal
                        ? 'Ulangan tertunda siap'
                        : `Retensi belum cukup bukti: ${tertunda.soalBaru.length}/8 soal baru`
                      : cukup
                        ? 'Skor latihan saat ini; belum ada ulangan tertunda'
                        : 'Belum cukup bukti untuk menilai topik ini'}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <section>
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="text-[13px] font-medium text-muted">Perjalananmu</h2>
          <span className="text-[12px] text-faint">
            Rekor streak {state.gamifikasi.bestStreak} hari
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <KartuXP />
          <KartuStreak />
        </div>
        <div className="mt-3">
          <TujuanHarian />
        </div>
      </section>

      <section>
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="text-[13px] font-medium text-muted">Capaian</h2>
          <span className="text-[12px] text-faint">
            {jumlahTerbuka} dari {capaian.length}
          </span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {capaian.map((c) => {
            const baru = c.terbuka && c.dibukaPada !== undefined && Date.now() - c.dibukaPada < BARU_MS
            return (
              <div
                key={c.id}
                className={clsx(
                  'rounded-[12px] border p-3.5',
                  c.terbuka
                    ? 'border-amber/30 bg-amber-soft/40'
                    : 'border-dashed border-line bg-surface',
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    nama={c.terbuka ? 'bintang' : 'lingkaran'}
                    ukuran={15}
                    className={c.terbuka ? 'text-amber' : 'text-faint'}
                  />
                  <p
                    className={clsx(
                      'text-[13.5px] font-medium leading-snug',
                      !c.terbuka && 'text-muted',
                    )}
                  >
                    {c.nama}
                  </p>
                  {baru && <Chip variasi="amber" className="ml-auto">baru</Chip>}
                </div>
                <p className="mt-1 text-[12px] leading-relaxed text-faint">{c.deskripsi}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-[13px] font-medium text-muted">Penguasaan per lapis</h2>
        <div className="kartu space-y-4 p-5">
          {TIER_URUT.map((t) => {
            const daftar = KATALOG.filter((b) => b.tier === t)
            const selesai = daftar.filter((b) => dikuasai.has(b.id)).length
            return (
              <div key={t}>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <p className="text-[14px]">{TIER_LABEL[t]}</p>
                  <span className="text-[12.5px] tabular-nums text-faint">
                    {selesai}/{daftar.length}
                  </span>
                </div>
                <ProgressBar
                  nilai={daftar.length ? selesai / daftar.length : 0}
                  label={`Penguasaan ${TIER_LABEL[t]}`}
                  warna={t === 'fondasi' ? 'cyan' : t === 'inti' ? 'ungu' : 'magenta'}
                />
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-[13px] font-medium text-muted">Per topik</h2>
        {stat.length === 0 ? (
          <div className="kartu p-5 text-[14.5px] leading-relaxed text-muted">
            Belum ada data. Kerjakan satu sesi latihan untuk melihat peta kekuatanmu.
          </div>
        ) : (
          <div className="kartu overflow-hidden">
            {stat.map((s) => (
              <div key={s.topik} className="border-t border-line px-5 py-3 first:border-t-0">
                <div className="flex items-center gap-3">
                  <p className="min-w-0 flex-1 truncate text-[14.5px]">
                    {TOPIK[s.topik] ?? s.topik}
                  </p>
                  <span
                    className={clsx(
                      'text-[13px] font-medium tabular-nums',
                      s.skorRataRata >= 0.7 ? 'text-hijau' : 'text-muted',
                    )}
                  >
                    {Math.round(s.skorRataRata * 100)}% skor
                  </span>
                  <span className="w-10 text-right text-[12px] tabular-nums text-faint">
                    {s.benar}/{s.total}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <ProgressBar nilai={s.skorRataRata} label={`Skor rata-rata ${s.topik}`} />
                  <button
                    onClick={() => latihTopik(s.topik)}
                    disabled={soalUntukTopik(s.topik).length === 0}
                    className="shrink-0 text-[12.5px] text-cyan underline-offset-4 hover:underline disabled:opacity-40"
                  >
                    Latih
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="kartu border-olive/30 p-5">
        <div className="flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.13em] text-olive">
          <Icon nama="bintang" ukuran={14} />
          Langkah berikutnya
        </div>
        <p className="mt-2 font-display text-[1.25rem] leading-snug">{rekom.judul}</p>
        <p className="mt-1 text-[14px] leading-relaxed text-muted">{rekom.alasan}</p>
        <Button className="mt-3" onClick={jalankanRekomendasi} disabled={SEMUA_SOAL.length === 0}>
          {rekom.jenis === 'bab' ? 'Buka bab' : 'Mulai latihan'}
        </Button>
      </section>

      <section className="kartu p-5">
        <h2 className="text-[13px] font-medium text-muted">Data &amp; cadangan</h2>
        <p className="mt-1 text-[13.5px] leading-relaxed text-muted">
          Unduh progres sebagai JSON, atau gabungkan cadangan dari perangkat lain. Cadangan hanya
          berisi progres belajar — tanpa kata sandi.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variasi="garis" onClick={ekspor}>
            <Icon nama="unduh" ukuran={16} />
            Ekspor JSON
          </Button>
          <Button variasi="garis" onClick={() => fileRef.current?.click()}>
            <Icon nama="unggah" ukuran={16} />
            Impor JSON
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            onChange={impor}
            className="sr-only"
            aria-label="Impor cadangan JSON"
          />
        </div>
        {pesanCadangan && <p className="mt-2 text-[13px] text-muted">{pesanCadangan}</p>}
      </section>

      <section className="border-t border-line pt-5">
        <p className="text-[12.5px] leading-relaxed text-faint">
          Profil berbasis nama tidak memakai kata sandi. Siapa pun yang tahu namamu bisa membuka
          profil ini — cocok untuk belajar bersama, bukan untuk data pribadi.
        </p>
        <Button variasi="garis" className="mt-3" onClick={keluarProfil}>
          <Icon nama="keluar" ukuran={16} />
          Keluar dari profil
        </Button>
      </section>
    </div>
  )
}
