import type { LearningState, StatistikTopik, StatusBab } from '@/types'
import { KATALOG, type Bab } from '../../content/index'

export interface RincianPenguasaanBab {
  soalUnik: number
  sesiUnik: number
  rentangHari: number
  skorRataRata: number
  dikuasai: boolean
}

export {
  evaluasiKesiapanModul,
  CHECKLIST_REGISTRY,
  type EvaluasiKesiapanModul,
  type StatusGerbang,
  type KriteriaGerbang,
  type GerbangId,
} from './curriculum-readiness'

export function rincianPenguasaanBab(bab: Bab, state: LearningState): RincianPenguasaanBab {
  const attempts = state.attempts.filter(
    (a) => a.babId === bab.id && a.tipe !== 'esai' && a.tipe !== 'esai_penalaran',
  )
  const soalUnik = new Set(attempts.map((a) => a.soalId)).size
  const sesiUnik = new Set(attempts.map((a) => a.sesiId)).size
  const rentangHari =
    attempts.length > 0
      ? (Math.max(...attempts.map((a) => a.saat)) - Math.min(...attempts.map((a) => a.saat))) /
        (24 * 60 * 60 * 1000)
      : 0
  const skorRataRata =
    attempts.length > 0
      ? attempts.reduce((jumlah, a) => jumlah + a.skor, 0) / attempts.length
      : 0
  const dikuasai =
    soalUnik >= 8 && sesiUnik >= 2 && rentangHari >= 7 && skorRataRata >= 0.8

  return { soalUnik, sesiUnik, rentangHari, skorRataRata, dikuasai }
}

export function statusBab(bab: Bab, state: LearningState): StatusBab {
  const prog = state.bab[bab.id]
  const dibuka = Boolean(prog) || state.attempts.some((a) => a.babId === bab.id)
  if (!dibuka) return 'belum'
  const { dikuasai } = rincianPenguasaanBab(bab, state)
  return dikuasai ? 'dikuasai' : 'sedang'
}

export function babDikuasai(state: LearningState): Set<string> {
  return new Set(KATALOG.filter((b) => statusBab(b, state) === 'dikuasai').map((b) => b.id))
}

export function statistikTopik(state: LearningState): StatistikTopik[] {
  const peta = new Map<string, StatistikTopik>()
  for (const a of state.attempts) {
    const s = peta.get(a.topik) ?? {
      topik: a.topik,
      benar: 0,
      salah: 0,
      total: 0,
      akurasi: 0,
      skorRataRata: 0,
      soalUnik: 0,
      sesi: 0,
      level: [],
    }
    if (a.benar) s.benar += 1
    else s.salah += 1
    s.total += 1
    s.skorRataRata += a.skor
    s.level = [...new Set([...s.level, a.level])]
    peta.set(a.topik, s)
  }
  for (const s of peta.values()) {
    const percobaan = state.attempts.filter((a) => a.topik === s.topik)
    s.akurasi = s.total ? s.benar / s.total : 0
    s.skorRataRata = s.total ? s.skorRataRata / s.total : 0
    s.soalUnik = new Set(percobaan.map((a) => a.soalId)).size
    s.sesi = new Set(percobaan.map((a) => a.sesiId)).size
  }
  return [...peta.values()]
    .sort((a, b) => b.total - a.total)
}

export function akurasiKeseluruhan(state: LearningState): number | null {
  if (state.attempts.length === 0) return null
  return state.attempts.filter((a) => a.benar).length / state.attempts.length
}

export function babTerakhirDibuka(state: LearningState): Bab | null {
  const entri = Object.entries(state.bab).sort((a, b) => b[1].dibukaPada - a[1].dibukaPada)
  if (entri.length === 0) return null
  return KATALOG.find((b) => b.id === entri[0][0]) ?? null
}
