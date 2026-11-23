import { z } from 'zod'
import type { LearningState, Profil } from '@/types'
import { normalisasiGamifikasi } from './gamification'

const skemaAttempt = z.object({
  id: z.string().min(1),
  sesiId: z.string(),
  soalId: z.string(),
  topik: z.string(),
  level: z.enum(['fondasi', 'menengah', 'penalaran', 'olimpiade']),
  tipe: z.enum([
    'pilihan-ganda',
    'pilihan-jamak',
    'isian',
    'esai',
    'pilihan_ganda',
    'pilihan_jamak',
    'isian_angka',
    'esai_penalaran',
    'interpretasi_grafik',
    'interpretasi_tabel',
    'temukan_kesalahan',
    'cek_dimensi',
    'ranking_urutan',
    'multi_langkah',
    'data_tidak_lengkap',
  ]),
  modul: z.enum(['kuis-bab', 'santai', 'simulasi', 'ulangan', 'campuran']),
  babId: z.string().optional(),
  saat: z.number(),
  benar: z.boolean(),
  skor: z.number(),
  durasiMs: z.number().optional(),
})

const skemaProgress = z.object({
  dibukaPada: z.number(),
  refleksi: z.record(z.string(), z.string()).default({}),
  checkpoint: z.record(z.string(), z.boolean()).default({}),
  subBabSelesai: z.array(z.string()).default([]),
})

const skemaHarian = z.object({
  soal: z.number().default(0),
  xp: z.number().default(0),
})

const skemaGamifikasi = z.object({
  xp: z.number().default(0),
  level: z.number().default(1),
  streakCount: z.number().default(0),
  bestStreak: z.number().default(0),
  lastActiveDay: z.string().default(''),
  dailyGoal: z.number().default(10),
  goalClaimedDay: z.string().default(''),
  harian: z.record(z.string(), skemaHarian).default({}),
})

const skemaSrsKartu = z.object({
  intervalHari: z.number(),
  ease: z.number(),
  repetisi: z.number(),
  jatuhTempo: z.number(),
  terakhirUlas: z.number(),
  totalUlas: z.number(),
  totalIngat: z.number(),
})

const skemaKartuMemori = z.object({
  id: z.string(),
  kategori: z.string(),
  depan: z.string(),
  belakang: z.string(),
  petunjuk: z.string().optional(),
  babId: z.string().optional(),
  kustom: z.boolean().optional(),
  dibuatPada: z.number().optional(),
})

const skemaDrillStats = z.object({
  konstantaTerbaik: z.number().default(0),
  urutanTerbaik: z.number().default(0),
  totalSesiMemori: z.number().default(0),
})

const skemaBackup = z.object({
  versi: z.literal(1),
  profil: z.object({ nama: z.string(), id: z.string() }),
  diekspor: z.string(),
  state: z.object({
    bab: z.record(z.string(), skemaProgress),
    attempts: z.array(skemaAttempt),
    achievements: z.record(z.string(), z.number()),
    gamifikasi: skemaGamifikasi.default({
      xp: 0,
      level: 1,
      streakCount: 0,
      bestStreak: 0,
      lastActiveDay: '',
      dailyGoal: 10,
      goalClaimedDay: '',
      harian: {},
    }),
    srs: z.record(z.string(), skemaSrsKartu).optional(),
    kartuKustom: z.array(skemaKartuMemori).optional(),
    bookmarkSoal: z.array(z.string()).optional(),
    drillStats: skemaDrillStats.optional(),
  }),
})

export type Backup = z.infer<typeof skemaBackup>

export function eksporBackup(profil: Profil, state: LearningState): string {
  const isi: Backup = {
    versi: 1,
    profil: { nama: profil.displayName, id: profil.id },
    diekspor: new Date().toISOString(),
    state,
  }
  return JSON.stringify(isi, null, 2)
}

export function parseBackup(teks: string): LearningState | null {
  try {
    const mentah = skemaBackup.parse(JSON.parse(teks))
    const attempts = [...mentah.state.attempts].sort((a, b) => a.saat - b.saat).slice(-500)
    return {
      bab: mentah.state.bab,
      attempts,
      achievements: mentah.state.achievements,
      gamifikasi: normalisasiGamifikasi(mentah.state.gamifikasi),
      srs: mentah.state.srs ?? {},
      kartuKustom: mentah.state.kartuKustom ?? [],
      bookmarkSoal: mentah.state.bookmarkSoal ?? [],
      drillStats: mentah.state.drillStats ?? {
        konstantaTerbaik: 0,
        urutanTerbaik: 0,
        totalSesiMemori: 0,
      },
    }
  } catch {
    return null
  }
}
