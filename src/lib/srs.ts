import type { Attempt, KartuMemori, LearningState, SrsKartu } from '@/types'
import { soalById } from './soal'
import type { Soal } from '@/schemas/soal'

export type NilaiIngatan = 0 | 1 | 2 | 3 // 0: Lupa, 1: Sulit, 2: Ingat, 3: Mudah

const HARI_MS = 24 * 60 * 60 * 1000
const MENIT_MS = 60 * 1000

export function kartuSrsAwal(sekarang = Date.now()): SrsKartu {
  return {
    intervalHari: 0,
    ease: 2.5,
    repetisi: 0,
    jatuhTempo: sekarang,
    terakhirUlas: 0,
    totalUlas: 0,
    totalIngat: 0,
  }
}

export function nilaiKartuSrs(
  lama: SrsKartu | undefined,
  nilai: NilaiIngatan,
  sekarang = Date.now(),
): SrsKartu {
  const prev = lama ?? kartuSrsAwal(sekarang)
  let { intervalHari, ease, repetisi } = prev

  if (nilai === 0) {
    // Lupa total: reset repetisi dan jadwalkan ulang 10 menit lagi
    repetisi = 0
    intervalHari = 0
    ease = Math.max(1.3, ease - 0.2)
    return {
      intervalHari,
      ease: Number(ease.toFixed(2)),
      repetisi,
      jatuhTempo: sekarang + 10 * MENIT_MS,
      terakhirUlas: sekarang,
      totalUlas: prev.totalUlas + 1,
      totalIngat: prev.totalIngat,
    }
  }

  // Mapping kualitas SM-2: Sulit=3, Ingat=4, Mudah=5
  const q = nilai === 1 ? 3 : nilai === 2 ? 4 : 5
  ease = Math.max(1.3, ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)))

  if (repetisi === 0) {
    intervalHari = nilai === 1 ? 1 : nilai === 2 ? 2 : 4
  } else if (repetisi === 1) {
    intervalHari = nilai === 1 ? 2 : nilai === 2 ? 5 : 8
  } else {
    const pengali = nilai === 1 ? 0.8 : nilai === 3 ? 1.3 : 1
    intervalHari = Math.max(1, Math.round(intervalHari * ease * pengali))
  }

  repetisi += 1

  return {
    intervalHari,
    ease: Number(ease.toFixed(2)),
    repetisi,
    jatuhTempo: sekarang + intervalHari * HARI_MS,
    terakhirUlas: sekarang,
    totalUlas: prev.totalUlas + 1,
    totalIngat: prev.totalIngat + 1,
  }
}

export function estimasiLabelInterval(
  lama: SrsKartu | undefined,
  nilai: NilaiIngatan,
  sekarang = Date.now(),
): string {
  const simulasi = nilaiKartuSrs(lama, nilai, sekarang)
  const selisihMs = Math.max(0, simulasi.jatuhTempo - sekarang)
  if (selisihMs < 60 * MENIT_MS) {
    const menit = Math.max(1, Math.round(selisihMs / MENIT_MS))
    return `${menit} mnt`
  }
  const hari = Math.max(1, Math.round(selisihMs / HARI_MS))
  return `${hari} hari`
}

export function kartuJatuhTempo(
  semuaKartu: KartuMemori[],
  srs: Record<string, SrsKartu> | undefined,
  sekarang = Date.now(),
): KartuMemori[] {
  const peta = srs ?? {}
  return semuaKartu
    .filter((k) => {
      const st = peta[k.id]
      return !st || st.jatuhTempo <= sekarang
    })
    .sort((a, b) => {
      const sa = peta[a.id]
      const sb = peta[b.id]
      if (!sa && sb) return 1
      if (sa && !sb) return -1
      if (!sa && !sb) return 0
      return sa.jatuhTempo - sb.jatuhTempo
    })
}

export function ringkasanSrs(
  semuaKartu: KartuMemori[],
  srs: Record<string, SrsKartu> | undefined,
  sekarang = Date.now(),
) {
  const peta = srs ?? {}
  let jatuhTempo = 0
  let baru = 0
  let mengendap = 0

  for (const k of semuaKartu) {
    const st = peta[k.id]
    if (!st) {
      baru += 1
      jatuhTempo += 1
    } else {
      if (st.jatuhTempo <= sekarang) jatuhTempo += 1
      if (st.repetisi >= 2 && st.intervalHari >= 5) mengendap += 1
    }
  }

  return {
    total: semuaKartu.length,
    jatuhTempo,
    baru,
    mengendap,
  }
}

/**
 * Mengembalikan daftar soal yang pernah salah (skor < 1) dan belum ditebus dengan skor sempurna setelahnya.
 */
export function soalKesalahanAktif(attempts: Attempt[]): Soal[] {
  const terakhirPerSoal = new Map<string, Attempt>()
  const urut = [...attempts].sort((a, b) => a.saat - b.saat)
  for (const a of urut) {
    terakhirPerSoal.set(a.soalId, a)
  }
  const hasil: Soal[] = []
  for (const [id, a] of terakhirPerSoal.entries()) {
    if (a.skor < 0.99) {
      const soal = soalById.get(id)
      if (soal) hasil.push(soal)
    }
  }
  return hasil.sort((a, b) => {
    const aa = terakhirPerSoal.get(a.id)?.saat ?? 0
    const bb = terakhirPerSoal.get(b.id)?.saat ?? 0
    return bb - aa
  })
}

export function soalBookmark(state: LearningState): Soal[] {
  const ids = state.bookmarkSoal ?? []
  return ids.map((id) => soalById.get(id)).filter((s): s is Soal => Boolean(s))
}
