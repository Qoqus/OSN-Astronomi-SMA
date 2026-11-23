import { describe, expect, it } from 'vitest'
import type { LearningState, Profil } from '@/types'
import { eksporBackup, parseBackup } from '../backup'
import { GAMIFIKASI_KOSONG } from '../gamification'

const profil: Profil = { id: 'p1', normalizedName: 'budi', displayName: 'Budi' }

const state: LearningState = {
  bab: {
    f1: {
      dibukaPada: 1000,
      refleksi: { 'f1-refleksi-1': 'Catatan' },
      checkpoint: { 'f1-cek-1': true },
      subBabSelesai: ['notasi-satuan'],
    },
  },
  attempts: [
    {
      id: 'a1',
      sesiId: 's1',
      soalId: 'f1-01',
      topik: 'matematika',
      level: 'fondasi',
      tipe: 'pilihan-ganda',
      modul: 'santai',
      saat: 1000,
      benar: true,
      skor: 1,
    },
  ],
  achievements: { 'bahasa-angka': 2000 },
  gamifikasi: {
    ...GAMIFIKASI_KOSONG,
    xp: 120,
    level: 2,
    streakCount: 3,
    bestStreak: 5,
    lastActiveDay: '2026-11-21',
    harian: { '2026-11-21': { soal: 4, xp: 20 } },
  },
}

describe('backup', () => {
  it('bolak-balik ekspor dan impor mempertahankan isi', () => {
    const hasil = parseBackup(eksporBackup(profil, state))
    expect(hasil).not.toBeNull()
    expect(hasil?.bab.f1.refleksi['f1-refleksi-1']).toBe('Catatan')
    expect(hasil?.attempts).toHaveLength(1)
    expect(hasil?.achievements['bahasa-angka']).toBe(2000)
  })

  it('menolak JSON yang bukan cadangan', () => {
    expect(parseBackup('{"versi":1}')).toBeNull()
    expect(parseBackup('bukan json')).toBeNull()
  })

  it('menolak versi cadangan yang tidak dikenal', () => {
    const isi = JSON.parse(eksporBackup(profil, state)) as { versi: number }
    isi.versi = 2
    expect(parseBackup(JSON.stringify(isi))).toBeNull()
  })

  it('mempertahankan gamifikasi saat bolak-balik', () => {
    const hasil = parseBackup(eksporBackup(profil, state))
    expect(hasil?.gamifikasi.xp).toBe(120)
    expect(hasil?.gamifikasi.streakCount).toBe(3)
    expect(hasil?.gamifikasi.bestStreak).toBe(5)
    expect(hasil?.gamifikasi.harian['2026-11-21'].soal).toBe(4)
  })

  it('cadangan v1 lama tanpa gamifikasi diimpor dengan default', () => {
    const lama = {
      versi: 1,
      profil: { nama: 'Budi', id: 'p1' },
      diekspor: '2026-01-01T00:00:00.000Z',
      state: { bab: {}, attempts: [], achievements: {} },
    }
    const hasil = parseBackup(JSON.stringify(lama))
    expect(hasil).not.toBeNull()
    expect(hasil?.gamifikasi.dailyGoal).toBe(10)
    expect(hasil?.gamifikasi.level).toBe(1)
    expect(hasil?.gamifikasi.xp).toBe(0)
    expect(hasil?.gamifikasi.harian).toEqual({})
  })
})
