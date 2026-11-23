import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '@/state/user-store'
import { TOPIK } from '../../content/index'
import { SEMUA_SOAL, soalUntukTopik } from '@/lib/soal'
import {
  kocok,
  sesiCampuran,
  sesiKhusus,
  sesiSantai,
  sesiSimulasi,
  sesiUlangan,
} from '@/lib/quiz-builder'
import { statistikTopik } from '@/lib/chapter-status'
import { jadwalUlangan } from '@/lib/retrieval'
import { soalBookmark, soalKesalahanAktif } from '@/lib/srs'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { Icon } from '@/components/ui/Icon'

export function Latihan() {
  const state = useStore((s) => s.state)
  const sesi = useStore((s) => s.sesi)
  const mulaiSesi = useStore((s) => s.mulaiSesi)
  const navigate = useNavigate()

  const stat = statistikTopik(state)
  const ulangan = jadwalUlangan(state.attempts, SEMUA_SOAL)
  const soalEsai = SEMUA_SOAL.filter((s) => s.tipe === 'esai' || s.tipe === 'esai_penalaran')
  const kesalahan = soalKesalahanAktif(state.attempts)
  const bookmark = soalBookmark(state)

  const topikDenganSoal = Object.entries(TOPIK)
    .map(([id, label]) => ({
      id,
      label,
      jumlah: SEMUA_SOAL.filter((s) => s.topik === id).length,
      akurasi: stat.find((t) => t.topik === id)?.akurasi,
      totalDikerjakan: stat.find((t) => t.topik === id)?.total ?? 0,
    }))
    .filter((t) => t.jumlah > 0)

  function jalankanSantai(topik?: string) {
    const kandidat = topik ? soalUntukTopik(topik) : SEMUA_SOAL
    const judul = topik ? `Latihan: ${TOPIK[topik] ?? topik}` : 'Latihan santai campuran'
    const sesiBaru = sesiSantai(judul, kandidat)
    if (sesiBaru) {
      mulaiSesi(sesiBaru)
      navigate('/kuis')
    }
  }

  function jalankanSimulasi() {
    const lemah = stat.filter((t) => t.total >= 2 && t.akurasi < 0.7).map((t) => t.topik)
    const sesiBaru = sesiSimulasi(SEMUA_SOAL, lemah)
    if (sesiBaru) {
      mulaiSesi(sesiBaru)
      navigate('/kuis')
    }
  }

  function jalankanUlangan(topik: string) {
    const sesiBaru = sesiUlangan(topik, SEMUA_SOAL, state.attempts)
    if (sesiBaru) {
      mulaiSesi(sesiBaru)
      navigate('/kuis')
    }
  }

  function jalankanCampuran() {
    const sesiBaru = sesiCampuran(SEMUA_SOAL)
    if (sesiBaru) {
      mulaiSesi(sesiBaru)
      navigate('/kuis')
    }
  }

  function jalankanEsaiAi() {
    const sesiBaru = sesiKhusus(
      'Latihan Esai · Evaluasi AI',
      kocok(soalEsai, Date.now()),
      5,
    )
    if (sesiBaru) {
      mulaiSesi(sesiBaru)
      navigate('/kuis')
    }
  }

  function jalankanKesalahan() {
    const sumber = kesalahan.length > 0 ? kesalahan : bookmark
    if (sumber.length === 0) {
      navigate('/memori')
      return
    }
    const sesiBaru = sesiKhusus(
      kesalahan.length > 0 ? 'Tebus Kesalahan Aktif' : 'Ulangi Soal Ditandai',
      sumber,
      10,
    )
    if (sesiBaru) {
      mulaiSesi(sesiBaru)
      navigate('/kuis')
    }
  }

  const adaSoal = SEMUA_SOAL.length > 0

  return (
    <div className="anim-masuk">
      <header className="mb-6">
        <h1 className="text-[1.9rem] leading-tight">Latihan</h1>
        <p className="mt-1.5 max-w-[56ch] text-[15px] leading-relaxed text-muted">
          Latihan santai untuk memahami, ulangan untuk mengambil kembali setelah jeda, sesi esai
          dengan pembina AI, serta tebus kesalahan untuk menutup celah konsep.
        </p>
      </header>

      {sesi && (
        <section className="kartu mb-4 border-olive/30 p-5">
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.13em] text-olive">
            {sesi.selesai ? 'Hasil siap dilihat' : 'Sesi berjalan'}
          </p>
          <p className="mt-1.5 font-display text-[1.25rem] leading-snug">{sesi.judul}</p>
          <p className="mt-0.5 text-[13px] text-faint">
            {sesi.selesai
              ? `${Object.keys(sesi.hasil).length} dari ${sesi.soalIds.length} soal dijawab`
              : `Soal ${Math.min(sesi.indeks + 1, sesi.soalIds.length)} dari ${sesi.soalIds.length}`}
          </p>
          <Link to="/kuis" className="mt-3 inline-block">
            <Button>{sesi.selesai ? 'Lihat hasil' : 'Lanjutkan sesi'}</Button>
          </Link>
        </section>
      )}

      {!adaSoal && (
        <div className="kartu mb-4 p-5">
          <p className="text-[15px] leading-relaxed text-muted">
            Bank soal masih kosong. Buka bab yang tersedia untuk mulai berlatih.
          </p>
          <Link to="/peta" className="mt-3 inline-block">
            <Button variasi="garis">Buka peta belajar</Button>
          </Link>
        </div>
      )}

      {ulangan.length > 0 && (
        <section className="kartu mb-4 p-5">
          <h2 className="text-[13px] font-medium text-muted">Ulangan tertunda</h2>
          <p className="mt-1 text-[12.5px] leading-relaxed text-faint">
            Soal yang pernah dicoba disisihkan agar hasilnya menguji ingatan konsep, bukan pengenalan jawaban.
          </p>
          <div className="mt-3 space-y-3">
            {ulangan.map((u) => (
              <div key={u.topik} className="flex flex-wrap items-center gap-3 border-t border-line pt-3 first:border-t-0 first:pt-0">
                <div className="min-w-0 flex-1">
                  <p className="text-[14px]">{TOPIK[u.topik] ?? u.topik}</p>
                  <p className="text-[12px] text-faint">
                    {u.cukupSoal
                      ? `${u.soalBaru.length} soal baru tersedia`
                      : `Belum cukup bukti: ${u.soalBaru.length} dari 8 soal baru tersedia`}
                  </p>
                </div>
                {u.cukupSoal && (
                  <Button variasi="tenang" onClick={() => jalankanUlangan(u.topik)}>
                    Mulai ulangan
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <section className="kartu flex flex-col p-5">
          <div className="flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.13em] text-faint">
            <Icon nama="latihan" ukuran={14} />
            Latihan santai
          </div>
          <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-muted">
            8 soal, tanpa pengatur waktu. Setiap jawaban langsung dibahas langkah demi langkah.
          </p>
          <Button className="mt-4" onClick={() => jalankanSantai()} disabled={!adaSoal}>
            Mulai latihan
          </Button>
        </section>

        <section className="kartu flex flex-col border-cyan/30 p-5">
          <div className="flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.13em] text-cyan">
            <Icon nama="ai" ukuran={14} />
            Khusus Esai · Evaluasi AI
          </div>
          <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-muted">
            5 soal esai acak dari {soalEsai.length} bank esai. Tulis penurunanmu dan dapatkan umpan
            balik rubrik langsung dari Pembina AI.
          </p>
          <Button
            className="mt-4"
            variasi="garis"
            onClick={jalankanEsaiAi}
            disabled={soalEsai.length === 0}
          >
            Mulai latihan esai
          </Button>
        </section>

        <section className="kartu flex flex-col p-5">
          <div className="flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.13em] text-faint">
            <Icon nama="latihan" ukuran={14} />
            Campuran terarah
          </div>
          <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-muted">
            8 soal bergantian topik dan level, tanpa timer. Latih mengenali prinsip fisika sebelum
            menghitung.
          </p>
          <Button className="mt-4" variasi="garis" onClick={jalankanCampuran} disabled={!adaSoal}>
            Mulai campuran
          </Button>
        </section>

        <section className="kartu flex flex-col p-5">
          <div className="flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.13em] text-faint">
            <Icon nama="jam" ukuran={14} />
            Simulasi
          </div>
          <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-muted">
            10 soal campuran, 15 menit, 60% dari topik terlemahmu. Berakhir otomatis saat waktu
            habis.
          </p>
          <Button variasi="garis" className="mt-4" onClick={jalankanSimulasi} disabled={!adaSoal}>
            Mulai simulasi
          </Button>
        </section>

        <section className="kartu flex flex-col p-5 sm:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.13em] text-amber">
              <Icon nama="bookmark" ukuran={14} />
              Tebus Kesalahan &amp; Soal Ditandai
            </div>
            <span className="text-[12px] tabular-nums text-faint">
              {kesalahan.length} salah aktif · {bookmark.length} ditandai
            </span>
          </div>
          <p className="mt-2 text-[14.5px] leading-relaxed text-muted">
            Ulangi soal yang pernah keliru hingga tuntas sempurna, atau buka Pusat Memori untuk
            flashcard SM-2 dan latihan konstanta.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variasi="garis"
              onClick={jalankanKesalahan}
              disabled={kesalahan.length === 0 && bookmark.length === 0}
            >
              {kesalahan.length > 0
                ? `Tebus ${kesalahan.length} kesalahan`
                : bookmark.length > 0
                  ? `Latih ${bookmark.length} soal ditandai`
                  : 'Belum ada kesalahan aktif'}
            </Button>
            <Link to="/memori">
              <Button variasi="tenang">Buka Pusat Memori</Button>
            </Link>
          </div>
        </section>
      </div>

      {topikDenganSoal.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 text-[13px] font-medium text-muted">Latih per topik</h2>
          <div className="kartu overflow-hidden">
            {topikDenganSoal.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-3 border-t border-line px-5 py-3 first:border-t-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14.5px]">{t.label}</p>
                  <p className="text-[12px] text-faint">
                    {t.jumlah} soal
                    {t.totalDikerjakan > 0 && t.akurasi !== undefined
                      ? ` · akurasi ${Math.round(t.akurasi * 100)}% dari ${t.totalDikerjakan}`
                      : ''}
                  </p>
                </div>
                {t.akurasi !== undefined && (
                  <Chip variasi={t.akurasi >= 0.7 ? 'hijau' : 'netral'}>
                    {Math.round(t.akurasi * 100)}%
                  </Chip>
                )}
                <Button
                  variasi="tenang"
                  className="px-1 text-[13px]"
                  onClick={() => jalankanSantai(t.id)}
                >
                  Latih
                </Button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
