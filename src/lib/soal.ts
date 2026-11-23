import type { Soal } from '@/schemas/soal'
import { skemaBankSoal } from '@/schemas/soal'
import type { Bab } from '../../content/index'

const berkas = import.meta.glob('/content/soal/*.json', { eager: true }) as Record<
  string,
  { default: unknown }
>

function uraikan(isi: unknown, path: string): Soal[] {
  const hasil = skemaBankSoal.safeParse(isi)
  if (!hasil.success) {
    console.error(`Bank soal tidak valid: ${path}`, hasil.error.flatten())
    return []
  }
  return hasil.data
}

export const SEMUA_SOAL: Soal[] = Object.entries(berkas).flatMap(([path, mod]) =>
  uraikan(mod.default, path),
)

export const soalById = new Map(SEMUA_SOAL.map((s) => [s.id, s]))

export function soalUntukBab(bab: Bab): Soal[] {
  if (!bab.soalFile) return []
  const mod = berkas[bab.soalFile]
  return mod ? uraikan(mod.default, bab.soalFile) : []
}

export function soalUntukTopik(topik: string): Soal[] {
  return SEMUA_SOAL.filter((s) => s.topik === topik)
}

export function jumlahSoalTersedia(): number {
  return SEMUA_SOAL.length
}
