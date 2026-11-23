// Sumber tunggal perhitungan fisis untuk widget, figure, dan angka contoh materi.
// Semua fungsi murni (tanpa DOM) agar bisa di-unit-test dan dipakai di mana saja.

export const KONSTANTA = {
  GM_SUN: 1.32712440018e20, // m³/s²
  AU: 1.495978707e11, // m
  PC: 3.0856775814913673e16, // m
  LSUN: 3.828e26, // W
  RSUN: 6.957e8, // m
  TSUN: 5772, // K
  SIGMA: 5.670374419e-8, // W/m²/K⁴
  MBOL_SUN: 4.74,
  C: 299792458, // m/s
  H0: 70, // km/s/Mpc
} as const

const TAHUN_HARI = 365.25

/** Hukum Kepler III: P² = a³/M (a dalam AU, M dalam massa Matahari, P dalam tahun). */
export function keplerIII(aAU: number, massaMsun = 1): number {
  return Math.sqrt(Math.pow(aAU, 3) / massaMsun)
}

export function periodeHari(aAU: number, massaMsun = 1): number {
  return keplerIII(aAU, massaMsun) * TAHUN_HARI
}

/** Solusi persamaan Kepler M = E - e·sin(E) untuk anomali eksentrik E (Newton–Raphson). */
export function solusiKepler(Mrad: number, e: number, tol = 1e-12): number {
  const M = ((Mrad % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
  let E = e < 0.8 ? M : Math.PI
  for (let i = 0; i < 60; i += 1) {
    const f = E - e * Math.sin(E) - M
    const fp = 1 - e * Math.cos(E)
    const d = f / fp
    E -= d
    if (Math.abs(d) < tol) break
  }
  return E
}

export interface PosisiOrbit {
  x: number // AU
  y: number // AU
  r: number // AU
  nu: number // anomali benar (rad)
  E: number // anomali eksentrik (rad)
}

/** Posisi pada orbit elips dari anomali rata M (rad), fokus di asal. */
export function posisiOrbit(aAU: number, e: number, Mrad: number): PosisiOrbit {
  const E = solusiKepler(Mrad, e)
  const cosE = Math.cos(E)
  const sinE = Math.sin(E)
  const x = aAU * (cosE - e)
  const y = aAU * Math.sqrt(1 - e * e) * sinE
  const r = aAU * (1 - e * cosE)
  const nu = Math.atan2(Math.sqrt(1 - e * e) * sinE, cosE - e)
  return { x, y, r, nu, E }
}

/** Persamaan vis-viva: v² = GM(2/r − 1/a). r,a dalam AU; hasil km/s. */
export function visViva(rAU: number, aAU: number, massaMsun = 1): number {
  const r = rAU * KONSTANTA.AU
  const a = aAU * KONSTANTA.AU
  const v2 = KONSTANTA.GM_SUN * massaMsun * (2 / r - 1 / a)
  return Math.sqrt(Math.max(0, v2)) / 1000
}

/** Fluks permukaan benda hitam: F = σT⁴ (W/m²). */
export function stefanBoltzmann(T: number): number {
  return KONSTANTA.SIGMA * Math.pow(T, 4)
}

/** Luminositas relatif Matahari: L/L☉ = (R/R☉)²·(T/T☉)⁴. */
export function luminositasRelatif(Rrsun: number, T: number): number {
  return Rrsun * Rrsun * Math.pow(T / KONSTANTA.TSUN, 4)
}

/** Radius relatif Matahari dari L dan T: R/R☉ = √(L/L☉)/(T/T☉)². */
export function radiusDariLT(Llsun: number, T: number): number {
  return Math.sqrt(Llsun) / Math.pow(T / KONSTANTA.TSUN, 2)
}

export type DaerahHR = 'deret utama' | 'raksasa' | 'maharaksasa' | 'katai putih'

/** Klasifikasi kasar daerah diagram HR dari suhu (K) dan luminositas (L☉). */
export function klasifikasiHR(T: number, Llsun: number): DaerahHR {
  const logL = Math.log10(Math.max(1e-6, Llsun))
  const logT = Math.log10(Math.max(1, T))
  // Deret utama: logL ≈ 5.5·(logT − 3.76) kasar ( hotter → brighter )
  const deretUtama = 5.5 * (logT - 3.76)
  if (logT < 3.9 && logL < -1) return 'katai putih'
  if (logL > 4.5) return 'maharaksasa'
  if (logL > deretUtama + 1.2) return 'raksasa'
  if (logL < deretUtama - 1.5 && logT > 3.9) return 'katai putih'
  return 'deret utama'
}

/** Fluks terima di jarak d: F = L/(4πd²). L dalam L☉, d dalam pc; hasil W/m². */
export function fluks(Llsun: number, dpc: number): number {
  const L = Llsun * KONSTANTA.LSUN
  const d = dpc * KONSTANTA.PC
  return L / (4 * Math.PI * d * d)
}

/** Magnitudo bolometrik absolut dari luminositas: M = M☉ − 2.5·log10(L/L☉). */
export function magnitudoAbsolutDariL(Llsun: number): number {
  return KONSTANTA.MBOL_SUN - 2.5 * Math.log10(Math.max(1e-9, Llsun))
}

/** Modulus jarak: m − M = 5·log10(d/10pc). */
export function modulusJarak(dpc: number): number {
  return 5 * Math.log10(Math.max(1e-9, dpc) / 10)
}

/** Magnitudo semu: m = M + 5·log10(d/10pc) + Aᵥ. */
export function magnitudoSemu(M: number, dpc: number, Av = 0): number {
  return M + modulusJarak(dpc) + Av
}

/** Jarak (pc) dari modulus jarak (m − M), tanpa ekstingsi. */
export function jarakDariModulus(modulus: number): number {
  return Math.pow(10, (modulus + 5) / 5)
}

/** Panjang gelombang puncak Wien (nm): λ = b/T, b = 2.897771955e-3 m·K. */
export function wien(T: number): number {
  return (2.897771955e-3 / T) * 1e9
}

/** Kecepatan radial Doppler non-relativistik: v = c·Δλ/λ (km/s). */
export function doppler(deltaLambda: number, lambda: number): number {
  return (KONSTANTA.C * (deltaLambda / lambda)) / 1000
}

/** Hukum Hubble: v = H0·d (v km/s, d Mpc). */
export function hubble(dMpc: number, H0 = KONSTANTA.H0): number {
  return H0 * dMpc
}