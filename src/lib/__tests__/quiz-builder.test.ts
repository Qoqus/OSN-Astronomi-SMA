import { describe, expect, it } from 'vitest'
import type { Level } from '@/types'
import type { Soal } from '@/schemas/soal'
import { kocok, sesiCampuran, sesiKuisBab, sesiSimulasi, sesiSantai } from '../quiz-builder'

function soalFake(n: number, topik: string, level: Level): Soal {
  return {
    id: `q-${n}`,
    tipe: 'pilihan-ganda',
    topik,
    level,
    soal: `Soal ${n}`,
    opsi: ['A', 'B', 'C'],
    jawaban: 0,
    pembahasan: ['satu', 'dua'],
  }
}

const bank: Soal[] = [
  ...Array.from({ length: 6 }, (_, i) => soalFake(i + 1, 'matematika', i === 5 ? 'penalaran' : 'fondasi')),
  ...Array.from({ length: 6 }, (_, i) => soalFake(i + 7, 'analisis-data', 'menengah')),
  ...Array.from({ length: 6 }, (_, i) => soalFake(i + 13, 'astronomi-bola', i === 0 ? 'penalaran' : 'menengah')),
  ...Array.from({ length: 4 }, (_, i) => soalFake(i + 19, 'matematika', 'olimpiade')),
]

const bankKaya: Soal[] = (['fondasi', 'menengah', 'penalaran', 'olimpiade'] as Level[]).flatMap(
  (level, li) => Array.from({ length: 8 }, (_, i) => soalFake(li * 100 + i, 'matematika', level)),
)

function hitungLevel(ids: string[] | undefined, sumber: Soal[]): Record<Level, number> {
  const set = new Set(ids)
  const out: Record<Level, number> = { fondasi: 0, menengah: 0, penalaran: 0, olimpiade: 0 }
  for (const s of sumber) if (set.has(s.id)) out[s.level] += 1
  return out
}

describe('sesiCampuran', () => {
  it('mengambil soal dari beberapa topik dan level tanpa pengulangan', () => {
    const sesi = sesiCampuran(bank, 8, 42)
    const dipilih = sesi?.soalIds.map((id) => bank.find((s) => s.id === id)!) ?? []
    expect(sesi?.mode).toBe('campuran')
    expect(new Set(sesi?.soalIds).size).toBe(8)
    expect(new Set(dipilih.map((s) => s.topik)).size).toBeGreaterThan(1)
    expect(new Set(dipilih.map((s) => s.level)).size).toBeGreaterThan(1)
  })
})

describe('kocok', () => {
  it('deterministik untuk seed yang sama', () => {
    expect(kocok([1, 2, 3, 4, 5], 42)).toEqual(kocok([1, 2, 3, 4, 5], 42))
  })

  it('tidak mengubah isi', () => {
    expect([...kocok([1, 2, 3], 1)].sort()).toEqual([1, 2, 3])
  })
})

describe('sesiSantai', () => {
  it('mengambil jumlah soal unik tanpa pengulangan', () => {
    const sesi = sesiSantai('Latihan', bank, 8)
    expect(sesi?.soalIds).toHaveLength(8)
    expect(new Set(sesi?.soalIds).size).toBe(8)
    expect(sesi?.batasMs).toBeUndefined()
  })

  it('mengembalikan null bila bank kosong', () => {
    expect(sesiSantai('Kosong', [], 8)).toBeNull()
  })
})

describe('sesiSimulasi', () => {
  it('deterministik dengan seed tetap', () => {
    const a = sesiSimulasi(bank, ['matematika'], 10, 123)
    const b = sesiSimulasi(bank, ['matematika'], 10, 123)
    expect(a?.soalIds).toEqual(b?.soalIds)
  })

  it('memuat soal penalaran dan waktu 15 menit', () => {
    const sesi = sesiSimulasi(bank, ['matematika'], 10, 7)
    expect(sesi?.soalIds).toHaveLength(10)
    expect(new Set(sesi?.soalIds).size).toBe(10)
    expect(sesi?.batasMs).toBe(15 * 60 * 1000)
    const ids = new Set(sesi?.soalIds)
    const adaPenalaran = bank.some((s) => ids.has(s.id) && s.level === 'penalaran')
    expect(adaPenalaran).toBe(true)
    const adaOlimpiade = bank.some((s) => ids.has(s.id) && s.level === 'olimpiade')
    expect(adaOlimpiade).toBe(true)
  })

  it('tidak melebihi ukuran bank', () => {
    const sedikit: Soal[] = bank.slice(0, 3).map((s) => ({ ...s, id: `${s.id}-x` }))
    const sesi = sesiSimulasi(sedikit, [], 10, 3)
    expect(new Set(sesi?.soalIds).size).toBe(3)
  })
})

describe('sesiKuisBab', () => {
  it('stratified 3/3/2/2 untuk jumlah 10 bila bank kaya', () => {
    const sesi = sesiKuisBab('Kuis', 'f1', bankKaya, 10)
    expect(sesi?.soalIds).toHaveLength(10)
    expect(new Set(sesi?.soalIds).size).toBe(10)
    expect(sesi?.babId).toBe('f1')
    expect(hitungLevel(sesi?.soalIds, bankKaya)).toEqual({
      fondasi: 3,
      menengah: 3,
      penalaran: 2,
      olimpiade: 2,
    })
  })

  it('backfill dari level lain bila satu level kosong', () => {
    const tanpaOlim = bankKaya.filter((s) => s.level !== 'olimpiade')
    const sesi = sesiKuisBab('Kuis', 'f1', tanpaOlim, 10)
    expect(sesi?.soalIds).toHaveLength(10)
    expect(new Set(sesi?.soalIds).size).toBe(10)
    expect(hitungLevel(sesi?.soalIds, tanpaOlim).olimpiade).toBe(0)
  })

  it('mengembalikan null bila bank kosong', () => {
    expect(sesiKuisBab('Kosong', 'f1', [], 10)).toBeNull()
  })
})
