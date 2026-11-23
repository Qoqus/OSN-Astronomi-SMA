import { describe, expect, it } from 'vitest'
import type { Attempt, LearningState } from '@/types'
import { KATALOG } from '../../../content/index'
import { statusBab, statistikTopik } from '../chapter-status'
import { GAMIFIKASI_KOSONG } from '../gamification'

function attempt(ubah: Partial<Attempt> = {}): Attempt {
  return {
    id: crypto.randomUUID(),
    sesiId: 'sesi-1',
    soalId: crypto.randomUUID(),
    topik: 'matematika',
    level: 'fondasi',
    tipe: 'pilihan-ganda',
    modul: 'kuis-bab',
    babId: 'f1',
    saat: 0,
    benar: true,
    skor: 1,
    ...ubah,
  }
}

function state(attempts: Attempt[]): LearningState {
  return { bab: {}, attempts, achievements: {}, gamifikasi: { ...GAMIFIKASI_KOSONG, harian: {} } }
}

const f1 = KATALOG.find((bab) => bab.id === 'f1')!
const HARI = 24 * 60 * 60 * 1000

describe('statusBab', () => {
  it('mensyaratkan delapan soal unik dalam dua sesi yang terpisah tujuh hari', () => {
    const attempts = Array.from({ length: 8 }, (_, i) =>
      attempt({ soalId: `q${i}`, sesiId: i < 4 ? 'sesi-a' : 'sesi-b', saat: i < 4 ? 0 : 7 * HARI }),
    )
    expect(statusBab(f1, state(attempts))).toBe('dikuasai')
    expect(statusBab(f1, state(attempts.map((a) => ({ ...a, saat: 6 * HARI }))))).toBe('sedang')
  })

  it('tidak mencampurkan topik dari bab lain dan memakai skor parsial', () => {
    const asing = Array.from({ length: 10 }, (_, i) =>
      attempt({ soalId: `asing-${i}`, babId: 'f3', topik: 'analisis-data', skor: 1 }),
    )
    expect(statusBab(f1, state(asing))).toBe('belum')

    const lokal = Array.from({ length: 8 }, (_, i) =>
      attempt({ soalId: `q${i}`, sesiId: i < 4 ? 'sesi-a' : 'sesi-b', saat: i < 4 ? 0 : 7 * HARI, skor: 0.75, benar: false }),
    )
    expect(statusBab(f1, state(lokal))).toBe('sedang')
  })
})

describe('statistikTopik', () => {
  it('melaporkan skor parsial, soal unik, sesi, dan level', () => {
    const hasil = statistikTopik(state([
      attempt({ soalId: 'q1', skor: 0.5, benar: false }),
      attempt({ soalId: 'q1', sesiId: 'sesi-2', level: 'menengah', skor: 1 }),
      attempt({ soalId: 'q2', skor: 0.25, benar: false }),
    ]))[0]
    expect(hasil.skorRataRata).toBeCloseTo(0.5833, 3)
    expect(hasil.soalUnik).toBe(2)
    expect(hasil.sesi).toBe(2)
    expect(hasil.level).toEqual(['fondasi', 'menengah'])
  })
})

describe('evaluasiKesiapanModul (Protokol 4 Gerbang)', () => {
  it('mengembalikan status awal jika belum ada aktivitas', async () => {
    const { evaluasiKesiapanModul } = await import('../chapter-status')
    const evaluasi = evaluasiKesiapanModul(f1, state([]))
    expect(evaluasi.totalGerbang).toBe(4)
    expect(evaluasi.jumlahLolos).toBe(0)
    expect(evaluasi.statusKesiapan).toBe('awal')
  })

  it('melacak kelulusan gerbang secara terpisah hingga siap_penuh', async () => {
    const { evaluasiKesiapanModul } = await import('../chapter-status')
    const attempts = Array.from({ length: 8 }, (_, i) =>
      attempt({ soalId: `q${i}`, sesiId: i < 4 ? 'sesi-a' : 'sesi-b', saat: i < 4 ? 0 : 7 * HARI }),
    )
    const st: LearningState = {
      ...state(attempts),
      bab: {
        f1: {
          dibukaPada: Date.now(),
          subBabSelesai: ['f1-1', 'f1-2'],
          refleksi: {
            'logika-f1-1': 'Argumen penurunan matematis lengkap dengan batas validitas.',
            'latihan-f1-1': 'Sketsa penurunan lengkap analisis dimensi.',
          },
          checkpoint: { 'cek-f1-1': true },
          masteryChecklist: {
            'f1-m1': true,
            'f1-m2': true,
            'f1-m3': true,
            'f1-m4': true,
            'f1-m5': true,
          },
        },
      },
    }
    const evaluasi = evaluasiKesiapanModul(f1, st)
    expect(evaluasi.gerbang[0].lulus).toBe(true) // Derivasi
    expect(evaluasi.gerbang[1].lulus).toBe(true) // Logika
    expect(evaluasi.gerbang[2].lulus).toBe(true) // Fermi / Observasi
    expect(evaluasi.gerbang[3].lulus).toBe(true) // Retensi Kuis
    expect(evaluasi.jumlahLolos).toBe(4)
    expect(evaluasi.statusKesiapan).toBe('siap_penuh')
    expect(evaluasi.persentaseKesiapan).toBe(100)
  })
})

