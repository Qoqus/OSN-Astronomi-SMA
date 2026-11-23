export interface AngkaTerurai {
  nilai: number
  angkaPenting: number
}

function hitungAngkaPenting(mantissa: string, adaTitik: boolean): number {
  let digit = mantissa.replace(/^[+-]/, '').replace('.', '')
  digit = digit.replace(/^0+/, '')
  if (!digit) return 1
  if (adaTitik) return digit.length
  const tanpaNol = digit.replace(/0+$/, '')
  return tanpaNol.length || 1
}

export function parseAngka(masukan: string): AngkaTerurai | null {
  if (!masukan) return null
  let s = masukan.normalize('NFKC').trim()
  s = s.replace(/[\u2212\u2013]/g, '-').replace(/\u00a0/g, ' ')
  s = s.replace(/\s+/g, '')

  // 3×10^11 / 3 x 10^11 / 3·10^{11} / 10^11
  s = s.replace(/[×xX·*]?10\^\{?\(?([+-]?\d+)\)?\}?/g, (_m, eksp: string, posisi: number, utuh: string) => {
    const sebelum = utuh.slice(0, posisi)
    return /[0-9]$/.test(sebelum) ? `e${eksp}` : `1e${eksp}`
  })

  const adaKoma = s.includes(',')
  const adaTitik = s.includes('.')
  if (adaKoma && adaTitik) {
    const posKoma = s.lastIndexOf(',')
    const posTitik = s.lastIndexOf('.')
    s = posKoma > posTitik
      ? s.replace(/\./g, '').replace(/,/g, '.')
      : s.replace(/,/g, '')
  } else if (adaKoma) {
    s = s.split(',').length > 2 ? s.replace(/,/g, '') : s.replace(',', '.')
  } else if (adaTitik) {
    if (s.split('.').length > 2) s = s.replace(/\./g, '')
  }

  if (!/^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i.test(s)) return null

  const nilai = Number(s)
  if (!Number.isFinite(nilai)) return null

  const [mantissa] = s.split(/e/i)
  return { nilai, angkaPenting: hitungAngkaPenting(mantissa, mantissa.includes('.')) }
}

const SUPERSKRIP: Record<string, string> = {
  '⁰': '0',
  '¹': '1',
  '²': '2',
  '³': '3',
  '⁴': '4',
  '⁵': '5',
  '⁶': '6',
  '⁷': '7',
  '⁸': '8',
  '⁹': '9',
}

function gantiSuperskrip(teks: string): string {
  return teks.replace(/[⁻⁺]?[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (cocok) => {
    const eksp = [...cocok]
      .map((c) => (c === '⁻' ? '-' : c === '⁺' ? '+' : SUPERSKRIP[c] ?? c))
      .join('')
    return `^${eksp}`
  })
}

export function normalisasiSatuan(satuan: string): string {
  return gantiSuperskrip(satuan)
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\u2212\u2013]/g, '-')
    .replace(/magnitudo|magnitude/g, 'mag')
    .replace(/[·.]/g, '*')
    .replace(/\s+/g, '')
    .replace(/\//g, '*')
    .replace(/([a-z])\^(-?\d)/g, '$1^$2')
    .replace(/([a-z])-(\d)/g, '$1^-$2')
    .replace(/\^\+/g, '^')
}
