import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { useStore } from '@/state/user-store'
import {
  KARTU_MEMORI_BAWAAN,
  KATEGORI_MEMORI,
  LATIHAN_KONSTANTA,
  LATIHAN_URUTAN,
} from '../../content/memori'
import { TOPIK } from '../../content/index'
import { parseAngka } from '@/lib/grading/parse-angka'
import {
  estimasiLabelInterval,
  kartuJatuhTempo,
  ringkasanSrs,
  soalBookmark,
  soalKesalahanAktif,
  type NilaiIngatan,
} from '@/lib/srs'
import { kunciJawaban } from '@/lib/grading'
import { pembahasanSoal } from '@/schemas/soal'
import { kocok, sesiKhusus } from '@/lib/quiz-builder'
import { mainkanSuara } from '@/lib/sound'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { TeksMath } from '@/components/ui/TeksMath'
import type { KartuMemori } from '@/types'

type TabMemori = 'kartu' | 'konstanta' | 'urutan' | 'kesalahan'

const EMPTY_KARTU: KartuMemori[] = []

function BagianKartuKilas() {
  const srs = useStore((s) => s.state.srs)
  const kartuKustom = useStore((s) => s.state.kartuKustom ?? EMPTY_KARTU)
  const ulasKartuSrs = useStore((s) => s.ulasKartuSrs)
  const tambahKartuKustom = useStore((s) => s.tambahKartuKustom)
  const hapusKartuKustom = useStore((s) => s.hapusKartuKustom)

  const [kategori, setKategori] = useState<string>('Semua')
  const [bukaJawaban, setBukaJawaban] = useState(false)
  const [bukaPetunjuk, setBukaPetunjuk] = useState(false)
  const [modeSemua, setModeSemua] = useState(false)
  const [indeksSemua, setIndeksSemua] = useState(0)
  const [bukaForm, setBukaForm] = useState(false)
  const [depanBaru, setDepanBaru] = useState('')
  const [belakangBaru, setBelakangBaru] = useState('')
  const [kategoriBaru, setKategoriBaru] = useState<string>('Konstanta & Satuan')
  const [sesiUlas, setSesiUlas] = useState(0)

  const semuaKartu = useMemo(
    () => [...kartuKustom, ...KARTU_MEMORI_BAWAAN],
    [kartuKustom],
  )

  const tersaring = useMemo(() => {
    if (kategori === 'Semua') return semuaKartu
    if (kategori === 'Kartu Saya') return kartuKustom
    return semuaKartu.filter((k) => k.kategori === kategori)
  }, [semuaKartu, kartuKustom, kategori])

  const ringkas = useMemo(() => ringkasanSrs(tersaring, srs), [tersaring, srs])
  const antrean = useMemo(() => kartuJatuhTempo(tersaring, srs), [tersaring, srs])

  const kartuAktif = modeSemua
    ? tersaring[indeksSemua % Math.max(1, tersaring.length)]
    : antrean[0]

  function nilai(n: NilaiIngatan) {
    if (!kartuAktif) return
    mainkanSuara(n === 0 ? 'salah' : n === 1 ? 'sebagian' : 'benar')
    ulasKartuSrs(kartuAktif.id, n)
    setBukaJawaban(false)
    setBukaPetunjuk(false)
    setSesiUlas((x) => x + 1)
    if (modeSemua) {
      setIndeksSemua((i) => (i + 1) % Math.max(1, tersaring.length))
    }
  }

  function buatKartu(e: React.FormEvent) {
    e.preventDefault()
    if (!depanBaru.trim() || !belakangBaru.trim()) return
    tambahKartuKustom({
      kategori: kategoriBaru,
      depan: depanBaru.trim(),
      belakang: belakangBaru.trim(),
    })
    mainkanSuara('benar')
    setDepanBaru('')
    setBelakangBaru('')
    setBukaForm(false)
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="kartu p-3.5">
          <p className="text-[12px] text-faint">Jatuh tempo</p>
          <p className="mt-1 font-display text-[1.5rem] tabular-nums text-cyan">
            {ringkas.jatuhTempo}
          </p>
        </div>
        <div className="kartu p-3.5">
          <p className="text-[12px] text-faint">Belum pernah diulas</p>
          <p className="mt-1 font-display text-[1.5rem] tabular-nums">{ringkas.baru}</p>
        </div>
        <div className="kartu p-3.5">
          <p className="text-[12px] text-faint">Sudah mengendap</p>
          <p className="mt-1 font-display text-[1.5rem] tabular-nums text-hijau">
            {ringkas.mengendap}
          </p>
        </div>
        <div className="kartu p-3.5">
          <p className="text-[12px] text-faint">Sesi ini</p>
          <p className="mt-1 font-display text-[1.5rem] tabular-nums text-amber">{sesiUlas}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {['Semua', ...KATEGORI_MEMORI, 'Kartu Saya'].map((kat) => (
            <button
              key={kat}
              type="button"
              onClick={() => {
                setKategori(kat)
                setBukaJawaban(false)
                setBukaPetunjuk(false)
                setIndeksSemua(0)
              }}
              className={clsx(
                'whitespace-nowrap shrink-0 rounded-[8px] border px-3 py-1.5 text-[12.5px] transition',
                kategori === kat
                  ? 'border-ungu/70 bg-ungu-soft text-ungu'
                  : 'border-line bg-surface text-muted hover:text-ink',
              )}
            >
              {kat}
            </button>
          ))}
        </div>

        <Button variasi="garis" onClick={() => setBukaForm((v) => !v)}>
          <Icon nama="plus" ukuran={15} />
          Buat kartu baru
        </Button>
      </div>

      {bukaForm && (
        <form onSubmit={buatKartu} className="kartu anim-masuk space-y-3 p-5">
          <p className="font-display text-[1.1rem]">Tambah Kartu Memori Sendiri</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-[12.5px] text-muted">Kategori</span>
              <select
                value={kategoriBaru}
                onChange={(e) => setKategoriBaru(e.target.value)}
                className="mt-1 w-full rounded-[10px] border border-line bg-sunken px-3 py-2 text-[14px] text-ink outline-none focus:border-ungu/60"
              >
                {KATEGORI_MEMORI.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="block">
            <span className="text-[12.5px] text-muted">Sisi depan (pertanyaan / pemicu ingatan, mendukung LaTeX `$...$`)</span>
            <textarea
              value={depanBaru}
              onChange={(e) => setDepanBaru(e.target.value)}
              rows={2}
              placeholder="Contoh: Berapa nilai konstanta Stefan–Boltzmann $\sigma$?"
              className="mt-1 w-full rounded-[10px] border border-line bg-sunken px-3.5 py-2.5 text-[14.5px] outline-none focus:border-ungu/60"
            />
          </label>
          <label className="block">
            <span className="text-[12.5px] text-muted">Sisi belakang (jawaban &amp; catatan)</span>
            <textarea
              value={belakangBaru}
              onChange={(e) => setBelakangBaru(e.target.value)}
              rows={3}
              placeholder="Contoh: $\sigma = 5{,}67 \times 10^{-8}\text{ W m}^{-2}\text{ K}^{-4}$"
              className="mt-1 w-full rounded-[10px] border border-line bg-sunken px-3.5 py-2.5 text-[14.5px] outline-none focus:border-ungu/60"
            />
          </label>
          <div className="flex gap-2">
            <Button type="submit" disabled={!depanBaru.trim() || !belakangBaru.trim()}>
              Simpan kartu
            </Button>
            <Button type="button" variasi="garis" onClick={() => setBukaForm(false)}>
              Batal
            </Button>
          </div>
        </form>
      )}

      {!kartuAktif ? (
        <div className="kartu p-6 text-center space-y-3">
          <p className="font-display text-[1.25rem]">
            {tersaring.length === 0
              ? 'Belum ada kartu di kategori ini.'
              : 'Semua kartu di kategori ini sudah diulas!'}
          </p>
          <p className="mx-auto max-w-[48ch] text-[14.5px] text-muted">
            {tersaring.length === 0
              ? 'Tambahkan kartu memorimu sendiri atau pilih kategori lain.'
              : 'Algoritma SM-2 akan memunculkan ulang tiap kartu tepat sebelum kamu hampir lupa.'}
          </p>
          {tersaring.length > 0 && (
            <Button variasi="garis" onClick={() => setModeSemua(true)}>
              Latih bebas seluruh {tersaring.length} kartu
            </Button>
          )}
        </div>
      ) : (
        <div className="kartu overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-sunken/50 px-5 py-3 text-[12.5px] text-faint">
            <span>
              {kartuAktif.kategori}
              {kartuAktif.kustom ? ' · Kartu kustom' : ''}
              {srs?.[kartuAktif.id]?.repetisi
                ? ` · Diingat ${srs[kartuAktif.id].repetisi}×`
                : ' · Kartu baru'}
            </span>
            <div className="flex items-center gap-3">
              {modeSemua ? (
                <button
                  type="button"
                  onClick={() => setModeSemua(false)}
                  className="text-cyan hover:underline"
                >
                  Kembali ke antrean jatuh tempo
                </button>
              ) : (
                <span className="tabular-nums">{antrean.length} tersisa</span>
              )}
              {kartuAktif.kustom && (
                <button
                  type="button"
                  onClick={() => hapusKartuKustom(kartuAktif.id)}
                  className="inline-flex items-center gap-1 text-korall hover:underline"
                >
                  <Icon nama="hapus" ukuran={14} /> Hapus
                </button>
              )}
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div className="min-h-[96px] text-[17px] leading-relaxed">
              <TeksMath teks={kartuAktif.depan} />
            </div>

            {kartuAktif.petunjuk && !bukaJawaban && (
              <div>
                {bukaPetunjuk ? (
                  <p className="rounded-[10px] border border-line bg-sunken/60 px-3.5 py-2 text-[13.5px] text-muted">
                    Petunjuk: {kartuAktif.petunjuk}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => setBukaPetunjuk(true)}
                    className="text-[13px] text-cyan hover:underline underline-offset-4"
                  >
                    Tampilkan petunjuk
                  </button>
                )}
              </div>
            )}

            {!bukaJawaban ? (
              <div className="pt-2">
                <Button
                  onClick={() => {
                    mainkanSuara('flip')
                    setBukaJawaban(true)
                  }}
                >
                  Balik kartu &amp; cek ingatan
                </Button>
              </div>
            ) : (
              <div className="anim-masuk space-y-4 border-t border-line pt-4">
                <div className="rounded-[12px] border border-ungu/30 bg-ungu-soft/25 p-4 text-[15.5px] leading-relaxed">
                  <TeksMath teks={kartuAktif.belakang} />
                </div>

                <div>
                  <p className="mb-2 text-[12.5px] text-muted">
                    Seberapa kuat ingatanmu sebelum membuka jawaban?
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {(
                      [
                        { v: 0 as NilaiIngatan, label: 'Lupa', gaya: 'border-korall/40 bg-korall-soft/50 text-korall' },
                        { v: 1 as NilaiIngatan, label: 'Sulit', gaya: 'border-amber/40 bg-amber-soft/50 text-amber' },
                        { v: 2 as NilaiIngatan, label: 'Ingat', gaya: 'border-cyan/40 bg-cyan-soft/50 text-cyan' },
                        { v: 3 as NilaiIngatan, label: 'Mudah', gaya: 'border-hijau/40 bg-hijau-soft/50 text-hijau' },
                      ] as const
                    ).map((tombol) => (
                      <button
                        key={tombol.v}
                        type="button"
                        onClick={() => nilai(tombol.v)}
                        className={clsx(
                          'flex flex-col items-center justify-center rounded-[10px] border px-3 py-2.5 text-center transition hover:brightness-110',
                          tombol.gaya,
                        )}
                      >
                        <span className="text-[14px] font-medium">{tombol.label}</span>
                        <span className="mt-0.5 font-mono text-[11.5px] opacity-85">
                          {estimasiLabelInterval(srs?.[kartuAktif.id], tombol.v)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function BagianKonstanta() {
  const terbaik = useStore((s) => s.state.drillStats?.konstantaTerbaik ?? 0)
  const catatHasilDrill = useStore((s) => s.catatHasilDrill)

  const [daftar, setDaftar] = useState(() => kocok(LATIHAN_KONSTANTA, Date.now()).slice(0, 6))
  const [indeks, setIndeks] = useState(0)
  const [masukan, setMasukan] = useState('')
  const [hasil, setHasil] = useState<{ benar: boolean; pesan: string } | null>(null)
  const [benarTotal, setBenarTotal] = useState(0)
  const [selesai, setSelesai] = useState(false)

  const soal = daftar[indeks]

  function cek(e: React.FormEvent) {
    e.preventDefault()
    if (!soal || hasil) return
    const terurai = parseAngka(masukan)
    if (!terurai) {
      mainkanSuara('salah')
      setHasil({
        benar: false,
        pesan: 'Format angka belum terbaca. Gunakan misalnya `3,26` atau `1.496e8`.',
      })
      return
    }
    const selisihRel = Math.abs(terurai.nilai - soal.jawaban) / Math.abs(soal.jawaban)
    const benar = selisihRel <= soal.toleransiRel
    mainkanSuara(benar ? 'benar' : 'salah')
    if (benar) setBenarTotal((b) => b + 1)
    setHasil({
      benar,
      pesan: benar
        ? `Tepat! Nilai baku: ${soal.tampilBenar}.`
        : `Belum tepat — jawabanmu terbaca ${terurai.nilai}. Nilai baku: ${soal.tampilBenar}.`,
    })
  }

  function lanjut() {
    if (indeks + 1 >= daftar.length) {
      const persen = Math.round((benarTotal / daftar.length) * 100)
      mainkanSuara(persen >= 70 ? 'rayakan' : 'sebagian')
      catatHasilDrill('konstanta', persen, benarTotal * 4)
      setSelesai(true)
      return
    }
    setIndeks((i) => i + 1)
    setMasukan('')
    setHasil(null)
  }

  function ulang() {
    setDaftar(kocok(LATIHAN_KONSTANTA, Date.now()).slice(0, 6))
    setIndeks(0)
    setMasukan('')
    setHasil(null)
    setBenarTotal(0)
    setSelesai(false)
  }

  if (selesai) {
    const persen = Math.round((benarTotal / daftar.length) * 100)
    return (
      <div className="kartu anim-masuk p-6 text-center space-y-3">
        <p className="text-[12.5px] text-faint">Sesi Tantangan Konstanta selesai</p>
        <p className="font-display text-[2.5rem] tabular-nums">{persen}%</p>
        <p className="text-[14.5px] text-muted">
          {benarTotal} dari {daftar.length} konstanta tepat · +{benarTotal * 4} XP
        </p>
        <Button onClick={ulang}>
          <Icon nama="ulang" ukuran={15} />
          Putaran baru (6 konstanta acak)
        </Button>
      </div>
    )
  }

  return (
    <div className="kartu p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-[12.5px] text-faint">
        <span>
          Konstanta {indeks + 1} dari {daftar.length}
        </span>
        <span className="tabular-nums">Rekor terbaik: {terbaik}%</span>
      </div>

      <div className="text-[17px] leading-relaxed">
        <TeksMath teks={soal.pertanyaan} />
      </div>

      <form onSubmit={cek} className="flex flex-col gap-2 sm:flex-row">
        <input
          value={masukan}
          onChange={(e) => setMasukan(e.target.value)}
          disabled={Boolean(hasil)}
          placeholder="Ketik angka (mis. 1.496e8 atau 29,53)"
          className="min-w-0 flex-1 rounded-[10px] border border-line bg-sunken px-4 py-2.5 font-mono text-[15px] outline-none focus:border-ungu/60 disabled:opacity-75"
        />
        {soal.satuan !== '—' && (
          <span className="flex items-center rounded-[10px] border border-line bg-sunken px-3.5 py-2.5 font-mono text-[14px] text-muted">
            {soal.satuan}
          </span>
        )}
        {!hasil && (
          <Button type="submit" disabled={!masukan.trim()}>
            Periksa
          </Button>
        )}
      </form>

      {hasil && (
        <div
          className={clsx(
            'anim-masuk rounded-[12px] border p-4 space-y-2',
            hasil.benar
              ? 'border-hijau/40 bg-hijau-soft/40'
              : 'border-korall/40 bg-korall-soft/40',
          )}
        >
          <p className="text-[14.5px] font-medium">
            {hasil.benar ? '✓ Benar' : '✕ Perlu diingat lagi'} — {hasil.pesan}
          </p>
          <p className="text-[13.5px] text-muted">{soal.penjelasan}</p>
          <Button onClick={lanjut} className="mt-2">
            {indeks + 1 >= daftar.length ? 'Lihat skor sesi' : 'Konstanta berikutnya'}
          </Button>
        </div>
      )}
    </div>
  )
}

function BagianUrutan() {
  const terbaik = useStore((s) => s.state.drillStats?.urutanTerbaik ?? 0)
  const catatHasilDrill = useStore((s) => s.catatHasilDrill)

  const [indeks, setIndeks] = useState(0)
  const soal = LATIHAN_URUTAN[indeks % LATIHAN_URUTAN.length]
  const [susunan, setSusunan] = useState<string[]>(() =>
    kocok(LATIHAN_URUTAN[0].itemBenar, Date.now()),
  )
  const [diperiksa, setDiperiksa] = useState(false)
  const [skorTerakhir, setSkorTerakhir] = useState<number | null>(null)

  function pindah(dari: number, ke: number) {
    if (diperiksa || ke < 0 || ke >= susunan.length) return
    mainkanSuara('pilih')
    const baru = [...susunan]
    const [el] = baru.splice(dari, 1)
    baru.splice(ke, 0, el)
    setSusunan(baru)
  }

  function periksa() {
    const cocok = susunan.filter((item, i) => item === soal.itemBenar[i]).length
    const persen = Math.round((cocok / soal.itemBenar.length) * 100)
    mainkanSuara(persen === 100 ? 'rayakan' : persen >= 50 ? 'sebagian' : 'salah')
    setSkorTerakhir(persen)
    setDiperiksa(true)
    catatHasilDrill('urutan', persen, cocok * 2)
  }

  function berikut() {
    const nextIdx = (indeks + 1) % LATIHAN_URUTAN.length
    setIndeks(nextIdx)
    setSusunan(kocok(LATIHAN_URUTAN[nextIdx].itemBenar, Date.now() + nextIdx))
    setDiperiksa(false)
    setSkorTerakhir(null)
  }

  return (
    <div className="kartu p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-[12.5px] text-faint">
        <span>
          Tantangan Urutan {indeks + 1}/{LATIHAN_URUTAN.length} · {soal.judul}
        </span>
        <span className="tabular-nums">Rekor terbaik: {terbaik}%</span>
      </div>

      <p className="font-display text-[1.15rem]">{soal.kriteria}</p>

      <div className="space-y-2">
        {susunan.map((item, i) => {
          const benarPosisi = diperiksa && item === soal.itemBenar[i]
          const salahPosisi = diperiksa && item !== soal.itemBenar[i]
          return (
            <div
              key={item}
              className={clsx(
                'flex items-center gap-3 rounded-[10px] border px-3.5 py-2.5 transition',
                benarPosisi
                  ? 'border-hijau/50 bg-hijau-soft/40'
                  : salahPosisi
                    ? 'border-korall/50 bg-korall-soft/40'
                    : 'border-line bg-sunken/70',
              )}
            >
              <span className="w-6 text-center font-mono text-[13px] tabular-nums text-faint">
                {i + 1}.
              </span>
              <span className="flex-1 text-[14.5px]">{item}</span>
              {!diperiksa ? (
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => pindah(i, i - 1)}
                    disabled={i === 0}
                    aria-label="Naikkan urutan"
                    className="rounded-[7px] border border-line bg-surface px-2.5 py-1 text-[12.5px] text-muted hover:text-ink disabled:opacity-35"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => pindah(i, i + 1)}
                    disabled={i === susunan.length - 1}
                    aria-label="Turunkan urutan"
                    className="rounded-[7px] border border-line bg-surface px-2.5 py-1 text-[12.5px] text-muted hover:text-ink disabled:opacity-35"
                  >
                    ↓
                  </button>
                </div>
              ) : (
                <span className={clsx('text-[12.5px] font-medium', benarPosisi ? 'text-hijau' : 'text-korall')}>
                  {benarPosisi ? 'Tepat' : `Seharusnya #${soal.itemBenar.indexOf(item) + 1}`}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {!diperiksa ? (
        <Button onClick={periksa}>Periksa urutan</Button>
      ) : (
        <div className="anim-masuk space-y-2 rounded-[12px] border border-line bg-sunken/60 p-4">
          <p className="text-[14.5px] font-medium">
            Skor urutan: {skorTerakhir}% · Urutan baku: {soal.itemBenar.join(' → ')}
          </p>
          <p className="text-[13.5px] text-muted">{soal.penjelasan}</p>
          <Button onClick={berikut} className="mt-2">
            Tantangan berikutnya
          </Button>
        </div>
      )}
    </div>
  )
}

function BagianKesalahan() {
  const state = useStore((s) => s.state)
  const mulaiSesi = useStore((s) => s.mulaiSesi)
  const toggleBookmarkSoal = useStore((s) => s.toggleBookmarkSoal)
  const tambahKartuKustom = useStore((s) => s.tambahKartuKustom)
  const navigate = useNavigate()
  const [dibuatId, setDibuatId] = useState<string | null>(null)

  const salahList = useMemo(() => soalKesalahanAktif(state.attempts), [state.attempts])
  const bookmarkList = useMemo(() => soalBookmark(state), [state])

  function latih(daftar: typeof salahList, judul: string) {
    const sesi = sesiKhusus(judul, kocok(daftar, Date.now()), 10)
    if (sesi) {
      mulaiSesi(sesi)
      navigate('/kuis')
    }
  }

  function jadikanKartu(s: (typeof salahList)[number]) {
    tambahKartuKustom({
      kategori: TOPIK[s.topik] ?? 'Rumus Inti',
      depan: s.soal,
      belakang: `**Kunci:** ${kunciJawaban(s)}\n\n${pembahasanSoal(s).join(' ')}`,
    })
    setDibuatId(s.id)
    window.setTimeout(() => setDibuatId(null), 2000)
  }

  return (
    <div className="space-y-6">
      <section className="kartu p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[1.15rem]">Bank Kesalahan Aktif ({salahList.length})</h2>
            <p className="mt-1 text-[13.5px] text-muted">
              Soal yang pernah meleset dan belum kamu jawab benar sempurna setelahnya.
            </p>
          </div>
          {salahList.length > 0 && (
            <Button onClick={() => latih(salahList, 'Latih ulang kesalahan')}>
              Latih ulang kesalahan
            </Button>
          )}
        </div>

        {salahList.length === 0 ? (
          <p className="rounded-[10px] border border-dashed border-line p-4 text-[14px] text-muted">
            Belum ada soal kesalahan aktif. Soal yang salah saat kuis akan otomatis masuk ke sini agar mudah diulang.
          </p>
        ) : (
          <div className="divide-y divide-line border-t border-line">
            {salahList.slice(0, 12).map((s) => (
              <div key={s.id} className="py-3.5 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] text-faint">
                  <span>
                    {TOPIK[s.topik] ?? s.topik} · {s.level} · {s.tipe}
                  </span>
                  <button
                    type="button"
                    onClick={() => jadikanKartu(s)}
                    className="text-cyan hover:underline"
                  >
                    {dibuatId === s.id ? 'Ditambahkan ke Kartu Kilas!' : '+ Jadikan Kartu Memori'}
                  </button>
                </div>
                <div className="text-[14.5px] leading-relaxed">
                  <TeksMath teks={s.soal} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="kartu p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[1.15rem]">Soal Tersimpan / Bookmark ({bookmarkList.length})</h2>
            <p className="mt-1 text-[13.5px] text-muted">
              Tandai soal penting saat mengerjakan kuis untuk dikumpulkan dan diulang di sini.
            </p>
          </div>
          {bookmarkList.length > 0 && (
            <Button variasi="garis" onClick={() => latih(bookmarkList, 'Latihan soal tersimpan')}>
              Latih soal tersimpan
            </Button>
          )}
        </div>

        {bookmarkList.length === 0 ? (
          <p className="rounded-[10px] border border-dashed border-line p-4 text-[14px] text-muted">
            Belum ada soal yang ditandai. Klik ikon bookmark saat mengerjakan kuis untuk menyimpannya.
          </p>
        ) : (
          <div className="divide-y divide-line border-t border-line">
            {bookmarkList.map((s) => (
              <div key={s.id} className="py-3.5 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] text-faint">
                  <span>
                    {TOPIK[s.topik] ?? s.topik} · {s.level}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleBookmarkSoal(s.id)}
                    className="text-korall hover:underline"
                  >
                    Hapus tanda
                  </button>
                </div>
                <div className="text-[14.5px] leading-relaxed">
                  <TeksMath teks={s.soal} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export function Memori() {
  const [tab, setTab] = useState<TabMemori>('kartu')
  const state = useStore((s) => s.state)

  const salahCount = useMemo(() => soalKesalahanAktif(state.attempts).length, [state.attempts])

  return (
    <div className="anim-masuk space-y-6">
      <header>
        <h1 className="text-[1.9rem] leading-tight">Pusat Memori &amp; Hafalan</h1>
        <p className="mt-1.5 max-w-[60ch] text-[15px] leading-relaxed text-muted">
          Latih ingatan jangka panjang untuk konstanta, rumus, klasifikasi spektrum, dan soal yang sering meleset dengan penjadwalan berulang (SM-2).
        </p>
      </header>

      <div className="flex flex-wrap gap-1 rounded-[12px] border border-line bg-surface p-1" role="tablist">
        {(
          [
            { id: 'kartu', label: 'Kartu Kilas (SRS)' },
            { id: 'konstanta', label: 'Tebak Konstanta' },
            { id: 'urutan', label: 'Tantangan Urutan' },
            { id: 'kesalahan', label: `Bank Kesalahan (${salahCount})` },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={clsx(
              'whitespace-nowrap shrink-0 rounded-[9px] px-3.5 py-2 text-[13.5px] font-medium transition',
              tab === t.id ? 'bg-ungu text-white' : 'text-muted hover:text-ink',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'kartu' && <BagianKartuKilas />}
      {tab === 'konstanta' && <BagianKonstanta />}
      {tab === 'urutan' && <BagianUrutan />}
      {tab === 'kesalahan' && <BagianKesalahan />}
    </div>
  )
}
