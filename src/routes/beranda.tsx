import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '@/state/user-store'
import { KATALOG, TIER_LABEL } from '../../content/index'
import { KARTU_MEMORI_BAWAAN } from '../../content/memori'
import { rekomendasiBerikut, ringkasanProgres } from '@/lib/adaptive'
import { babTerakhirDibuka, statusBab } from '@/lib/chapter-status'
import { daftarCapaian } from '@/lib/achievements'
import { ringkasanSrs, soalKesalahanAktif } from '@/lib/srs'
import { SEMUA_SOAL, soalUntukTopik } from '@/lib/soal'
import { sesiSantai } from '@/lib/quiz-builder'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { Icon } from '@/components/ui/Icon'
import { Lumi, type EkspresiLumi } from '@/components/lumi/Lumi'
import { KartuStreak } from '@/components/gamification/KartuStreak'
import { KartuXP } from '@/components/gamification/KartuXP'
import { TujuanHarian } from '@/components/gamification/TujuanHarian'
import { statusStreak } from '@/lib/gamification'

function sapaan(): string {
  const jam = new Date().getHours()
  if (jam < 11) return 'Selamat pagi'
  if (jam < 15) return 'Selamat siang'
  if (jam < 19) return 'Selamat sore'
  return 'Selamat malam'
}

export function Beranda() {
  const profil = useStore((s) => s.profil)
  const state = useStore((s) => s.state)
  const mulaiSesi = useStore((s) => s.mulaiSesi)
  const navigate = useNavigate()

  const ringkasan = ringkasanProgres(state)
  const rekom = rekomendasiBerikut(state)
  const lanjut = babTerakhirDibuka(state)
  const lanjutStatus = lanjut ? statusBab(lanjut, state) : 'belum'
  const semuaKartu = [...(state.kartuKustom ?? []), ...KARTU_MEMORI_BAWAAN]
  const infoSrs = ringkasanSrs(semuaKartu, state.srs)
  const kesalahanAktif = soalKesalahanAktif(state.attempts)
  const capaianTerbuka = daftarCapaian(state)
    .filter((c) => c.terbuka)
    .sort((a, b) => (b.dibukaPada ?? 0) - (a.dibukaPada ?? 0))
    .slice(0, 2)

  function jalankanRekomendasi() {
    if (rekom.jenis === 'bab' && rekom.babId) {
      navigate(`/bab/${rekom.babId}`)
      return
    }
    const kandidat = rekom.topik ? soalUntukTopik(rekom.topik) : SEMUA_SOAL
    const sesi = sesiSantai(rekom.judul, kandidat.length > 0 ? kandidat : SEMUA_SOAL)
    if (sesi) {
      mulaiSesi(sesi)
      navigate('/kuis')
    } else {
      navigate('/latihan')
    }
  }

  const tampilLanjut = lanjut && lanjutStatus !== 'dikuasai'

  const status = statusStreak(state.gamifikasi)
  const ekspresi: EkspresiLumi =
    status === 'aktif' ? 'senang' : status === 'putus' ? 'sedih' : 'tidur'
  const pesanLumi =
    status === 'aktif'
      ? 'Lumi bangga — kamu sudah belajar hari ini!'
      : status === 'putus'
        ? 'Streak putus, tapi langit tetap menunggu. Mulai lagi yuk.'
        : 'Lumi masih mengantuk… jawab satu soal untuk membangunkannya.'

  return (
    <div className="anim-masuk space-y-6">
      <section className="kartu relative overflow-hidden p-5">
        <div
          className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-ungu/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative flex items-center gap-4">
          <Lumi ekspresi={ekspresi} ukuran={92} className="shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-[13px] text-faint">{sapaan()},</p>
            <h1 className="mt-0.5 text-[1.9rem] leading-tight">
              {profil?.displayName ?? 'Siswa'}
              <span className="text-magenta">.</span>
            </h1>
            <p className="mt-1 text-[13.5px] leading-snug text-muted">{pesanLumi}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <KartuStreak />
        <KartuXP />
      </div>
      <TujuanHarian />

      {tampilLanjut && lanjut && (
        <section className="kartu p-5">
          <div className="flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-faint">
            <Icon nama="jam" ukuran={14} />
            Lanjutkan
          </div>
          <div className="mt-2 flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[12px] text-faint">
                {TIER_LABEL[lanjut.tier]} · {lanjut.kode}
              </p>
              <p className="font-display text-[1.3rem] leading-snug">{lanjut.judul}</p>
              <p className="mt-1 text-[14.5px] leading-relaxed text-muted">{lanjut.ringkas}</p>
            </div>
          </div>
          <Link to={`/bab/${lanjut.id}`} className="mt-4 block">
            <Button className="w-full">Buka materi</Button>
          </Link>
        </section>
      )}

      <section className="kartu border-olive/30 p-5">
        <div className="flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-olive">
          <Icon nama="bintang" ukuran={14} />
          Rekomendasi hari ini
        </div>
        <p className="mt-2 font-display text-[1.3rem] leading-snug">{rekom.judul}</p>
        <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">{rekom.alasan}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button onClick={jalankanRekomendasi}>
            {rekom.jenis === 'bab' ? 'Buka bab' : 'Mulai latihan'}
          </Button>
          <Link to="/peta" className="text-[14px] text-muted underline-offset-4 hover:underline">
            Lihat peta belajar
          </Link>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <Link
          to="/memori"
          className="kartu flex items-start gap-3.5 p-4 transition hover:border-ungu/50"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] bg-ungu-soft text-ungu">
            <Icon nama="memori" ukuran={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-ink">Pusat Memori &amp; Drill</p>
            <p className="mt-0.5 text-[13px] text-muted">
              <span className="tabular-nums font-medium text-cyan">{infoSrs.jatuhTempo}</span> kartu
              jatuh tempo
              {kesalahanAktif.length > 0
                ? ` · ${kesalahanAktif.length} soal salah perlu ditebus`
                : ' · Tebak konstanta & urutan'}
            </p>
          </div>
        </Link>

        <Link
          to="/referensi"
          className="kartu flex items-start gap-3.5 p-4 transition hover:border-cyan/50"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] bg-cyan-soft text-cyan">
            <Icon nama="kalkulator" ukuran={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-ink">Referensi &amp; Kalkulator</p>
            <p className="mt-0.5 text-[13px] text-muted">
              Lembar rumus KaTeX, 5 kalkulator astrofisika, dan glosarium OSN.
            </p>
          </div>
        </Link>
      </section>

      <section className="grid grid-cols-3 divide-x divide-line overflow-hidden rounded-[14px] border border-line bg-surface">
        <div className="px-4 py-4 text-center">
          <p className="font-display text-[1.5rem] leading-none">
            {ringkasan.dikuasai}
            <span className="text-[0.8rem] text-faint">/{KATALOG.length}</span>
          </p>
          <p className="mt-1.5 text-[11.5px] leading-tight text-faint">Bab dikuasai</p>
        </div>
        <div className="px-4 py-4 text-center">
          <p className="font-display text-[1.5rem] leading-none">
            {ringkasan.akurasi === null ? '—' : `${Math.round(ringkasan.akurasi * 100)}%`}
          </p>
          <p className="mt-1.5 text-[11.5px] leading-tight text-faint">Akurasi latihan</p>
        </div>
        <div className="px-4 py-4 text-center">
          <p className="font-display text-[1.5rem] leading-none">{ringkasan.percobaan}</p>
          <p className="mt-1.5 text-[11.5px] leading-tight text-faint">Soal dikerjakan</p>
        </div>
      </section>

      {capaianTerbuka.length > 0 && (
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[13px] font-medium text-muted">Capaian terbaru</h2>
            <Link to="/progres" className="text-[13px] text-amber hover:underline underline-offset-4">
              Semua capaian
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {capaianTerbuka.map((c) => (
              <Chip key={c.id} variasi="amber">
                <Icon nama="bintang" ukuran={12} />
                {c.nama}
              </Chip>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
