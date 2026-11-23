import type { Attempt, Gamifikasi, Harian } from '@/types'

export const GAMIFIKASI_KOSONG: Gamifikasi = {
  xp: 0,
  level: 1,
  streakCount: 0,
  bestStreak: 0,
  lastActiveDay: '',
  dailyGoal: 10,
  goalClaimedDay: '',
  harian: {},
}

const XP_DASAR: Record<string, number> = {
  fondasi: 5,
  menengah: 8,
  penalaran: 12,
  olimpiade: 20,
}

export const BONUS_GOAL = 25
const BATAS_HARIAN = 30

export function hariIni(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const t = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${t}`
}

export function kemarin(hari: string): string {
  const [y, m, t] = hari.split('-').map(Number)
  const d = new Date(y, m - 1, t)
  d.setDate(d.getDate() - 1)
  return hariIni(d)
}

export function xpUntukAttempt(level: string, skor: number): number {
  const dasar = XP_DASAR[level] ?? 8
  return Math.max(0, Math.round(dasar * Math.max(0, Math.min(1, skor))))
}

export function levelDariXp(xp: number): number {
  return Math.floor(Math.sqrt(Math.max(0, xp) / 60)) + 1
}

export function xpUntukLevel(level: number): number {
  return 60 * (level - 1) * (level - 1)
}

export type Perayaan =
  | { jenis: 'level'; level: number }
  | { jenis: 'goal'; hari: string }
  | { jenis: 'capaian'; id: string; nama: string }

function pangkasHarian(harian: Record<string, Harian>, hari: string): Record<string, Harian> {
  const kunci = Object.keys(harian).sort().slice(-BATAS_HARIAN)
  const hasil: Record<string, Harian> = {}
  for (const k of kunci) hasil[k] = harian[k]
  void hari
  return hasil
}

export function perbaruiGamifikasi(
  g: Gamifikasi,
  attempt: Attempt,
  sekarang: Date = new Date(),
): { gamifikasi: Gamifikasi; events: Perayaan[] } {
  const hari = hariIni(sekarang)
  const events: Perayaan[] = []
  const gain = xpUntukAttempt(attempt.level, attempt.skor)

  const sebelumnya = g.harian[hari] ?? { soal: 0, xp: 0 }
  const harianHari: Harian = { soal: sebelumnya.soal + 1, xp: sebelumnya.xp + gain }
  let harian = { ...g.harian, [hari]: harianHari }

  let streak = g.streakCount
  if (g.lastActiveDay !== hari) {
    streak = g.lastActiveDay === kemarin(hari) ? g.streakCount + 1 : 1
  }
  const bestStreak = Math.max(g.bestStreak, streak)

  let xp = g.xp + gain
  let goalClaimedDay = g.goalClaimedDay
  if (harianHari.soal >= g.dailyGoal && goalClaimedDay !== hari) {
    goalClaimedDay = hari
    xp += BONUS_GOAL
    harian = { ...harian, [hari]: { soal: harianHari.soal, xp: harianHari.xp + BONUS_GOAL } }
    events.push({ jenis: 'goal', hari })
  }

  const level = levelDariXp(xp)
  if (level > g.level) events.push({ jenis: 'level', level })

  return {
    gamifikasi: {
      xp,
      level,
      streakCount: streak,
      bestStreak,
      lastActiveDay: hari,
      dailyGoal: g.dailyGoal,
      goalClaimedDay,
      harian: pangkasHarian(harian, hari),
    },
    events,
  }
}

export function gabungGamifikasi(lokal: Gamifikasi, remote: Gamifikasi | null): Gamifikasi {
  if (!remote) return lokal
  const xp = Math.max(lokal.xp, remote.xp)
  const bestStreak = Math.max(lokal.bestStreak, remote.bestStreak)
  const lokalBaru = lokal.lastActiveDay >= remote.lastActiveDay
  const sumberStreak = lokalBaru ? lokal : remote
  const harian: Record<string, Harian> = { ...remote.harian }
  for (const [k, v] of Object.entries(lokal.harian)) {
    const ada = harian[k]
    harian[k] = ada
      ? { soal: Math.max(ada.soal, v.soal), xp: Math.max(ada.xp, v.xp) }
      : v
  }
  return {
    xp,
    level: levelDariXp(xp),
    streakCount: sumberStreak.streakCount,
    bestStreak,
    lastActiveDay: sumberStreak.lastActiveDay,
    dailyGoal: lokal.dailyGoal,
    goalClaimedDay: sumberStreak.goalClaimedDay,
    harian: pangkasHarian(harian, hariIni()),
  }
}

export function normalisasiGamifikasi(g: Partial<Gamifikasi> | undefined | null): Gamifikasi {
  if (!g) return { ...GAMIFIKASI_KOSONG, harian: {} }
  return {
    xp: typeof g.xp === 'number' ? g.xp : 0,
    level: typeof g.level === 'number' ? g.level : levelDariXp(g.xp ?? 0),
    streakCount: typeof g.streakCount === 'number' ? g.streakCount : 0,
    bestStreak: typeof g.bestStreak === 'number' ? g.bestStreak : 0,
    lastActiveDay: typeof g.lastActiveDay === 'string' ? g.lastActiveDay : '',
    dailyGoal: typeof g.dailyGoal === 'number' && g.dailyGoal > 0 ? g.dailyGoal : 10,
    goalClaimedDay: typeof g.goalClaimedDay === 'string' ? g.goalClaimedDay : '',
    harian: g.harian && typeof g.harian === 'object' ? g.harian : {},
  }
}

export type StatusStreak = 'aktif' | 'belum' | 'putus'

export function statusStreak(g: Gamifikasi, hari: string = hariIni()): StatusStreak {
  if (g.lastActiveDay === hari) return 'aktif'
  if (g.lastActiveDay === kemarin(hari)) return 'belum'
  return g.streakCount > 0 ? 'putus' : 'belum'
}

export function titikMingguan(
  g: Gamifikasi,
  hari: string = hariIni(),
): { hari: string; soal: number; aktif: boolean }[] {
  const hasil: { hari: string; soal: number; aktif: boolean }[] = []
  const [y, m, t] = hari.split('-').map(Number)
  const d = new Date(y, m - 1, t)
  for (let i = 6; i >= 0; i--) {
    const dd = new Date(d)
    dd.setDate(d.getDate() - i)
    const k = hariIni(dd)
    const soal = g.harian[k]?.soal ?? 0
    hasil.push({ hari: k, soal, aktif: soal > 0 })
  }
  return hasil
}

export function hariGoalTercapai(g: Gamifikasi): number {
  return Object.values(g.harian).filter((h) => h.soal >= g.dailyGoal).length
}