import { describe, expect, it } from 'vitest'
import type { Attempt } from '@/types'
import type { Soal } from '@/schemas/soal'
import { jadwalUlangan } from '../retrieval'

function attempt(ubah: Partial<Attempt> = {}): Attempt {
  return {
    id: crypto.randomUUID(),
    sesiId: 'sesi-1',
    soalId: 'q1',
    topik: 'kalkulus',
    level: 'fondasi',
    tipe: 'pilihan-ganda',
    modul: 'santai',
    saat: 0,
    benar: true,
    skor: 1,
    ...ubah,
  }
}

function soal(id: string): Soal {
  return {
    id,
    topik: 'kalkulus',
    level: 'fondasi',
    tipe: 'pilihan-ganda',
    soal: `Soal ${id}`,
    opsi: ['A', 'B'],
    jawaban: 0,
    pembahasan: ['Langkah satu', 'Langkah dua'],
  }
}

const HARI = 24 * 60 * 60 * 1000

describe('jadwalUlangan', () => {
  it('menjadwalkan latihan pertama satu hari setelah jawaban kurang baik', () => {
    const hasil = jadwalUlangan([attempt({ skor: 0.5, benar: false })], [soal('q2')], HARI)
    expect(hasil).toHaveLength(1)
    expect(hasil[0].cukupSoal).toBe(false)
    expect(hasil[0].soalBaru.map((s) => s.id)).toEqual(['q2'])
  })

  it('memperpanjang jeda menjadi tiga hari setelah satu hasil kuat', () => {
    const hasil = jadwalUlangan([attempt({ saat: 0 })], [soal('q2')], HARI)
    expect(hasil).toHaveLength(0)
    expect(jadwalUlangan([attempt({ saat: 0 })], [soal('q2')], 3 * HARI)).toHaveLength(1)
  })

  it('tidak memakai lagi soal yang pernah dicoba dan butuh delapan soal baru', () => {
    const attempts = Array.from({ length: 9 }, (_, i) => attempt({ soalId: `q${i}`, saat: 0 }))
    const kandidat = Array.from({ length: 8 }, (_, i) => soal(`q${i}`))
    const hasil = jadwalUlangan(attempts, kandidat, 7 * HARI)
    expect(hasil).toHaveLength(1)
    expect(hasil[0].soalBaru).toHaveLength(0)
    expect(hasil[0].cukupSoal).toBe(false)
  })
})
