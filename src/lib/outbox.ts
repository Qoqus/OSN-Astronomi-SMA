import type { Attempt, Gamifikasi, ProgressBab } from '@/types'

export type Operasi =
  | { kunci: string; jenis: 'attempt'; profilId: string; attempt: Attempt }
  | { kunci: string; jenis: 'progress'; profilId: string; babId: string; progress: ProgressBab }
  | { kunci: string; jenis: 'capaian'; profilId: string; capaianId: string }
  | { kunci: string; jenis: 'gamifikasi'; profilId: string; gamifikasi: Gamifikasi }

const KUNCI = 'ruanglangit.outbox'
const BATAS = 200

function penyimpanan(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null
  } catch {
    return null
  }
}

function baca(): Operasi[] {
  try {
    const mentah = penyimpanan()?.getItem(KUNCI)
    if (!mentah) return []
    const isi = JSON.parse(mentah) as unknown
    return Array.isArray(isi) ? (isi as Operasi[]) : []
  } catch {
    return []
  }
}

function tulis(daftar: Operasi[]): void {
  try {
    const simpan = penyimpanan()
    if (!simpan) return
    if (daftar.length === 0) simpan.removeItem(KUNCI)
    else simpan.setItem(KUNCI, JSON.stringify(daftar.slice(-BATAS)))
  } catch (e) {
    console.warn('Gagal menyimpan antrean offline.', e)
  }
}

export function antrekan(op: Operasi): void {
  const daftar = baca().filter((x) => x.kunci !== op.kunci)
  daftar.push(op)
  tulis(daftar)
}

export function bacaAntrean(): Operasi[] {
  return baca()
}

export function hapusDariAntrean(kunci: string): void {
  tulis(baca().filter((op) => op.kunci !== kunci))
}

export function jumlahAntrean(): number {
  return baca().length
}
