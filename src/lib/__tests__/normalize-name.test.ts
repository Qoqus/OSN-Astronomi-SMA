import { describe, expect, it } from 'vitest'
import { namaTampil, normalisasiNama } from '../normalize-name'
import { parseAngka } from '../grading/parse-angka'

describe('normalisasiNama', () => {
  it('menyamakan kapitalisasi dan spasi', () => {
    expect(normalisasiNama('Budi')).toBe('budi')
    expect(normalisasiNama('  BUDI  ')).toBe('budi')
    expect(normalisasiNama('Budi')).toBe(normalisasiNama('budi'))
  })

  it('merapatkan spasi ganda', () => {
    expect(normalisasiNama('Budi   Santoso')).toBe('budi santoso')
  })

  it('menjaga nama tampilan tetap rapi', () => {
    expect(namaTampil('  Budi   Santoso ')).toBe('Budi Santoso')
  })
})

describe('konversi angka di konteks astronomi', () => {
  it('membaca hasil dengan notasi ilmiah', () => {
    const hasil = parseAngka('2,06 × 10^5')
    expect(hasil?.nilai).toBeCloseTo(206000)
    expect(hasil?.angkaPenting).toBe(3)
  })
})
