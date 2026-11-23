import { createClient } from '@supabase/supabase-js'
import type { Attempt, LearningState, Profil, ProgressBab } from '@/types'
import { bacaIndex, bacaState, tulisIndex, tulisState } from './storage'
import { namaTampil, normalisasiNama } from './normalize-name'
import { antrekan, bacaAntrean, hapusDariAntrean, type Operasi } from './outbox'
import { GAMIFIKASI_KOSONG, gabungGamifikasi, normalisasiGamifikasi } from './gamification'

const url = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

export const modeRemote = Boolean(url && anon)
const supabase = modeRemote ? createClient(url as string, anon as string) : null

function stateKosong(): LearningState {
  return { bab: {}, attempts: [], achievements: {}, gamifikasi: { ...GAMIFIKASI_KOSONG, harian: {} } }
}

export function gabungState(lokal: LearningState, remote: LearningState | null): LearningState {
  if (!remote) return lokal
  const bab: LearningState['bab'] = { ...lokal.bab }
  for (const [id, p] of Object.entries(remote.bab ?? {})) {
    const ada = bab[id]
    bab[id] = ada
      ? {
          dibukaPada: Math.max(ada.dibukaPada ?? 0, p.dibukaPada ?? 0),
          refleksi: { ...(ada.refleksi ?? {}), ...(p.refleksi ?? {}) },
          checkpoint: { ...(ada.checkpoint ?? {}), ...(p.checkpoint ?? {}) },
          subBabSelesai: [...new Set([...(ada.subBabSelesai ?? []), ...(p.subBabSelesai ?? [])])],
        }
      : p
  }
  const peta = new Map<string, Attempt>()
  for (const a of [...(lokal.attempts ?? []), ...(remote.attempts ?? [])]) peta.set(a.id, a)
  const attempts = [...peta.values()].sort((a, b) => a.saat - b.saat).slice(-500)

  const srs = { ...(remote.srs ?? {}), ...(lokal.srs ?? {}) }
  for (const [id, rs] of Object.entries(remote.srs ?? {})) {
    const ls = lokal.srs?.[id]
    if (ls && rs.terakhirUlas > ls.terakhirUlas) srs[id] = rs
  }
  const petaKustom = new Map((remote.kartuKustom ?? []).map((k) => [k.id, k]))
  for (const k of lokal.kartuKustom ?? []) petaKustom.set(k.id, k)
  const bookmarkSoal = [
    ...new Set([...(lokal.bookmarkSoal ?? []), ...(remote.bookmarkSoal ?? [])]),
  ]
  const drillStats = {
    konstantaTerbaik: Math.max(
      lokal.drillStats?.konstantaTerbaik ?? 0,
      remote.drillStats?.konstantaTerbaik ?? 0,
    ),
    urutanTerbaik: Math.max(
      lokal.drillStats?.urutanTerbaik ?? 0,
      remote.drillStats?.urutanTerbaik ?? 0,
    ),
    totalSesiMemori: Math.max(
      lokal.drillStats?.totalSesiMemori ?? 0,
      remote.drillStats?.totalSesiMemori ?? 0,
    ),
  }

  return {
    bab,
    attempts,
    achievements: { ...(remote.achievements ?? {}), ...(lokal.achievements ?? {}) },
    gamifikasi: gabungGamifikasi(
      normalisasiGamifikasi(lokal.gamifikasi),
      normalisasiGamifikasi(remote.gamifikasi),
    ),
    srs,
    kartuKustom: [...petaKustom.values()],
    bookmarkSoal,
    drillStats,
  }
}

async function ambilStateRemote(profileId: string): Promise<LearningState | null> {
  if (!supabase) return null
  try {
    const { data, error } = await supabase.rpc('get_learning_state', { p_profile: profileId })
    if (error) throw error
    const mentah = Array.isArray(data) ? data[0] : data
    const isi = mentah && typeof mentah === 'object' && 'state' in mentah ? (mentah as { state: LearningState }).state : mentah
    if (!isi || typeof isi !== 'object') return null
    const s = isi as Partial<LearningState>
    return {
      bab: s.bab ?? {},
      attempts: s.attempts ?? [],
      achievements: s.achievements ?? {},
      gamifikasi: normalisasiGamifikasi(s.gamifikasi),
    }
  } catch (e) {
    console.warn('Gagal mengambil state dari Supabase.', e)
    return null
  }
}

export async function masukProfil(nama: string): Promise<{ profil: Profil; state: LearningState }> {
  const normal = normalisasiNama(nama)
  const tampil = namaTampil(nama)

  if (supabase) {
    try {
      const { data, error } = await supabase.rpc('login_or_create_profile', { p_nama: tampil })
      if (error) throw error
      const baris = (Array.isArray(data) ? data[0] : data) as
        | { id: string; display_name?: string }
        | null
      if (baris?.id) {
        const profil: Profil = {
          id: baris.id,
          normalizedName: normal,
          displayName: baris.display_name ?? tampil,
        }
        const remote = await ambilStateRemote(baris.id)
        return { profil, state: gabungState(bacaState(profil.id), remote) }
      }
    } catch (e) {
      console.warn('Supabase tidak tersedia — beralih ke mode lokal.', e)
    }
  }

  const index = bacaIndex()
  let entri = index[normal]
  if (!entri) {
    entri = { id: crypto.randomUUID(), displayName: tampil }
    index[normal] = entri
    tulisIndex(index)
  }
  const profil: Profil = { id: entri.id, normalizedName: normal, displayName: entri.displayName }
  const state = gabungState(bacaState(profil.id), null)
  tulisState(profil.id, state)
  return { profil, state }
}

async function jalankanOperasi(op: Operasi): Promise<boolean> {
  if (!supabase) return true
  try {
    let hasil: { error: unknown }
    if (op.jenis === 'attempt') {
      const a = op.attempt
      hasil = await supabase.rpc('record_attempt', {
        p_profile: op.profilId,
        p_id: a.id,
        p_sesi: a.sesiId,
        p_soal: a.soalId,
        p_topik: a.topik,
        p_level: a.level,
        p_tipe: a.tipe,
        p_modul: a.modul,
        p_bab: a.babId ?? null,
        p_benar: a.benar,
        p_skor: a.skor,
        p_durasi: a.durasiMs ?? null,
      })
    } else if (op.jenis === 'progress') {
      hasil = await supabase.rpc('save_chapter_progress', {
        p_profile: op.profilId,
        p_bab: op.babId,
        p_refleksi: op.progress.refleksi,
        p_checkpoint: op.progress.checkpoint,
        p_subbab: op.progress.subBabSelesai,
      })
    } else if (op.jenis === 'gamifikasi') {
      const g = op.gamifikasi
      hasil = await supabase.rpc('save_gamification', {
        p_profile: op.profilId,
        p_xp: g.xp,
        p_level: g.level,
        p_streak: g.streakCount,
        p_best: g.bestStreak,
        p_last_day: g.lastActiveDay,
        p_goal: g.dailyGoal,
        p_claimed: g.goalClaimedDay,
        p_harian: g.harian,
      })
    } else {
      hasil = await supabase.rpc('unlock_achievement', {
        p_profile: op.profilId,
        p_capaian: op.capaianId,
      })
    }
    if (hasil.error) throw hasil.error
    return true
  } catch (e) {
    console.warn('Gagal mengirim data ke Supabase — masuk antrean offline.', e)
    return false
  }
}

function online(): boolean {
  return typeof navigator === 'undefined' || navigator.onLine
}

async function kirimAtauAntre(op: Operasi): Promise<void> {
  if (!supabase) return
  if (!online()) {
    antrekan(op)
    return
  }
  if (!(await jalankanOperasi(op))) antrekan(op)
}

let sedangKirim = false

export async function kirimAntrean(): Promise<void> {
  if (!supabase || sedangKirim || !online()) return
  sedangKirim = true
  try {
    for (const op of bacaAntrean()) {
      if (!(await jalankanOperasi(op))) return
      hapusDariAntrean(op.kunci)
    }
  } finally {
    sedangKirim = false
  }
}

export function kirimPercobaan(profil: Profil, a: Attempt): void {
  void kirimAtauAntre({
    kunci: `attempt:${a.id}`,
    jenis: 'attempt',
    profilId: profil.id,
    attempt: a,
  })
}

export function kirimProgress(profil: Profil, babId: string, p: ProgressBab): void {
  void kirimAtauAntre({
    kunci: `progress:${profil.id}:${babId}`,
    jenis: 'progress',
    profilId: profil.id,
    babId,
    progress: p,
  })
}

export function kirimCapaian(profil: Profil, capaianId: string): void {
  void kirimAtauAntre({
    kunci: `capaian:${profil.id}:${capaianId}`,
    jenis: 'capaian',
    profilId: profil.id,
    capaianId,
  })
}

export function kirimGamifikasi(profil: Profil, g: LearningState['gamifikasi']): void {
  void kirimAtauAntre({
    kunci: `gamifikasi:${profil.id}`,
    jenis: 'gamifikasi',
    profilId: profil.id,
    gamifikasi: g,
  })
}
