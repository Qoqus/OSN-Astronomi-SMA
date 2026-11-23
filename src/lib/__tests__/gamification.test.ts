import { describe, expect, it } from 'vitest'
import type { Attempt, Gamifikasi } from '@/types'
import {
  BONUS_GOAL,
  GAMIFIKASI_KOSONG,
  gabungGamifikasi,
  hariGoalTercapai,
  hariIni,
  kemarin,
  levelDariXp,
  normalisasiGamifikasi,
  perbaruiGamifikasi,
  statusStreak,
  titikMingguan,
  xpUntukAttempt,
  xpUntukLevel,
} from '../gamification'

const D = new Date(2026, 10, 21, 12, 0, 0)
const HARI = hariIni(D)

function attempt(level: Attempt['level'] = 'fondasi', skor = 1, saat = D.getTime()): Attempt {
  return {
    id: 'a',
    sesiId: 's',
    soalId: 'f1-01',
    topik: 'matematika',
    level,
    tipe: 'pilihan-ganda',
    modul: 'santai',
    saat,
    benar: skor >= 1,
    skor,
  }
}

function kosong(override: Partial<Gamifikasi> = {}): Gamifikasi {
  return { ...GAMIFIKASI_KOSONG, harian: {}, ...override }
}

describe('xp dan level', () => {
  it('memberi XP sesuai level dan skor', () => {
    expect(xpUntukAttempt('fondasi', 1)).toBe(5)
    expect(xpUntukAttempt('menengah', 1)).toBe(8)
    expect(xpUntukAttempt('penalaran', 1)).toBe(12)
    expect(xpUntukAttempt('olimpiade', 1)).toBe(20)
    expect(xpUntukAttempt('penalaran', 0.5)).toBe(6)
    expect(xpUntukAttempt('fondasi', 0)).toBe(0)
    expect(xpUntukAttempt('fondasi', 5)).toBe(5)
  })

  it('kurva level konsisten bolak-balik', () => {
    expect(levelDariXp(0)).toBe(1)
    expect(xpUntukLevel(1)).toBe(0)
    expect(levelDariXp(60)).toBe(2)
    expect(levelDariXp(239)).toBe(2)
    expect(levelDariXp(240)).toBe(3)
    expect(xpUntukLevel(3)).toBe(240)
  })
})

describe('perbaruiGamifikasi — streak', () => {
  it('hari pertama memulai streak 1', () => {
    const { gamifikasi } = perbaruiGamifikasi(kosong(), attempt(), D)
    expect(gamifikasi.streakCount).toBe(1)
    expect(gamifikasi.lastActiveDay).toBe(HARI)
    expect(gamifikasi.harian[HARI].soal).toBe(1)
  })

  it('jawaban kedua di hari yang sama tidak menambah streak', () => {
    const a = perbaruiGamifikasi(kosong(), attempt(), D).gamifikasi
    const b = perbaruiGamifikasi(a, attempt(), D).gamifikasi
    expect(b.streakCount).toBe(1)
    expect(b.harian[HARI].soal).toBe(2)
  })

  it('hari beruntun menaikkan streak', () => {
    const g = kosong({ lastActiveDay: kemarin(HARI), streakCount: 3, bestStreak: 3 })
    const { gamifikasi } = perbaruiGamifikasi(g, attempt(), D)
    expect(gamifikasi.streakCount).toBe(4)
    expect(gamifikasi.bestStreak).toBe(4)
  })

  it('jeda dua hari mereset streak ke 1 tetapi menjaga rekor', () => {
    const duaHariLalu = kemarin(kemarin(HARI))
    const g = kosong({ lastActiveDay: duaHariLalu, streakCount: 5, bestStreak: 5 })
    const { gamifikasi } = perbaruiGamifikasi(g, attempt(), D)
    expect(gamifikasi.streakCount).toBe(1)
    expect(gamifikasi.bestStreak).toBe(5)
  })
})

describe('perbaruiGamifikasi — target harian', () => {
  it('bonus goal hanya sekali per hari', () => {
    const g = kosong({ dailyGoal: 2 })
    const pertama = perbaruiGamifikasi(g, attempt(), D)
    expect(pertama.events.some((e) => e.jenis === 'goal')).toBe(false)
    const kedua = perbaruiGamifikasi(pertama.gamifikasi, attempt(), D)
    expect(kedua.events.some((e) => e.jenis === 'goal')).toBe(true)
    expect(kedua.gamifikasi.goalClaimedDay).toBe(HARI)
    const xpSebelum = kedua.gamifikasi.xp
    const ketiga = perbaruiGamifikasi(kedua.gamifikasi, attempt(), D)
    expect(ketiga.events.some((e) => e.jenis === 'goal')).toBe(false)
    expect(ketiga.gamifikasi.xp).toBe(xpSebelum + xpUntukAttempt('fondasi', 1))
    expect(kedua.gamifikasi.harian[HARI].xp).toBe(10 + BONUS_GOAL)
  })

  it('memicu perayaan level-up saat XP melewati ambang', () => {
    const g = kosong({ xp: 58, level: 1 })
    const { events, gamifikasi } = perbaruiGamifikasi(g, attempt('fondasi', 1), D)
    expect(gamifikasi.xp).toBe(63)
    expect(gamifikasi.level).toBe(2)
    expect(events.some((e) => e.jenis === 'level' && e.level === 2)).toBe(true)
  })

  it('memangkas harian menjadi 30 hari terbaru', () => {
    const harian: Gamifikasi['harian'] = {}
    for (let i = 0; i < 40; i += 1) {
      const d = new Date(D)
      d.setDate(d.getDate() - i)
      harian[hariIni(d)] = { soal: 1, xp: 5 }
    }
    const { gamifikasi } = perbaruiGamifikasi(kosong({ harian }), attempt(), D)
    expect(Object.keys(gamifikasi.harian)).toHaveLength(30)
    expect(gamifikasi.harian[HARI]).toBeDefined()
  })
})

describe('gabungGamifikasi', () => {
  it('mengambil XP dan rekor maksimum', () => {
    const lokal = kosong({ xp: 100, bestStreak: 4 })
    const remote = kosong({ xp: 250, bestStreak: 9 })
    const hasil = gabungGamifikasi(lokal, remote)
    expect(hasil.xp).toBe(250)
    expect(hasil.bestStreak).toBe(9)
    expect(hasil.level).toBe(levelDariXp(250))
  })

  it('streak mengikuti lastActiveDay terbaru', () => {
    const lokal = kosong({ lastActiveDay: kemarin(HARI), streakCount: 2 })
    const remote = kosong({ lastActiveDay: HARI, streakCount: 7 })
    expect(gabungGamifikasi(lokal, remote).streakCount).toBe(7)
    expect(gabungGamifikasi(remote, lokal).streakCount).toBe(7)
  })

  it('menggabungkan harian per tanggal dengan maksimum', () => {
    const lokal = kosong({ harian: { [HARI]: { soal: 3, xp: 15 } } })
    const remote = kosong({ harian: { [HARI]: { soal: 5, xp: 20 }, '2026-11-01': { soal: 2, xp: 8 } } })
    const hasil = gabungGamifikasi(lokal, remote)
    expect(hasil.harian[HARI]).toEqual({ soal: 5, xp: 20 })
    expect(hasil.harian['2026-11-01']).toEqual({ soal: 2, xp: 8 })
  })

  it('dailyGoal lokal menang', () => {
    const lokal = kosong({ dailyGoal: 15 })
    const remote = kosong({ dailyGoal: 5 })
    expect(gabungGamifikasi(lokal, remote).dailyGoal).toBe(15)
  })

  it('remote null mengembalikan lokal', () => {
    const lokal = kosong({ xp: 42 })
    expect(gabungGamifikasi(lokal, null)).toBe(lokal)
  })
})

describe('normalisasiGamifikasi', () => {
  it('mengembalikan default untuk null/undefined', () => {
    expect(normalisasiGamifikasi(undefined).dailyGoal).toBe(10)
    expect(normalisasiGamifikasi(null).level).toBe(1)
    expect(normalisasiGamifikasi({}).harian).toEqual({})
  })

  it('menurunkan level dari XP bila level hilang', () => {
    expect(normalisasiGamifikasi({ xp: 240 }).level).toBe(3)
  })
})

describe('statusStreak dan titikMingguan', () => {
  it('aktif bila sudah belajar hari ini', () => {
    expect(statusStreak(kosong({ lastActiveDay: HARI }), HARI)).toBe('aktif')
  })

  it('belum bila terakhir kemarin', () => {
    expect(statusStreak(kosong({ lastActiveDay: kemarin(HARI), streakCount: 2 }), HARI)).toBe('belum')
  })

  it('putus bila ada jeda dan streak pernah ada', () => {
    expect(statusStreak(kosong({ lastActiveDay: kemarin(kemarin(HARI)), streakCount: 2 }), HARI)).toBe('putus')
  })

  it('titikMingguan menghasilkan 7 hari berakhir hari ini', () => {
    const g = kosong({ harian: { [HARI]: { soal: 2, xp: 10 } } })
    const titik = titikMingguan(g, HARI)
    expect(titik).toHaveLength(7)
    expect(titik[6].hari).toBe(HARI)
    expect(titik[6].aktif).toBe(true)
    expect(titik[0].aktif).toBe(false)
  })

  it('hariGoalTercapai menghitung hari yang memenuhi target', () => {
    const g = kosong({
      dailyGoal: 5,
      harian: { a: { soal: 5, xp: 1 }, b: { soal: 4, xp: 1 }, c: { soal: 9, xp: 1 } },
    })
    expect(hariGoalTercapai(g)).toBe(2)
  })
})