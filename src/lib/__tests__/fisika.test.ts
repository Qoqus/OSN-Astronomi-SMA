import { describe, expect, it } from 'vitest'
import {
  KONSTANTA,
  doppler,
  fluks,
  hubble,
  jarakDariModulus,
  keplerIII,
  klasifikasiHR,
  luminositasRelatif,
  magnitudoAbsolutDariL,
  magnitudoSemu,
  modulusJarak,
  periodeHari,
  posisiOrbit,
  radiusDariLT,
  solusiKepler,
  stefanBoltzmann,
  visViva,
  wien,
} from '../fisika'

describe('kepler III', () => {
  it('Bumi: a=1 AU, M=1 → P=1 tahun', () => {
    expect(keplerIII(1, 1)).toBeCloseTo(1, 9)
    expect(periodeHari(1, 1)).toBeCloseTo(365.25, 6)
  })

  it('a=4 AU → P=8 tahun', () => {
    expect(keplerIII(4, 1)).toBeCloseTo(8, 9)
  })

  it('massa lebih besar memperpendek periode', () => {
    expect(keplerIII(1, 4)).toBeCloseTo(0.5, 9)
  })
})

describe('solusiKepler', () => {
  it('memenuhi M = E - e·sin(E) untuk berbagai e', () => {
    for (const e of [0, 0.2, 0.5, 0.8]) {
      for (const M of [0, 0.5, 1.5, 3, 5]) {
        const E = solusiKepler(M, e)
        expect(E - e * Math.sin(E)).toBeCloseTo(M, 8)
      }
    }
  })

  it('e=0 → E=M', () => {
    expect(solusiKepler(1.2, 0)).toBeCloseTo(1.2, 10)
  })

  it('konvergen untuk e tinggi dan M dekat 0', () => {
    const E = solusiKepler(0.01, 0.9)
    expect(E - 0.9 * Math.sin(E)).toBeCloseTo(0.01, 8)
  })
})

describe('posisiOrbit', () => {
  it('periapsis (M=0): r = a(1-e)', () => {
    const p = posisiOrbit(2, 0.5, 0)
    expect(p.r).toBeCloseTo(1, 9)
    expect(p.x).toBeCloseTo(1, 9)
    expect(p.y).toBeCloseTo(0, 9)
  })

  it('apoapsis (M=π): r = a(1+e)', () => {
    const p = posisiOrbit(2, 0.5, Math.PI)
    expect(p.r).toBeCloseTo(3, 8)
  })

  it('orbit lingkaran: r konstan = a', () => {
    for (const M of [0, 1, 2, 4]) {
      expect(posisiOrbit(1, 0, M).r).toBeCloseTo(1, 9)
    }
  })
})

describe('vis-viva', () => {
  it('kecepatan orbit Bumi ≈ 29.78 km/s', () => {
    expect(visViva(1, 1, 1)).toBeCloseTo(29.78, 1)
  })

  it('lebih cepat di periapsis daripada apoapsis', () => {
    const vPeri = visViva(0.5, 1, 1)
    const vApo = visViva(1.5, 1, 1)
    expect(vPeri).toBeGreaterThan(vApo)
  })
})

describe('radiasi benda hitam', () => {
  it('stefanBoltzmann Matahari ≈ 6.29e7 W/m²', () => {
    expect(stefanBoltzmann(KONSTANTA.TSUN)).toBeCloseTo(6.294e7, -4)
  })

  it('luminositas dan radius bolak-balik', () => {
    const L = luminositasRelatif(2, 5772)
    expect(L).toBeCloseTo(4, 6)
    expect(radiusDariLT(L, 5772)).toBeCloseTo(2, 6)
  })

  it('Matahari: L=1, T=5772 → R=1', () => {
    expect(radiusDariLT(1, KONSTANTA.TSUN)).toBeCloseTo(1, 9)
  })

  it('wien Matahari ≈ 502 nm', () => {
    expect(wien(KONSTANTA.TSUN)).toBeCloseTo(502, 0)
  })
})

describe('klasifikasiHR', () => {
  it('Matahari di deret utama', () => {
    expect(klasifikasiHR(5772, 1)).toBe('deret utama')
  })

  it('Betelgeuse (dingin, sangat terang) → maharaksasa', () => {
    expect(klasifikasiHR(3500, 1e5)).toBe('maharaksasa')
  })

  it('Sirius B (panas, redup) → katai putih', () => {
    expect(klasifikasiHR(25000, 0.03)).toBe('katai putih')
  })

  it('Aldebaran (dingin, terang) → raksasa', () => {
    expect(klasifikasiHR(3900, 400)).toBe('raksasa')
  })
})

describe('magnitudo dan jarak', () => {
  it('modulusJarak 10 pc = 0', () => {
    expect(modulusJarak(10)).toBeCloseTo(0, 9)
  })

  it('magnitudo absolut L=1 → 4.74', () => {
    expect(magnitudoAbsolutDariL(1)).toBeCloseTo(KONSTANTA.MBOL_SUN, 9)
  })

  it('round-trip magnitudo semu ↔ jarak', () => {
    const M = 4.83
    const d = 100
    const m = magnitudoSemu(M, d)
    expect(m).toBeCloseTo(M + 5, 9)
    expect(jarakDariModulus(m - M)).toBeCloseTo(d, 6)
  })

  it('ekstingsi menambah magnitudo semu', () => {
    expect(magnitudoSemu(5, 100, 2)).toBeCloseTo(magnitudoSemu(5, 100, 0) + 2, 9)
  })

  it('fluks berkurang dengan kuadrat jarak', () => {
    const f1 = fluks(1, 10)
    const f2 = fluks(1, 20)
    expect(f1 / f2).toBeCloseTo(4, 6)
  })

  it('fluks Matahari pada 10 pc ≈ 3.2e-10 W/m²', () => {
    expect(fluks(1, 10)).toBeCloseTo(3.2e-10, 12)
  })
})

describe('doppler dan hubble', () => {
  it('doppler Δλ/λ = 0.001 → ≈ 300 km/s', () => {
    expect(doppler(0.5, 500)).toBeCloseTo(299.79, 1)
  })

  it('hubble d=100 Mpc, H0=70 → 7000 km/s', () => {
    expect(hubble(100)).toBeCloseTo(7000, 6)
  })
})