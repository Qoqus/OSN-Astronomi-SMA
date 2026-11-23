import type { Level, Modul, SesiKuis } from '@/types'
import type { Attempt } from '@/types'
import type { Soal } from '@/schemas/soal'
import { bobotTopik } from '../../content/frekuensi'

const RASIO_LEVEL: [Level, number][] = [
  ['fondasi', 0.3],
  ['menengah', 0.3],
  ['penalaran', 0.2],
  ['olimpiade', 0.2],
]

function pilihStrata(soal: Soal[], jumlah: number, seed: number): Soal[] {
  const dipakai = new Set<string>()
  const hasil: Soal[] = []
  for (const [level, rasio] of RASIO_LEVEL) {
    const target = Math.round(jumlah * rasio)
    const kandidat = kocok(soal.filter((s) => s.level === level), seed + level.length)
    let ambil = 0
    for (const s of kandidat) {
      if (ambil >= target) break
      if (!dipakai.has(s.id)) {
        hasil.push(s)
        dipakai.add(s.id)
        ambil += 1
      }
    }
  }
  const sisa = kocok(soal.filter((s) => !dipakai.has(s.id)), seed + 99)
  for (const s of sisa) {
    if (hasil.length >= jumlah) break
    hasil.push(s)
    dipakai.add(s.id)
  }
  return kocok(hasil, seed + 7).slice(0, jumlah)
}

function rng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function kocok<T>(daftar: T[], seed: number): T[] {
  const hasil = [...daftar]
  const acak = rng(seed)
  for (let i = hasil.length - 1; i > 0; i -= 1) {
    const j = Math.floor(acak() * (i + 1))
    ;[hasil[i], hasil[j]] = [hasil[j], hasil[i]]
  }
  return hasil
}

function buatSesi(judul: string, mode: Modul, soal: Soal[], babId?: string, batasMs?: number): SesiKuis {
  return {
    id: crypto.randomUUID(),
    mode,
    judul,
    babId,
    soalIds: soal.map((s) => s.id),
    mulai: Date.now(),
    batasMs,
    indeks: 0,
    jawaban: {},
    hasil: {},
    selesai: false,
  }
}

export function sesiKuisBab(judul: string, babId: string, soal: Soal[], jumlah = 10): SesiKuis | null {
  if (soal.length === 0) return null
  return buatSesi(judul, 'kuis-bab', pilihStrata(soal, jumlah, Date.now()), babId)
}

export function sesiSantai(judul: string, soal: Soal[], jumlah = 8): SesiKuis | null {
  if (soal.length === 0) return null
  return buatSesi(judul, 'santai', kocok(soal, Date.now()).slice(0, jumlah))
}

export function sesiKhusus(judul: string, soal: Soal[], jumlah = 10): SesiKuis | null {
  if (soal.length === 0) return null
  return buatSesi(judul, 'santai', soal.slice(0, jumlah))
}

export function sesiCampuran(soal: Soal[], jumlah = 8, seed = Date.now()): SesiKuis | null {
  if (soal.length === 0) return null
  const topik = kocok([...new Set(soal.map((s) => s.topik))], seed)
  const level: Level[] = ['fondasi', 'menengah', 'penalaran', 'olimpiade']
  const kandidat = new Map(
    topik.map((nama) => [
      nama,
      new Map(level.map((l) => [l, kocok(soal.filter((s) => s.topik === nama && s.level === l), seed + nama.length + l.length)])),
    ]),
  )
  const hasil: Soal[] = []
  let putaran = 0
  while (hasil.length < jumlah && hasil.length < soal.length) {
    let ada = false
    for (const nama of topik) {
      const daftarLevel = kandidat.get(nama)
      if (!daftarLevel) continue
      for (let i = 0; i < level.length; i += 1) {
        const l = level[(putaran + i) % level.length]
        const berikut = daftarLevel.get(l)?.shift()
        if (berikut) {
          hasil.push(berikut)
          ada = true
          break
        }
      }
      if (hasil.length >= jumlah) break
    }
    if (!ada) break
    putaran += 1
  }
  return buatSesi('Latihan campuran', 'campuran', hasil)
}

export function sesiUlangan(
  topik: string,
  soal: Soal[],
  attempts: Attempt[],
  jumlah = 8,
): SesiKuis | null {
  const pernah = new Set(attempts.filter((a) => a.topik === topik).map((a) => a.soalId))
  const belumPernah = soal.filter((s) => s.topik === topik && !pernah.has(s.id))
  if (belumPernah.length === 0) return null
  return buatSesi(`Ulangi: ${topik}`, 'ulangan', kocok(belumPernah, Date.now()).slice(0, jumlah))
}

export function sesiSimulasi(
  soal: Soal[],
  topikLemah: string[],
  jumlah = 10,
  seed = Date.now(),
): SesiKuis | null {
  if (soal.length === 0) return null
  const acak = rng(seed)
  const terpilih: Soal[] = []
  const dipakai = new Set<string>()
  const jumlahLemah = Math.round(jumlah * 0.6)

  const kandidatLemah = kocok(soal.filter((s) => topikLemah.includes(s.topik)), seed + 1)
  for (const s of kandidatLemah) {
    if (terpilih.length >= jumlahLemah) break
    if (!dipakai.has(s.id)) {
      terpilih.push(s)
      dipakai.add(s.id)
    }
  }

  const sisa = soal.filter((s) => !dipakai.has(s.id))
  while (terpilih.length < jumlah && sisa.length > 0) {
    const totalBobot = sisa.reduce((t, s) => t + bobotTopik(s.topik), 0)
    let sasaran = acak() * totalBobot
    let indeks = 0
    for (; indeks < sisa.length; indeks += 1) {
      sasaran -= bobotTopik(sisa[indeks].topik)
      if (sasaran <= 0) break
    }
    const ambil = sisa.splice(Math.min(indeks, sisa.length - 1), 1)[0]
    terpilih.push(ambil)
    dipakai.add(ambil.id)
  }

  if (!terpilih.some((s) => s.level === 'penalaran')) {
    const penalaran = soal.find((s) => s.level === 'penalaran' && !dipakai.has(s.id))
    if (penalaran) {
      terpilih[terpilih.length - 1] = penalaran
      dipakai.add(penalaran.id)
    }
  }

  if (!terpilih.some((s) => s.level === 'olimpiade')) {
    const olimpiade = soal.find((s) => s.level === 'olimpiade' && !dipakai.has(s.id))
    if (olimpiade) {
      const ganti = terpilih.findIndex((s) => s.level === 'fondasi' || s.level === 'menengah')
      terpilih[ganti >= 0 ? ganti : terpilih.length - 1] = olimpiade
      dipakai.add(olimpiade.id)
    }
  }

  return buatSesi('Simulasi OSN', 'simulasi', terpilih, undefined, 15 * 60 * 1000)
}
