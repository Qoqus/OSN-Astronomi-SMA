import type { LearningState, Profil, SesiKuis } from '@/types'
import { GAMIFIKASI_KOSONG, normalisasiGamifikasi } from './gamification'

const K_PROFIL = 'ruanglangit.profil'
const K_SESI = 'ruanglangit.sesi'
const K_INDEX = 'ruanglangit.index'
const kState = (id: string) => `ruanglangit.state.${id}`

export interface EntriIndex {
  id: string
  displayName: string
}

export const STATE_KOSONG: LearningState = {
  bab: {},
  attempts: [],
  achievements: {},
  gamifikasi: { ...GAMIFIKASI_KOSONG, harian: {} },
  srs: {},
  kartuKustom: [],
  bookmarkSoal: [],
  drillStats: { konstantaTerbaik: 0, urutanTerbaik: 0, totalSesiMemori: 0 },
}

function baca<T>(kunci: string): T | null {
  try {
    const mentah = localStorage.getItem(kunci)
    return mentah ? (JSON.parse(mentah) as T) : null
  } catch {
    return null
  }
}

function tulis(kunci: string, nilai: unknown): void {
  try {
    if (nilai === null) localStorage.removeItem(kunci)
    else localStorage.setItem(kunci, JSON.stringify(nilai))
  } catch (e) {
    console.warn('Gagal menyimpan ke localStorage', e)
  }
}

export function bacaProfil(): Profil | null {
  return baca<Profil>(K_PROFIL)
}

export function tulisProfil(p: Profil | null): void {
  tulis(K_PROFIL, p)
}

export function bacaState(id: string): LearningState {
  const s = baca<LearningState>(kState(id))
  if (!s) {
    return {
      ...STATE_KOSONG,
      gamifikasi: { ...GAMIFIKASI_KOSONG, harian: {} },
      srs: {},
      kartuKustom: [],
      bookmarkSoal: [],
      drillStats: { konstantaTerbaik: 0, urutanTerbaik: 0, totalSesiMemori: 0 },
    }
  }
  return {
    bab: s.bab ?? {},
    attempts: Array.isArray(s.attempts) ? s.attempts : [],
    achievements: s.achievements ?? {},
    gamifikasi: normalisasiGamifikasi(s.gamifikasi),
    srs: s.srs && typeof s.srs === 'object' ? s.srs : {},
    kartuKustom: Array.isArray(s.kartuKustom) ? s.kartuKustom : [],
    bookmarkSoal: Array.isArray(s.bookmarkSoal) ? s.bookmarkSoal : [],
    drillStats: s.drillStats ?? { konstantaTerbaik: 0, urutanTerbaik: 0, totalSesiMemori: 0 },
  }
}

export function tulisState(id: string, state: LearningState): void {
  tulis(kState(id), state)
}

export function bacaSesi(): SesiKuis | null {
  return baca<SesiKuis>(K_SESI)
}

export function tulisSesi(sesi: SesiKuis | null): void {
  tulis(K_SESI, sesi)
}

export function bacaIndex(): Record<string, EntriIndex> {
  return baca<Record<string, EntriIndex>>(K_INDEX) ?? {}
}

export function tulisIndex(index: Record<string, EntriIndex>): void {
  tulis(K_INDEX, index)
}
