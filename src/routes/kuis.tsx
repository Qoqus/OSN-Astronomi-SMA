import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { useStore } from '@/state/user-store'
import type { EvaluasiEsaiAI, Jawaban, JawabanLangkah, SesiKuis } from '@/types'
import {
  labelLevel,
  mediaSoal,
  modeInteraksiSoal,
  pembahasanSoal,
  type Soal,
} from '@/schemas/soal'
import { TOPIK } from '../../content/index'
import { soalById } from '@/lib/soal'
import { kunciJawaban, nilaiSoal } from '@/lib/grading'
import { kocok } from '@/lib/quiz-builder'
import { mainkanSuara } from '@/lib/sound'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Chip } from '@/components/ui/Chip'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { TeksMath } from '@/components/ui/TeksMath'
import { FigureSoal } from '@/components/figures'
import { Lumi } from '@/components/lumi/Lumi'
import { Konfeti } from '@/components/gamification/Konfeti'

const HURUF = 'ABCDE'

function formatWaktu(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const menit = Math.floor(total / 60)
  const detik = total % 60
  return `${menit}:${String(detik).padStart(2, '0')}`
}

function labelTipe(tipe: Soal['tipe']) {
  switch (tipe) {
    case 'pilihan-ganda':
    case 'pilihan_ganda':
      return 'Pilihan ganda'
    case 'pilihan-jamak':
    case 'pilihan_jamak':
      return 'Pilihan jamak'
    case 'isian':
    case 'isian_angka':
      return 'Isian angka'
    case 'esai':
      return 'Esai'
    case 'esai_penalaran':
      return 'Esai penalaran'
    case 'interpretasi_grafik':
      return 'Interpretasi grafik'
    case 'interpretasi_tabel':
      return 'Interpretasi tabel'
    case 'temukan_kesalahan':
      return 'Temukan kesalahan'
    case 'cek_dimensi':
      return 'Cek dimensi'
    case 'ranking_urutan':
      return 'Ranking urutan'
    case 'multi_langkah':
      return 'Multi-langkah'
    case 'data_tidak_lengkap':
      return 'Data tidak lengkap'
  }
}

function hashSeed(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

interface PropsSoal {
  sesi: SesiKuis
  soal: Soal
  nomor: number
  total: number
}

const EMPTY_BOOKMARK: string[] = []

function SoalAktif({ sesi, soal, nomor, total }: PropsSoal) {
  const sesiLive = useStore((s) => s.sesi) ?? sesi
  const bookmarkSoal = useStore((s) => s.state.bookmarkSoal ?? EMPTY_BOOKMARK)
  const simpanHasil = useStore((s) => s.simpanHasil)
  const catatPercobaan = useStore((s) => s.catatPercobaan)
  const majuSoal = useStore((s) => s.majuSoal)
  const toggleBookmarkSoal = useStore((s) => s.toggleBookmarkSoal)
  const tambahKartuKustom = useStore((s) => s.tambahKartuKustom)

  const tersimpan = sesiLive.jawaban[soal.id]
  const hasil = sesiLive.hasil[soal.id]
  const sudah = Boolean(hasil)
  const ditandai = bookmarkSoal.includes(soal.id)

  const mode = modeInteraksiSoal(soal)
  const media = mediaSoal(soal)
  const pembahasan = pembahasanSoal(soal)
  const opsiSoal = 'opsi' in soal && Array.isArray(soal.opsi) ? soal.opsi : []
  const rubrikSoal = 'rubrik' in soal && Array.isArray(soal.rubrik) ? soal.rubrik : []
  const satuanSoal = 'satuan' in soal ? soal.satuan : '—'
  const signifikanSoal = 'signifikan' in soal ? soal.signifikan : undefined

  const urutanAwal = useMemo(() => {
    if (soal.tipe !== 'ranking_urutan') return []
    const dasar = soal.opsi.map((_, i) => i)
    const acak = kocok(dasar, hashSeed(soal.id + '-rank'))
    const samaPersis = acak.every((v, i) => v === soal.jawaban[i])
    if (samaPersis && acak.length > 1) {
      ;[acak[0], acak[1]] = [acak[1], acak[0]]
    }
    return acak
  }, [soal])

  const [pilihan, setPilihan] = useState<number | null>(
    tersimpan?.tipe === 'pilihan-ganda' ? tersimpan.indeks : null,
  )
  const [jamak, setJamak] = useState<number[]>(
    tersimpan?.tipe === 'pilihan-jamak' ? tersimpan.indeks : [],
  )
  const [angka, setAngka] = useState(tersimpan?.tipe === 'isian' ? tersimpan.angka : '')
  const [satuan, setSatuan] = useState(tersimpan?.tipe === 'isian' ? tersimpan.satuan : '')
  const [rubrik, setRubrik] = useState<boolean[]>(
    mode === 'esai'
      ? rubrikSoal.map((_, i) =>
          tersimpan?.tipe === 'esai' ? Boolean(tersimpan.rubrik[i]) : false,
        )
      : [],
  )
  const [catatan, setCatatan] = useState(
    tersimpan?.tipe === 'esai' ? (tersimpan.teks ?? '') : '',
  )
  const [urutan, setUrutan] = useState<number[]>(
    tersimpan?.tipe === 'ranking_urutan' ? tersimpan.urutan : urutanAwal,
  )
  const [langkahJawab, setLangkahJawab] = useState<JawabanLangkah[]>(() => {
    if (tersimpan?.tipe === 'multi_langkah') return tersimpan.langkah
    if (soal.tipe !== 'multi_langkah') return []
    return soal.langkah.map((l) =>
      l.tipe === 'pilihan_ganda'
        ? { tipe: 'pilihan_ganda', indeks: -1 }
        : { tipe: 'isian_angka', angka: '', satuan: '' },
    )
  })
  const [prinsipDipilih, setPrinsipDipilih] = useState<string | null>(null)
  const [peringatan, setPeringatan] = useState('')
  const [sedangEvaluasiAi, setSedangEvaluasiAi] = useState(false)
  const [errorAi, setErrorAi] = useState('')
  const [tersimpanKeMemori, setTersimpanKeMemori] = useState(false)
  const mulai = useRef(Date.now())

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  const opsiPrinsip = useMemo(() => {
    const benarLabel = TOPIK[soal.topik] ?? soal.topik
    const lain = Object.entries(TOPIK)
      .filter(([k]) => k !== soal.topik)
      .map(([, v]) => v)
    const acakLain = kocok(lain, hashSeed(soal.id)).slice(0, 2)
    return kocok([benarLabel, ...acakLain], hashSeed(soal.id + '-opsi'))
  }, [soal.id, soal.topik])

  const terakhir = nomor === total
  const tanpaSatuan = mode === 'isian' && satuanSoal === '—'

  function catatAttempt(penilaian: { benar: boolean; skor: number }) {
    catatPercobaan({
      sesiId: sesi.id,
      soalId: soal.id,
      topik: soal.topik,
      level: soal.level,
      tipe: soal.tipe,
      modul: sesi.mode,
      babId: sesi.babId,
      benar: penilaian.benar,
      skor: penilaian.skor,
      durasiMs: Date.now() - mulai.current,
    })
  }

  function periksa() {
    let jawaban: Jawaban | null = null
    if (mode === 'pilihan-ganda') {
      if (pilihan === null) {
        mainkanSuara('salah')
        setPeringatan('Pilih satu jawaban dulu.')
        return
      }
      jawaban = { tipe: 'pilihan-ganda', indeks: pilihan }
    } else if (mode === 'pilihan-jamak') {
      if (jamak.length === 0) {
        mainkanSuara('salah')
        setPeringatan('Pilih minimal satu opsi.')
        return
      }
      jawaban = { tipe: 'pilihan-jamak', indeks: [...jamak].sort((a, b) => a - b) }
    } else if (mode === 'isian') {
      if (!angka.trim()) {
        mainkanSuara('salah')
        setPeringatan('Isi angka jawabanmu dulu.')
        return
      }
      if (!tanpaSatuan && !satuan.trim()) {
        mainkanSuara('salah')
        setPeringatan('Tulis satuannya juga, misalnya km/s.')
        return
      }
      jawaban = { tipe: 'isian', angka, satuan: tanpaSatuan ? satuanSoal : satuan }
    } else if (mode === 'ranking_urutan') {
      jawaban = { tipe: 'ranking_urutan', urutan }
    } else if (mode === 'multi_langkah' && soal.tipe === 'multi_langkah') {
      for (let i = 0; i < soal.langkah.length; i++) {
        const l = soal.langkah[i]
        const jw = langkahJawab[i]
        if (l.tipe === 'pilihan_ganda' && (!jw || jw.tipe !== 'pilihan_ganda' || jw.indeks < 0)) {
          mainkanSuara('salah')
          setPeringatan(`Lengkapi pilihan pada Langkah ${i + 1} terlebih dahulu.`)
          return
        }
        if (l.tipe === 'isian_angka') {
          if (!jw || jw.tipe !== 'isian_angka' || !jw.angka.trim()) {
            mainkanSuara('salah')
            setPeringatan(`Isi nilai angka pada Langkah ${i + 1} terlebih dahulu.`)
            return
          }
          const perluSatuan = l.satuan && l.satuan !== '—'
          if (perluSatuan && !jw.satuan.trim()) {
            mainkanSuara('salah')
            setPeringatan(`Tulis satuan pada Langkah ${i + 1} (mis. ${l.satuan}).`)
            return
          }
        }
      }
      jawaban = { tipe: 'multi_langkah', langkah: langkahJawab }
    } else {
      if (catatan.trim().length < 15) {
        mainkanSuara('salah')
        setPeringatan('Tulis penalaranmu singkat dulu (minimal 15 karakter), lalu centang rubrik atau evaluasi dengan AI.')
        return
      }
      jawaban = { tipe: 'esai', rubrik, teks: catatan }
    }

    setPeringatan('')
    setErrorAi('')
    const penilaian = nilaiSoal(soal, jawaban)
    mainkanSuara(
      penilaian.benar ? 'benar' : penilaian.skor > 0 ? 'sebagian' : 'salah',
    )
    simpanHasil(soal.id, jawaban, penilaian)
    catatAttempt(penilaian)
  }

  async function evaluasiDenganAi() {
    if (mode !== 'esai') return
    if (catatan.trim().length < 15) {
      mainkanSuara('salah')
      setPeringatan('Tulis jawaban esaimu minimal 15 karakter sebelum dinilai AI.')
      return
    }
    setPeringatan('')
    setErrorAi('')
    setSedangEvaluasiAi(true)

    const teladan =
      'jawabanTeladan' in soal && soal.jawabanTeladan
        ? soal.jawabanTeladan
        : 'jawaban' in soal && typeof soal.jawaban === 'string'
          ? soal.jawaban
          : undefined

    try {
      const resp = await fetch('/api/evaluasi-esai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pertanyaan: soal.soal,
          topik: TOPIK[soal.topik] ?? soal.topik,
          level: labelLevel(soal.level),
          jawabanSiswa: catatan,
          rubrik: rubrikSoal,
          jawabanTeladan: teladan,
          pembahasan,
        }),
      })

      const data = (await resp.json().catch(() => null)) as
        | (EvaluasiEsaiAI & { error?: string })
        | null

      if (!resp.ok || !data || typeof data.skor !== 'number') {
        mainkanSuara('salah')
        setErrorAi(
          data?.error ??
            'Evaluator AI belum berhasil memproses jawabanmu. Kamu bisa coba lagi atau gunakan penilaian rubrik manual.',
        )
        return
      }

      const rubrikAi = rubrikSoal.map((_, i) => {
        const item = data.rubrikHasil.find((r) => r.indeks === i)
        return item ? item.status !== 'belum' : false
      })
      setRubrik(rubrikAi)

      const jawaban: Jawaban = {
        tipe: 'esai',
        rubrik: rubrikAi,
        teks: catatan,
        evaluasiAi: data,
      }
      const penilaian = {
        benar: data.benar,
        skor: data.skor,
        pesan: data.ringkasan,
        evaluasiAi: data,
      }
      mainkanSuara(
        penilaian.benar ? 'benar' : penilaian.skor > 0 ? 'sebagian' : 'salah',
      )
      simpanHasil(soal.id, jawaban, penilaian)
      catatAttempt(penilaian)
    } catch {
      mainkanSuara('salah')
      setErrorAi(
        'Koneksi ke server evaluator AI terputus. Coba lagi sebentar atau nilai manual dengan rubrik.',
      )
    } finally {
      setSedangEvaluasiAi(false)
    }
  }

  function simpanKeKartuMemori() {
    if (tersimpanKeMemori) return
    tambahKartuKustom({
      kategori: TOPIK[soal.topik] ?? soal.topik,
      depan: soal.soal,
      belakang: `Kunci: ${kunciJawaban(soal)}${pembahasan[0] ? `\n\nInti langkah: ${pembahasan[0]}` : ''}`,
      petunjuk: `Dari soal ${labelTipe(soal.tipe)} (${labelLevel(soal.level)})`,
      babId: sesi.babId,
    })
    mainkanSuara('benar')
    setTersimpanKeMemori(true)
  }

  function geserUrutan(pos: number, delta: -1 | 1) {
    if (sudah) return
    const tujuan = pos + delta
    if (tujuan < 0 || tujuan >= urutan.length) return
    mainkanSuara('pilih')
    setUrutan((prev) => {
      const next = [...prev]
      ;[next[pos], next[tujuan]] = [next[tujuan], next[pos]]
      return next
    })
  }

  function ubahLangkahPilihan(idxLangkah: number, indeksOpsi: number) {
    if (sudah) return
    mainkanSuara('pilih')
    setLangkahJawab((prev) =>
      prev.map((item, j) => (j === idxLangkah ? { tipe: 'pilihan_ganda', indeks: indeksOpsi } : item)),
    )
  }

  function ubahLangkahIsian(idxLangkah: number, field: 'angka' | 'satuan', val: string) {
    if (sudah) return
    setLangkahJawab((prev) =>
      prev.map((item, j) => {
        if (j !== idxLangkah) return item
        const cur = item.tipe === 'isian_angka' ? item : { tipe: 'isian_angka' as const, angka: '', satuan: '' }
        return { ...cur, [field]: val }
      }),
    )
  }

  function toggleJamak(i: number) {
    mainkanSuara('pilih')
    setJamak((lama) => (lama.includes(i) ? lama.filter((x) => x !== i) : [...lama, i]))
  }

  const labelTopikBenar = TOPIK[soal.topik] ?? soal.topik

  return (
    <div>
      <div className="mb-6">
        <div className="mb-2 flex items-baseline justify-between">
          <p className="text-[13px] font-medium text-muted">
            Soal {nomor} dari {total}
          </p>
          <p className="text-[12px] text-faint">{labelTipe(soal.tipe)}</p>
        </div>
        <ProgressBar nilai={nomor / total} label={`Soal ${nomor} dari ${total}`} />
      </div>

      <div className="anim-masuk kartu p-5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            <Chip variasi="garis">{labelTopikBenar}</Chip>
            <Chip
              variasi={
                soal.level === 'olimpiade'
                  ? 'magenta'
                  : soal.level === 'penalaran'
                    ? 'olive'
                    : soal.level === 'fondasi'
                      ? 'cyan'
                      : 'netral'
              }
            >
              {labelLevel(soal.level)}
            </Chip>
            {mode === 'esai' && (
              <Chip variasi="cyan">
                <Icon nama="ai" ukuran={11} />
                Evaluasi AI tersedia
              </Chip>
            )}
          </div>

          <button
            type="button"
            onClick={() => toggleBookmarkSoal(soal.id)}
            aria-pressed={ditandai}
            className={clsx(
              'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[12px] transition',
              ditandai
                ? 'border-amber/60 bg-amber-soft/60 text-amber'
                : 'border-line bg-surface text-muted hover:text-ink',
            )}
            title={ditandai ? 'Hapus bookmark soal' : 'Tandai soal untuk diulang'}
          >
            <Icon nama="bookmark" ukuran={13} />
            {ditandai ? 'Ditandai' : 'Tandai'}
          </button>
        </div>

        <p className="text-[16.5px] leading-relaxed sm:text-[17px]">
          <TeksMath teks={soal.soal} />
        </p>

        <FigureSoal id={soal.gambar} media={media} />

        {sesi.mode === 'campuran' && (
          <fieldset className="mt-4 rounded-[10px] border border-line bg-sunken/50 p-3.5">
            <legend className="px-1 text-[13px] font-medium text-muted">
              Prinsip utama apa yang cocok dipakai di sini?
            </legend>
            <div className="flex flex-wrap gap-2">
              {opsiPrinsip.map((prinsip) => {
                const aktif = prinsipDipilih === prinsip
                const benar = prinsip === labelTopikBenar
                return (
                  <button
                    key={prinsip}
                    type="button"
                    onClick={() => setPrinsipDipilih(prinsip)}
                    aria-pressed={aktif}
                    className={clsx(
                      'rounded-full border px-3 py-1 text-[12.5px] transition',
                      aktif
                        ? benar
                          ? 'border-hijau/60 bg-hijau-soft text-hijau'
                          : 'border-amber/60 bg-amber-soft text-amber'
                        : 'border-line bg-surface text-muted hover:border-ungu/50 hover:text-ink',
                    )}
                  >
                    {prinsip}
                  </button>
                )
              })}
            </div>
            <p className="mt-2 text-[11.5px] text-faint">
              {prinsipDipilih
                ? prinsipDipilih === labelTopikBenar
                  ? `Tepat — fokus utamanya memang pada konsep ${labelTopikBenar}.`
                  : `Menarik, tapi fokus paling dekat soal ini adalah ${labelTopikBenar}.`
                : 'Pilih konsep inti dulu sebelum menghitung atau melihat opsi.'}
            </p>
          </fieldset>
        )}

        <div className="mt-5 space-y-2">
          {(mode === 'pilihan-ganda' || mode === 'pilihan-jamak') &&
            opsiSoal.map((opsi, i) => {
              const aktif =
                mode === 'pilihan-ganda' ? pilihan === i : jamak.includes(i)
              const kunci =
                'jawaban' in soal &&
                (soal.jawaban === i ||
                  (Array.isArray(soal.jawaban) && soal.jawaban.includes(i)))
              return (
                <button
                  key={i}
                  type="button"
                  disabled={sudah}
                  onClick={() =>
                    mode === 'pilihan-ganda'
                      ? (mainkanSuara('pilih'), setPilihan(i))
                      : toggleJamak(i)
                  }
                  aria-pressed={aktif}
                  className={clsx(
                    'flex w-full items-start gap-3 rounded-[10px] border px-3.5 py-3 text-left transition',
                    aktif
                      ? 'border-olive/60 bg-olive-soft/50'
                      : 'border-line bg-surface hover:border-olive/40',
                    sudah && !aktif && 'opacity-80',
                  )}
                >
                  <span
                    className={clsx(
                      'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[12px] font-medium',
                      aktif ? 'border-ungu bg-ungu text-white' : 'border-line text-muted',
                    )}
                  >
                    {HURUF[i]}
                  </span>
                  <span className="text-[15px] leading-relaxed">
                    <TeksMath teks={opsi} />
                  </span>
                  {sudah && kunci && (
                    <Icon nama="cek" ukuran={16} className="ml-auto mt-1 shrink-0 text-hijau" />
                  )}
                </button>
              )
            })}

          {mode === 'isian' && (
            <div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={angka}
                  onChange={(e) => setAngka(e.target.value)}
                  disabled={sudah}
                  inputMode="text"
                  placeholder={signifikanSoal ? `${signifikanSoal} angka penting` : 'mis. 5,67'}
                  aria-label="Jawaban angka"
                  className="min-w-0 flex-1 rounded-[10px] border border-line bg-surface px-4 py-3 text-[16px] outline-none transition focus:border-olive/60 disabled:bg-sunken"
                />
                {!tanpaSatuan && (
                  <input
                    value={satuan}
                    onChange={(e) => setSatuan(e.target.value)}
                    disabled={sudah}
                    placeholder="satuan"
                    aria-label="Satuan"
                    className="rounded-[10px] border border-line bg-surface px-4 py-3 text-[16px] outline-none transition focus:border-olive/60 disabled:bg-sunken sm:w-32"
                  />
                )}
              </div>
              <p className="mt-2 text-[12.5px] leading-relaxed text-faint">
                {tanpaSatuan
                  ? 'Jawaban berupa angka tanpa satuan. Koma desimal diterima (5,67).'
                  : 'Koma desimal diterima (5,67). Tulis satuan secara eksplisit — presisi ikut dinilai.'}
              </p>
            </div>
          )}

          {mode === 'ranking_urutan' && soal.tipe === 'ranking_urutan' && (
            <div className="space-y-2.5">
              <p className="text-[13px] text-muted">
                Susun urutan menggunakan tombol panah ({soal.kriteriaUrut ?? 'posisi 1 paling atas'}):
              </p>
              <div className="space-y-2">
                {urutan.map((idxOpsi, pos) => {
                  const tepat = sudah && soal.jawaban[pos] === idxOpsi
                  const targetPos = soal.jawaban.indexOf(idxOpsi) + 1
                  return (
                    <div
                      key={idxOpsi}
                      className={clsx(
                        'flex items-center gap-3 rounded-[10px] border px-3.5 py-2.5 transition',
                        sudah
                          ? tepat
                            ? 'border-hijau/60 bg-hijau-soft/45'
                            : 'border-korall/50 bg-korall-soft/35'
                          : 'border-line bg-surface',
                      )}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sunken text-[12px] font-semibold tabular-nums text-cyan">
                        {pos + 1}
                      </span>
                      <span className="min-w-0 flex-1 text-[14.5px] leading-relaxed">
                        <TeksMath teks={soal.opsi[idxOpsi]} />
                      </span>
                      {sudah ? (
                        <span
                          className={clsx(
                            'shrink-0 text-[11.5px] font-medium tabular-nums',
                            tepat ? 'text-hijau' : 'text-korall',
                          )}
                        >
                          {tepat ? 'Posisi tepat' : `Seharusnya #${targetPos}`}
                        </span>
                      ) : (
                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            type="button"
                            onClick={() => geserUrutan(pos, -1)}
                            disabled={pos === 0}
                            aria-label={`Naikkan item ${pos + 1}`}
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-line bg-sunken text-[12px] text-ink transition hover:border-cyan/50 disabled:opacity-35"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => geserUrutan(pos, 1)}
                            disabled={pos === urutan.length - 1}
                            aria-label={`Turunkan item ${pos + 1}`}
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-line bg-sunken text-[12px] text-ink transition hover:border-cyan/50 disabled:opacity-35"
                          >
                            ↓
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {mode === 'multi_langkah' && soal.tipe === 'multi_langkah' && (
            <div className="space-y-3">
              <p className="text-[13px] text-muted">
                Selesaikan secara berurutan — hasil satu tahap menjadi masukan tahap berikutnya:
              </p>
              {soal.langkah.map((step, i) => {
                const jw = langkahJawab[i]
                const stepBenar = hasil?.detailLangkah?.[i]
                const tanpaSatStep = step.tipe === 'isian_angka' && (!step.satuan || step.satuan === '—')
                return (
                  <div
                    key={i}
                    className={clsx(
                      'rounded-[12px] border p-3.5 transition',
                      sudah
                        ? stepBenar
                          ? 'border-hijau/50 bg-hijau-soft/30'
                          : 'border-korall/50 bg-korall-soft/30'
                        : 'border-line bg-sunken/40',
                    )}
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-cyan">
                        Langkah {i + 1} dari {soal.langkah.length}
                      </span>
                      {sudah && (
                        <span
                          className={clsx(
                            'text-[11.5px] font-medium',
                            stepBenar ? 'text-hijau' : 'text-korall',
                          )}
                        >
                          {stepBenar ? 'Tepat' : 'Belum tepat'}
                        </span>
                      )}
                    </div>
                    <p className="mb-2.5 text-[14.5px] leading-relaxed text-ink">
                      <TeksMath teks={step.instruksi} />
                    </p>

                    {step.tipe === 'pilihan_ganda' && step.opsi && (
                      <div className="space-y-1.5">
                        {step.opsi.map((op, k) => {
                          const aktif = jw?.tipe === 'pilihan_ganda' && jw.indeks === k
                          const kunci = step.jawaban === k
                          return (
                            <button
                              key={k}
                              type="button"
                              disabled={sudah}
                              onClick={() => ubahLangkahPilihan(i, k)}
                              className={clsx(
                                'flex w-full items-start gap-2.5 rounded-[8px] border px-3 py-2 text-left text-[14px] transition',
                                aktif
                                  ? 'border-olive/60 bg-olive-soft/50'
                                  : 'border-line bg-surface hover:border-olive/40',
                              )}
                            >
                              <span
                                className={clsx(
                                  'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px]',
                                  aktif ? 'border-ungu bg-ungu text-white' : 'border-line text-muted',
                                )}
                              >
                                {HURUF[k]}
                              </span>
                              <span className="flex-1">
                                <TeksMath teks={op} />
                              </span>
                              {sudah && kunci && (
                                <Icon nama="cek" ukuran={14} className="mt-1 shrink-0 text-hijau" />
                              )}
                            </button>
                          )
                        })}
                      </div>
                    )}

                    {step.tipe === 'isian_angka' && (
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <input
                          value={jw?.tipe === 'isian_angka' ? jw.angka : ''}
                          onChange={(e) => ubahLangkahIsian(i, 'angka', e.target.value)}
                          disabled={sudah}
                          inputMode="text"
                          placeholder={step.signifikan ? `${step.signifikan} angka penting` : 'mis. 2,50'}
                          aria-label={`Angka langkah ${i + 1}`}
                          className="min-w-0 flex-1 rounded-[8px] border border-line bg-surface px-3.5 py-2.5 text-[15px] outline-none transition focus:border-olive/60 disabled:bg-sunken"
                        />
                        {!tanpaSatStep && (
                          <input
                            value={jw?.tipe === 'isian_angka' ? jw.satuan : ''}
                            onChange={(e) => ubahLangkahIsian(i, 'satuan', e.target.value)}
                            disabled={sudah}
                            placeholder={`satuan (${step.satuan})`}
                            aria-label={`Satuan langkah ${i + 1}`}
                            className="rounded-[8px] border border-line bg-surface px-3.5 py-2.5 text-[15px] outline-none transition focus:border-olive/60 disabled:bg-sunken sm:w-36"
                          />
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {mode === 'esai' && (
            <div>
              <label htmlFor={`esai-${soal.id}`} className="text-[13px] font-medium text-muted">
                Tulis penalaran &amp; langkah penyelesaianmu
              </label>
              <textarea
                id={`esai-${soal.id}`}
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                disabled={sudah || sedangEvaluasiAi}
                rows={6}
                placeholder="Tulis hukum fisika yang dipakai, penurunan rumus, asumsi, dan kesimpulanmu di sini..."
                className="mt-1.5 w-full resize-y rounded-[10px] border border-line bg-surface px-4 py-3 text-[15.5px] leading-relaxed outline-none transition focus:border-olive/60 disabled:bg-sunken"
              />
              <p className="mt-3 text-[13px] font-medium text-muted">
                Rubrik penilaian (AI akan memeriksa poin-poin ini, atau centang manual jika menilai sendiri):
              </p>
              <div className="mt-2 space-y-1.5">
                {rubrikSoal.map((r, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={sudah || sedangEvaluasiAi}
                    onClick={() =>
                      setRubrik((lama) => lama.map((v, j) => (j === i ? !v : v)))
                    }
                    className={clsx(
                      'flex w-full items-start gap-3 rounded-[10px] border px-3.5 py-2.5 text-left transition',
                      rubrik[i]
                        ? 'border-olive/60 bg-olive-soft/50'
                        : 'border-line bg-surface hover:border-olive/40',
                    )}
                  >
                    <span
                      className={clsx(
                        'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] border',
                        rubrik[i] ? 'border-olive bg-olive text-[#FFFDF9]' : 'border-line',
                      )}
                    >
                      {rubrik[i] && <Icon nama="cek" ukuran={12} />}
                    </span>
                    <span className="text-[14.5px] leading-relaxed">
                      <TeksMath teks={r.poin} />
                    </span>
                    <span className="ml-auto shrink-0 tabular-nums text-[11.5px] text-faint">
                      bobot {r.bobot}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {!sudah && (
          <>
            {peringatan && (
              <p className="mt-4 text-[13.5px] text-korall" role="alert">
                {peringatan}
              </p>
            )}
            {errorAi && (
              <p
                className="mt-4 rounded-[10px] border border-korall/40 bg-korall-soft/50 px-3.5 py-2.5 text-[13.5px] leading-relaxed text-korall"
                role="alert"
              >
                {errorAi}
              </p>
            )}
            {mode === 'esai' ? (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button
                  className="w-full sm:w-auto"
                  onClick={evaluasiDenganAi}
                  disabled={sedangEvaluasiAi}
                >
                  <Icon nama="ai" ukuran={16} />
                  {sedangEvaluasiAi ? 'Pembina AI sedang menilai...' : 'Evaluasi dengan AI'}
                </Button>
                <Button
                  variasi="garis"
                  className="w-full sm:w-auto"
                  onClick={periksa}
                  disabled={sedangEvaluasiAi}
                >
                  Nilai manual dengan rubrik
                </Button>
              </div>
            ) : (
              <Button className="mt-5 w-full sm:w-auto" onClick={periksa}>
                Periksa jawaban
              </Button>
            )}
          </>
        )}
      </div>

      {sudah && hasil && (
        <div
          className={clsx(
            'anim-masuk mt-4 rounded-[14px] border p-5',
            hasil.benar ? 'border-hijau/40 bg-hijau-soft/50' : 'border-korall/40 bg-korall-soft/50',
          )}
        >
          <div className="flex items-center gap-2">
            <Lumi ekspresi={hasil.benar ? 'senang' : 'sedih'} ukuran={40} className="shrink-0" />
            <span
              className={clsx(
                'flex h-7 w-7 items-center justify-center rounded-full',
                hasil.benar ? 'bg-hijau text-[#06210f]' : 'bg-korall text-white',
              )}
            >
              <Icon nama={hasil.benar ? 'cek' : 'silang'} ukuran={15} />
            </span>
            <p className="font-medium">
              {hasil.benar ? 'Tepat.' : hasil.skor > 0 ? 'Sebagian benar.' : 'Belum tepat.'}
            </p>
            <span className="ml-auto tabular-nums text-[12.5px] text-faint">
              skor {Math.round(hasil.skor * 100)}%
            </span>
          </div>

          {hasil.pesan && (
            <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{hasil.pesan}</p>
          )}

          {tersimpan?.tipe === 'esai' && tersimpan.teks && (
            <div className="mt-3 rounded-[10px] border border-line bg-surface/75 p-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">
                Jawabanmu
              </p>
              <p className="mt-1 whitespace-pre-wrap text-[14px] leading-relaxed text-ink/90">
                {tersimpan.teks}
              </p>
            </div>
          )}

          {hasil.evaluasiAi && (
            <div className="mt-4 space-y-3 rounded-[12px] border border-cyan/30 bg-surface/85 p-4">
              <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-cyan">
                <Icon nama="ai" ukuran={14} />
                Evaluasi Pembina AI
              </div>

              {hasil.evaluasiAi.kekuatan.length > 0 && (
                <div>
                  <p className="text-[12.5px] font-medium text-hijau">Yang sudah tepat</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-[13.5px] leading-relaxed text-ink/90">
                    {hasil.evaluasiAi.kekuatan.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {hasil.evaluasiAi.perbaikan.length > 0 && (
                <div>
                  <p className="text-[12.5px] font-medium text-amber">Perlu diperkuat</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-[13.5px] leading-relaxed text-ink/90">
                    {hasil.evaluasiAi.perbaikan.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {hasil.evaluasiAi.konsepTerlewat.length > 0 && (
                <div>
                  <p className="text-[12.5px] font-medium text-magenta">Konsep kunci yang terlewat</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-[13.5px] leading-relaxed text-muted">
                    {hasil.evaluasiAi.konsepTerlewat.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {mode === 'esai' && hasil.evaluasiAi.rubrikHasil.length > 0 && (
                <div className="border-t border-line/80 pt-3">
                  <p className="mb-2 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-faint">
                    Rincian Penilaian Rubrik
                  </p>
                  <div className="space-y-2">
                    {hasil.evaluasiAi.rubrikHasil.map((r) => {
                      const rubrikAsli = rubrikSoal[r.indeks]
                      return (
                        <div
                          key={r.indeks}
                          className="rounded-[8px] border border-line/80 bg-sunken/40 px-3 py-2 text-[13px]"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-medium text-ink">
                              <TeksMath teks={rubrikAsli?.poin ?? `Poin ${r.indeks + 1}`} />
                            </span>
                            <Chip
                              variasi={
                                r.status === 'penuh'
                                  ? 'hijau'
                                  : r.status === 'sebagian'
                                    ? 'amber'
                                    : 'netral'
                              }
                            >
                              {r.status === 'penuh'
                                ? 'Terpenuhi'
                                : r.status === 'sebagian'
                                  ? 'Sebagian'
                                  : 'Belum'}
                            </Chip>
                          </div>
                          <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{r.alasan}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          <p className="mt-3 text-[14px] text-muted">
            <span className="font-medium text-ink">Kunci:</span>{' '}
            <span className="stabilo stabilo--cyan font-medium">
              <TeksMath teks={kunciJawaban(soal)} />
            </span>
          </p>

          <div className="proses-pengerjaan mt-4 rounded-[12px] border border-cyan/25 bg-sunken/80 p-4">
            <p className="mb-3 flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan">
              <Icon nama="kalkulator" ukuran={13} />
              <span>Pembahasan bertahap</span>
            </p>
            <ol className="space-y-3.5">
              {pembahasan.map((langkah, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-cyan/35 bg-cyan-soft/70 font-mono text-[11px] font-semibold text-cyan tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="langkah-isi min-w-0 flex-1 text-[13.75px] leading-[1.72]">
                    <TeksMath teks={langkah} />
                  </div>
                </li>
              ))}
            </ol>
            {(soal.gambar || media) && (
              <FigureSoal
                id={soal.gambar}
                media={media}
                caption={media?.caption ?? 'Gambar yang sama — cocokkan dengan langkah di atas.'}
              />
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button
              className="w-full sm:w-auto"
              variasi={hasil.benar ? 'sukses' : 'utama'}
              onClick={() => majuSoal()}
            >
              {terakhir ? 'Lihat hasil' : 'Soal berikutnya'}
            </Button>
            <Button
              variasi="garis"
              className="w-full sm:w-auto"
              onClick={simpanKeKartuMemori}
              disabled={tersimpanKeMemori}
            >
              <Icon nama="memori" ukuran={15} />
              {tersimpanKeMemori ? 'Tersimpan di Memori' : '+ Simpan ke Kartu Memori'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function HasilSesi({ sesi }: { sesi: SesiKuis }) {
  const navigate = useNavigate()
  const tutupSesi = useStore((s) => s.tutupSesi)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  const soalList = useMemo(
    () => sesi.soalIds.map((id) => soalById.get(id)).filter((s): s is Soal => Boolean(s)),
    [sesi.soalIds],
  )
  const total = soalList.length
  const benar = soalList.filter((s) => sesi.hasil[s.id]?.benar).length
  const skor = total > 0 ? soalList.reduce((t, s) => t + (sesi.hasil[s.id]?.skor ?? 0), 0) / total : 0
  const durasi = Math.round((Date.now() - sesi.mulai) / 1000)

  useEffect(() => {
    mainkanSuara(skor >= 0.7 ? 'rayakan' : skor >= 0.4 ? 'sebagian' : 'salah')
  }, [sesi.id])

  const perTopik = useMemo(() => {
    const peta = new Map<string, { benar: number; total: number }>()
    for (const s of soalList) {
      const v = peta.get(s.topik) ?? { benar: 0, total: 0 }
      v.total += 1
      if (sesi.hasil[s.id]?.benar) v.benar += 1
      peta.set(s.topik, v)
    }
    return [...peta.entries()].sort((a, b) => b[1].total - a[1].total)
  }, [soalList, sesi.hasil])

  function selesaiTujuan(ke: string) {
    tutupSesi()
    navigate(ke)
  }

  return (
    <div className="anim-masuk">
      {skor >= 0.7 && <Konfeti />}
      <header className="mb-6">
        <p className="text-[12px] uppercase tracking-[0.16em] text-faint">
          {sesi.mode === 'simulasi' ? 'Simulasi selesai' : 'Sesi selesai'}
        </p>
        <h1 className="mt-1 text-[2rem] leading-tight">{sesi.judul}</h1>
      </header>

      <div className="kartu p-6 text-center">
        <Lumi
          ekspresi={skor >= 0.7 ? 'raya' : skor >= 0.4 ? 'netral' : 'sedih'}
          ukuran={96}
          className="mx-auto"
        />
        <p className="mt-2 font-display text-[3rem] leading-none">{Math.round(skor * 100)}%</p>
        <p className="mt-2 text-[15px] text-muted">
          {benar} dari {total} soal tepat
        </p>
        <p className="mt-1 text-[12.5px] text-faint">
          {sesi.mode === 'simulasi' ? `Waktu terpakai ${formatWaktu(durasi * 1000)}` : `${formatWaktu(durasi * 1000)} belajar`}
        </p>
        {skor >= 0.7 && (
          <p className="mt-3 text-[14px] font-medium text-amber">
            Luar biasa — Lumi ikut merayakan!
          </p>
        )}
      </div>

      {perTopik.length > 0 && (
        <section className="kartu mt-4">
          <p className="border-b border-line px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-faint">
            Rincian per topik
          </p>
          {perTopik.map(([topik, v]) => (
            <div key={topik} className="flex items-center gap-3 border-t border-line px-5 py-3 first:border-t-0">
              <span className="min-w-0 flex-1 truncate text-[14.5px]">
                {TOPIK[topik] ?? topik}
              </span>
              <div className="w-24">
                <ProgressBar nilai={v.total > 0 ? v.benar / v.total : 0} label={topik} />
              </div>
              <span className="w-12 text-right text-[13px] tabular-nums text-muted">
                {v.benar}/{v.total}
              </span>
            </div>
          ))}
        </section>
      )}

      <section className="mt-4 space-y-2">
        {soalList.map((s, i) => {
          const h = sesi.hasil[s.id]
          return (
            <div key={s.id} className="flex items-center gap-3 rounded-[12px] border border-line bg-surface px-4 py-2.5">
              <span className="w-5 text-[13px] tabular-nums text-faint">{i + 1}</span>
              <span className="min-w-0 flex-1 truncate text-[13.5px] text-muted">
                {TOPIK[s.topik] ?? s.topik} · {labelTipe(s.tipe)}
              </span>
              {h ? (
                h.skor >= 1 ? (
                  <Icon nama="cek" ukuran={16} className="text-hijau" />
                ) : h.skor > 0 ? (
                  <span className="text-[11.5px] text-amber">½</span>
                ) : (
                  <Icon nama="silang" ukuran={16} className="text-korall" />
                )
              ) : (
                <span className="text-[11.5px] text-faint">kosong</span>
              )}
            </div>
          )
        })}
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={() => selesaiTujuan('/peta')}>Kembali ke peta</Button>
        <Button variasi="garis" onClick={() => selesaiTujuan('/latihan')}>
          Latihan lain
        </Button>
      </div>
    </div>
  )
}

export function Kuis() {
  const sesi = useStore((s) => s.sesi)
  const selesaikanSesi = useStore((s) => s.selesaikanSesi)
  const navigate = useNavigate()
  const [detik, setDetik] = useState(() => Math.floor(Date.now() / 1000))

  const simulasi = sesi?.mode === 'simulasi'
  const selesai = Boolean(sesi?.selesai)

  useEffect(() => {
    if (!simulasi || selesai) return
    const id = window.setInterval(() => setDetik(Math.floor(Date.now() / 1000)), 1000)
    return () => window.clearInterval(id)
  }, [simulasi, selesai])

  useEffect(() => {
    if (!sesi?.batasMs || sesi.selesai) return
    if (detik * 1000 >= sesi.mulai + sesi.batasMs) selesaikanSesi()
  }, [detik, sesi, selesaikanSesi])

  if (!sesi) return <Navigate to="/latihan" replace />

  if (sesi.selesai) return <HasilSesi sesi={sesi} />

  const soal = soalById.get(sesi.soalIds[sesi.indeks])
  if (!soal) return <Navigate to="/latihan" replace />

  const sisaMs = sesi.batasMs ? Math.max(0, sesi.mulai + sesi.batasMs - detik * 1000) : null

  return (
    <div className="anim-masuk">
      <div className="mb-5 flex items-center gap-3">
        <button
          onClick={() => navigate('/latihan')}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-muted transition hover:text-ink"
          aria-label="Keluar dari kuis"
        >
          <Icon nama="kembali" ukuran={18} />
        </button>
        <div className="min-w-0">
          <p className="truncate text-[14px] font-medium">{sesi.judul}</p>
          <p className="text-[12px] text-faint">
            {sesi.mode === 'simulasi'
              ? 'Simulasi · 15 menit'
              : sesi.mode === 'kuis-bab'
                ? 'Kuis bab · tanpa batas waktu'
                : sesi.mode === 'ulangan'
                  ? 'Ulangan tertunda · soal baru'
                  : sesi.mode === 'campuran'
                    ? 'Campuran topik & level'
                    : 'Latihan santai · tanpa batas waktu'}
          </p>
        </div>
        {sisaMs !== null && (
          <div className="ml-auto flex items-center gap-1.5">
            <Icon nama="jam" ukuran={15} className={sisaMs < 60_000 ? 'text-korall' : 'text-muted'} />
            <span
              className={clsx(
                'text-[15px] font-medium tabular-nums',
                sisaMs < 60_000 ? 'text-korall' : 'text-ink',
              )}
            >
              {formatWaktu(sisaMs)}
            </span>
          </div>
        )}
      </div>

      <SoalAktif
        key={`${sesi.id}-${soal.id}-${sesi.indeks}`}
        sesi={sesi}
        soal={soal}
        nomor={sesi.indeks + 1}
        total={sesi.soalIds.length}
      />
    </div>
  )
}
