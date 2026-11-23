import { describe, expect, it } from 'vitest'
import { normalisasiSatuan, parseAngka } from '../grading/parse-angka'

describe('parseAngka', () => {
  it('menerima koma desimal Indonesia', () => {
    expect(parseAngka('5,67')).toEqual({ nilai: 5.67, angkaPenting: 3 })
  })

  it('menerima titik desimal', () => {
    expect(parseAngka('5.67')?.nilai).toBeCloseTo(5.67)
  })

  it('menangani pemisah ribuan', () => {
    expect(parseAngka('1.234,5')?.nilai).toBeCloseTo(1234.5)
    expect(parseAngka('1.234')?.nilai).toBeCloseTo(1.234)
  })

  it('membaca notasi ilmiah dengan koma dan pangkat', () => {
    const hasil = parseAngka('9,30 × 10^-3')
    expect(hasil?.nilai).toBeCloseTo(0.0093)
    expect(hasil?.angkaPenting).toBe(3)
  })

  it('membaca notasi e', () => {
    expect(parseAngka('3e8')?.nilai).toBe(3e8)
    expect(parseAngka('3e8')?.angkaPenting).toBe(1)
  })

  it('menolak teks yang bukan angka', () => {
    expect(parseAngka('sekitar lima')).toBeNull()
    expect(parseAngka('')).toBeNull()
  })
})

describe('normalisasiSatuan', () => {
  it('menyamakan variasi penulisan', () => {
    expect(normalisasiSatuan('KM S⁻¹')).toBe(normalisasiSatuan('km s^-1'))
    expect(normalisasiSatuan('Magnitudo')).toBe('mag')
    expect(normalisasiSatuan('m/s')).toBe(normalisasiSatuan('m / s'))
  })
})
