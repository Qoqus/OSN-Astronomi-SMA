import { describe, expect, it } from 'vitest'
import type { Attempt, LearningState } from '@/types'
import { rekomendasiBerikut } from '../adaptive'
import { DAFTAR_CAPAIAN, capainBaru, daftarCapaian } from '../achievements'
import { GAMIFIKASI_KOSONG } from '../gamification'

function attempt(ubah: Partial<Attempt>): Attempt {
  return {
    id: crypto.randomUUID(),
    sesiId: 'sesi-uji',
    soalId: crypto.randomUUID(),
    topik: 'matematika',
    level: 'fondasi',
    tipe: 'pilihan-ganda',
    modul: 'santai',
    saat: 1,
    benar: false,
    skor: 0,
    ...ubah,
  }
}

function state(attempts: Attempt[] = []): LearningState {
  return { bab: {}, attempts, achievements: {}, gamifikasi: { ...GAMIFIKASI_KOSONG, harian: {} } }
}

describe('rekomendasiBerikut', () => {
  it('memulai dari bab pertama saat belum ada data', () => {
    const r = rekomendasiBerikut(state())
    expect(r.jenis).toBe('bab')
    expect(r.babId).toBe('f1')
    expect(r.alasan).toMatch(/prasyarat/i)
  })

  it('menunjuk bab pemilik topik saat topik lemah', () => {
    const attempts = Array.from({ length: 4 }, () => attempt({ babId: 'f1' }))
    const r = rekomendasiBerikut(state(attempts))
    expect(r.jenis).toBe('bab')
    expect(r.babId).toBe('f1')
    expect(r.alasan).toMatch(/Akurasi/)
  })

  it('tetap memberi saran bila pemilik topik belum tersedia', () => {
    const attempts = Array.from({ length: 4 }, () =>
      attempt({ topik: 'mekanika-langit', level: 'menengah' }),
    )
    const r = rekomendasiBerikut(state(attempts))
    expect(r.jenis).toBe('bab')
    expect(r.judul.length).toBeGreaterThan(0)
  })

  it('mengarahkan kembali ke bab yang menaungi topik lemah', () => {
    const attempts = [
      ...Array.from({ length: 4 }, () => attempt({ babId: 'f1' })),
      ...Array.from({ length: 4 }, () => attempt({ babId: 'f1', topik: 'analisis-data' })),
    ]
    const r = rekomendasiBerikut(state(attempts))
    expect(r.jenis).toBe('bab')
    expect(r.babId).toBe('f1')
  })
})

describe('capaian', () => {
  it('membuka Teliti Angka Penting setelah 10 isian benar beruntun', () => {
    const attempts = Array.from({ length: 10 }, (_, i) =>
      attempt({
        tipe: 'isian',
        benar: true,
        skor: 1,
        saat: 1000 + i,
      }),
    )
    const s = state(attempts)
    const capaian = daftarCapaian(s).find((c) => c.id === 'angka-penting')
    expect(capaian?.terbuka).toBe(true)
    expect(capainBaru(s).map((c) => c.id)).toContain('angka-penting')
  })

  it('reset hitungan bila ada isian yang meleset', () => {
    const attempts = [
      ...Array.from({ length: 9 }, (_, i) => attempt({ tipe: 'isian', benar: true, skor: 1, saat: 1000 + i })),
      attempt({ tipe: 'isian', benar: false, skor: 0, saat: 2000 }),
      attempt({ tipe: 'isian', benar: true, skor: 1, saat: 2001 }),
    ]
    const capaian = daftarCapaian(state(attempts)).find((c) => c.id === 'angka-penting')
    expect(capaian?.terbuka).toBe(false)
  })

  it('tidak membuka capaian pada state kosong', () => {
    const capaian = daftarCapaian(state())
    expect(capaian.every((c) => !c.terbuka)).toBe(true)
    expect(DAFTAR_CAPAIAN).toHaveLength(15)
  })

  it('membuka capaian simulasi setelah tiga sesi kuat', () => {
    const attempts: Attempt[] = []
    for (let sesi = 0; sesi < 3; sesi += 1) {
      for (let i = 0; i < 6; i += 1) {
        attempts.push(attempt({ sesiId: `sim-${sesi}`, modul: 'simulasi', benar: i < 5, skor: i < 5 ? 1 : 0 }))
      }
    }
    const capaian = daftarCapaian(state(attempts)).find((c) => c.id === 'uji-ketahanan')
    expect(capaian?.terbuka).toBe(true)
  })
})
