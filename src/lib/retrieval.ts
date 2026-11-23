import type { Attempt } from '@/types'
import type { Soal } from '@/schemas/soal'

const HARI_MS = 24 * 60 * 60 * 1000
const JEDA_HARI = [1, 3, 7] as const

export interface UlanganTopik {
  topik: string
  jatuhTempoPada: number
  hariTersisa: number
  soalBaru: Soal[]
  cukupSoal: boolean
}

export function jadwalUlangan(
  attempts: Attempt[],
  soal: Soal[],
  sekarang = Date.now(),
): UlanganTopik[] {
  const topik = new Set(attempts.map((a) => a.topik))
  const hasil: UlanganTopik[] = []

  for (const nama of topik) {
    const terkait = attempts
      .filter((a) => a.topik === nama)
      .sort((a, b) => b.saat - a.saat)
    const terakhir = terkait[0]
    if (!terakhir) continue

    const seen = new Set<string>()
    let benarBeruntun = 0
    for (const attempt of terkait) {
      if (seen.has(attempt.soalId)) continue
      seen.add(attempt.soalId)
      if (attempt.skor < 0.7) break
      benarBeruntun += 1
    }
    const jeda =
      terakhir.skor < 0.7
        ? JEDA_HARI[0]
        : JEDA_HARI[Math.min(benarBeruntun, JEDA_HARI.length - 1)]
    const jatuhTempoPada = terakhir.saat + jeda * HARI_MS
    if (sekarang < jatuhTempoPada) continue

    const sudahDikerjakan = new Set(terkait.map((a) => a.soalId))
    const soalBaru = soal.filter((s) => s.topik === nama && !sudahDikerjakan.has(s.id)).slice(0, 8)
    hasil.push({
      topik: nama,
      jatuhTempoPada,
      hariTersisa: Math.max(0, Math.ceil((jatuhTempoPada - sekarang) / HARI_MS)),
      soalBaru,
      cukupSoal: soalBaru.length >= 8,
    })
  }

  return hasil.sort((a, b) => a.jatuhTempoPada - b.jatuhTempoPada)
}
