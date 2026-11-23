import { describe, expect, it } from 'vitest'
import type { Soal } from '@/schemas/soal'
import { kunciJawaban, nilaiSoal } from '../grading'

const pg: Soal = {
  id: 't-pg',
  tipe: 'pilihan-ganda',
  topik: 'matematika',
  level: 'fondasi',
  soal: 'Dua tambah dua?',
  opsi: ['3', '4', '5'],
  jawaban: 1,
  pembahasan: ['Langkah satu.', 'Langkah dua.'],
}

const jamak: Soal = {
  id: 't-jamak',
  tipe: 'pilihan-jamak',
  topik: 'matematika',
  level: 'fondasi',
  soal: 'Pilih bilangan genap.',
  opsi: ['1', '2', '3', '4'],
  jawaban: [1, 3],
  pembahasan: ['Langkah satu.', 'Langkah dua.'],
}

const isian: Soal = {
  id: 't-isian',
  tipe: 'isian',
  topik: 'matematika',
  level: 'menengah',
  soal: 'Jarak dalam parsek?',
  jawaban: 100,
  toleransiRel: 0.01,
  satuan: 'pc',
  pembahasan: ['Langkah satu.', 'Langkah dua.'],
}

const isianSigfig: Soal = {
  id: 't-sigfig',
  tipe: 'isian',
  topik: 'matematika',
  level: 'menengah',
  soal: 'Sudut dalam radian?',
  jawaban: 0.0093,
  toleransiRel: 0.02,
  satuan: 'rad',
  signifikan: 3,
  pembahasan: ['Langkah satu.', 'Langkah dua.'],
}

const esai: Soal = {
  id: 't-esai',
  tipe: 'esai',
  topik: 'analisis-data',
  level: 'penalaran',
  soal: 'Jelaskan.',
  rubrik: [
    { poin: 'Alasan pertama', bobot: 2 },
    { poin: 'Alasan kedua', bobot: 2 },
  ],
  pembahasan: ['Langkah satu.', 'Langkah dua.'],
}

describe('nilaiSoal — pilihan ganda', () => {
  it('benar hanya untuk indeks yang tepat', () => {
    expect(nilaiSoal(pg, { tipe: 'pilihan-ganda', indeks: 1 }).skor).toBe(1)
    expect(nilaiSoal(pg, { tipe: 'pilihan-ganda', indeks: 0 }).skor).toBe(0)
  })
})

describe('nilaiSoal — pilihan jamak', () => {
  it('memakai kesamaan himpunan, tanpa nilai parsial', () => {
    expect(nilaiSoal(jamak, { tipe: 'pilihan-jamak', indeks: [3, 1] }).skor).toBe(1)
    expect(nilaiSoal(jamak, { tipe: 'pilihan-jamak', indeks: [1] }).skor).toBe(0)
    expect(nilaiSoal(jamak, { tipe: 'pilihan-jamak', indeks: [1, 3, 2] }).skor).toBe(0)
  })
})

describe('nilaiSoal — isian', () => {
  it('menerima koma desimal di dalam toleransi', () => {
    expect(nilaiSoal(isian, { tipe: 'isian', angka: '100', satuan: 'pc' }).skor).toBe(1)
    expect(nilaiSoal(isian, { tipe: 'isian', angka: '100,5', satuan: 'pc' }).skor).toBe(1)
    expect(nilaiSoal(isian, { tipe: 'isian', angka: '102', satuan: 'pc' }).skor).toBe(0)
  })

  it('menolak satuan yang salah dengan pesan', () => {
    const hasil = nilaiSoal(isian, { tipe: 'isian', angka: '100', satuan: 'km' })
    expect(hasil.skor).toBe(0)
    expect(hasil.pesan).toContain('Satuan')
  })

  it('memberi skor 0,5 bila nilai benar tetapi angka penting salah', () => {
    const hasil = nilaiSoal(isianSigfig, { tipe: 'isian', angka: '0,0093', satuan: 'rad' })
    expect(hasil.skor).toBe(0.5)
    expect(hasil.benar).toBe(false)
    expect(nilaiSoal(isianSigfig, { tipe: 'isian', angka: '9,30 × 10^-3', satuan: 'rad' }).skor).toBe(1)
  })
})

describe('nilaiSoal — esai', () => {
  it('menghitung skor rubrik berbobot', () => {
    expect(nilaiSoal(esai, { tipe: 'esai', rubrik: [true, true] }).skor).toBe(1)
    expect(nilaiSoal(esai, { tipe: 'esai', rubrik: [true, false] }).skor).toBe(0.5)
    expect(nilaiSoal(esai, { tipe: 'esai', rubrik: [false, false] }).benar).toBe(false)
  })
})

describe('kunciJawaban', () => {
  it('memformat kunci per tipe', () => {
    expect(kunciJawaban(pg)).toBe('B')
    expect(kunciJawaban(jamak)).toBe('B, D')
    expect(kunciJawaban(isian)).toBe('100 pc')
    expect(kunciJawaban(esai)).toBe('Dinilai dengan rubrik')
  })
})

const soalRanking: Soal = {
  id: 't-rank',
  modul: 'F1',
  subbab: 'notasi-satuan',
  topik: 'matematika',
  level: 'fondasi',
  difficulty: 'mudah',
  tipe: 'ranking_urutan',
  soal: 'Urutkan dari kecil ke besar.',
  opsi: ['1 AU', '1 m', '1 pc'],
  jawaban: [1, 0, 2],
  rumus_dibutuhkan: ['1 pc > 1 AU > 1 m'],
  langkah_penyelesaian: ['Bandingkan nilai meter.', 'Susun menaik.'],
  satuan: '—',
}

const soalMultiLangkah: Soal = {
  id: 't-multi',
  modul: 'F2',
  subbab: 'vektor-komponen',
  topik: 'trigonometri-vektor',
  level: 'olimpiade',
  difficulty: 'sulit',
  tipe: 'multi_langkah',
  soal: 'Hitung berantai.',
  langkah: [
    {
      instruksi: 'Langkah 1',
      tipe: 'pilihan_ganda',
      opsi: ['Salah', 'Benar'],
      jawaban: 1,
    },
    {
      instruksi: 'Langkah 2',
      tipe: 'isian_angka',
      jawaban: 12.5,
      toleransi: 0.02,
      satuan: 'pc',
    },
  ],
  jawaban: [1, 12.5],
  rumus_dibutuhkan: ['d = 1/p', 'v_t = 4,74 μ d', 'tan θ = v_t / v_r'],
  langkah_penyelesaian: ['Tahap 1.', 'Tahap 2.', 'Tahap 3.'],
  alasan_sulit: 'Memenuhi (a) dan (c) chained reasoning.',
  satuan: '—',
}

const soalTemukanSalah: Soal = {
  id: 't-err',
  modul: 'F3',
  subbab: 'propagasi-galat',
  topik: 'analisis-data',
  level: 'menengah',
  difficulty: 'sedang',
  tipe: 'temukan_kesalahan',
  soal: 'Temukan kesalahannya.',
  opsi: ['Kesalahan A', 'Kesalahan B'],
  jawaban: 0,
  rumus_dibutuhkan: ['σ_f / f = |n| σ_x / x', 'ln 10'],
  langkah_penyelesaian: ['Periksa turunan.', 'Bandingkan faktor skala.'],
  satuan: '—',
}

describe('nilaiSoal — tipe soal baru (ranking_urutan, multi_langkah, analitik)', () => {
  it('menilai ranking_urutan penuh dan parsial per posisi', () => {
    const penuh = nilaiSoal(soalRanking, { tipe: 'ranking_urutan', urutan: [1, 0, 2] })
    expect(penuh.benar).toBe(true)
    expect(penuh.skor).toBe(1)

    const parsial = nilaiSoal(soalRanking, { tipe: 'ranking_urutan', urutan: [1, 2, 0] })
    expect(parsial.benar).toBe(false)
    expect(parsial.skor).toBeCloseTo(1 / 3)
    expect(kunciJawaban(soalRanking)).toContain('1. 1 m')
  })

  it('menilai multi_langkah dengan angka desimal koma Indonesia dan detailLangkah', () => {
    const penuh = nilaiSoal(soalMultiLangkah, {
      tipe: 'multi_langkah',
      langkah: [
        { tipe: 'pilihan_ganda', indeks: 1 },
        { tipe: 'isian_angka', angka: '12,5', satuan: 'pc' },
      ],
    })
    expect(penuh.benar).toBe(true)
    expect(penuh.skor).toBe(1)
    expect(penuh.detailLangkah).toEqual([true, true])

    const parsial = nilaiSoal(soalMultiLangkah, {
      tipe: 'multi_langkah',
      langkah: [
        { tipe: 'pilihan_ganda', indeks: 1 },
        { tipe: 'isian_angka', angka: '12,5', satuan: 'km' },
      ],
    })
    expect(parsial.benar).toBe(false)
    expect(parsial.skor).toBe(0.5)
    expect(parsial.detailLangkah).toEqual([true, false])
  })

  it('menilai soal analitik temukan_kesalahan dengan interaksi pilihan ganda', () => {
    expect(nilaiSoal(soalTemukanSalah, { tipe: 'pilihan-ganda', indeks: 0 }).benar).toBe(true)
    expect(nilaiSoal(soalTemukanSalah, { tipe: 'pilihan-ganda', indeks: 1 }).benar).toBe(false)
  })
})

