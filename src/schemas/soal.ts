import { z } from 'zod'
import { skemaMedia, type MediaParametrik } from './visual'

const dasar = {
  id: z.string().min(1, 'id wajib diisi'),
  topik: z.string().min(1),
  level: z.enum(['fondasi', 'menengah', 'penalaran', 'olimpiade']),
  soal: z.string().min(1),
  gambar: z.string().optional(),
  media: skemaMedia.optional(),
  pembahasan: z.array(z.string().min(1)).min(2, 'pembahasan minimal 2 langkah'),
}

export const skemaPilihanGanda = z.object({
  ...dasar,
  tipe: z.literal('pilihan-ganda'),
  opsi: z.array(z.string().min(1)).min(2),
  jawaban: z.number().int().min(0),
})

export const skemaPilihanJamak = z.object({
  ...dasar,
  tipe: z.literal('pilihan-jamak'),
  opsi: z.array(z.string().min(1)).min(3),
  jawaban: z.array(z.number().int().min(0)).min(2),
})

export const skemaIsian = z.object({
  ...dasar,
  tipe: z.literal('isian'),
  jawaban: z.number(),
  toleransiRel: z.number().gt(0).default(0.01),
  satuan: z.string().min(1),
  signifikan: z.number().int().min(1).optional(),
})

export const skemaEsai = z.object({
  ...dasar,
  tipe: z.literal('esai'),
  rubrik: z.array(z.object({ poin: z.string().min(1), bobot: z.number().gt(0) })).min(2),
  jawabanTeladan: z.string().optional(),
})

export const skemaSubLangkah = z.object({
  instruksi: z.string().min(1),
  tipe: z.enum(['pilihan_ganda', 'isian_angka']),
  opsi: z.array(z.string().min(1)).min(2).optional(),
  jawaban: z.number(),
  toleransi: z.number().gt(0).optional(),
  satuan: z.string().min(1).optional(),
  signifikan: z.number().int().min(1).optional(),
})

export type SubLangkah = z.infer<typeof skemaSubLangkah>

const dasarBaru = {
  id: z.string().min(1, 'id wajib diisi'),
  modul: z.string().min(1),
  subbab: z.string().min(1),
  topik: z.string().min(1),
  level: z.enum(['fondasi', 'menengah', 'penalaran', 'olimpiade']),
  difficulty: z.enum(['mudah', 'sedang', 'sulit']),
  soal: z.string().min(1),
  gambar: z.string().optional(),
  media: skemaMedia.optional(),
  rumus_dibutuhkan: z.array(z.string().min(1)).min(1),
  langkah_penyelesaian: z.array(z.string().min(1)).min(2),
  pembahasan: z.array(z.string().min(1)).min(2).optional(),
  satuan: z.string().min(1),
  toleransi: z.number().gt(0).optional(),
  signifikan: z.number().int().min(1).optional(),
  alasan_sulit: z.string().min(10).optional(),
}

const skemaPilihanTunggalBaru = z.object({
  ...dasarBaru,
  tipe: z.enum(['pilihan_ganda', 'temukan_kesalahan', 'cek_dimensi', 'data_tidak_lengkap']),
  opsi: z.array(z.string().min(1)).min(2),
  jawaban: z.number().int().min(0),
})

const skemaPilihanJamakBaru = z.object({
  ...dasarBaru,
  tipe: z.literal('pilihan_jamak'),
  opsi: z.array(z.string().min(1)).min(3),
  jawaban: z.array(z.number().int().min(0)).min(2),
})

const skemaIsianAngkaBaru = z.object({
  ...dasarBaru,
  tipe: z.literal('isian_angka'),
  jawaban: z.number(),
  toleransi: z.number().gt(0).default(0.02),
})

const skemaEsaiPenalaranBaru = z.object({
  ...dasarBaru,
  tipe: z.literal('esai_penalaran'),
  rubrik: z.array(z.object({ poin: z.string().min(1), bobot: z.number().gt(0) })).min(2),
  jawaban: z.string().min(1),
  jawabanTeladan: z.string().optional(),
})

const skemaInterpretasiBaru = z.object({
  ...dasarBaru,
  tipe: z.enum(['interpretasi_grafik', 'interpretasi_tabel']),
  opsi: z.array(z.string().min(1)).min(2).optional(),
  jawaban: z.union([z.number(), z.array(z.number().int().min(0)).min(2)]),
})

const skemaRankingUrutan = z.object({
  ...dasarBaru,
  tipe: z.literal('ranking_urutan'),
  opsi: z.array(z.string().min(1)).min(3),
  jawaban: z.array(z.number().int().min(0)).min(3),
  kriteriaUrut: z.string().optional(),
})

const skemaMultiLangkah = z.object({
  ...dasarBaru,
  tipe: z.literal('multi_langkah'),
  langkah: z.array(skemaSubLangkah).min(2),
  jawaban: z.array(z.union([z.number(), z.string()])).min(2),
})

export const skemaSoalMentah = z.discriminatedUnion('tipe', [
  skemaPilihanGanda,
  skemaPilihanJamak,
  skemaIsian,
  skemaEsai,
  skemaPilihanTunggalBaru,
  skemaPilihanJamakBaru,
  skemaIsianAngkaBaru,
  skemaEsaiPenalaranBaru,
  skemaInterpretasiBaru,
  skemaRankingUrutan,
  skemaMultiLangkah,
])

export const skemaSoal = skemaSoalMentah.superRefine((val, ctx) => {
  if ('difficulty' in val && val.difficulty === 'sulit' && !val.alasan_sulit) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['alasan_sulit'],
      message: 'Soal difficulty "sulit" wajib mencantumkan field alasan_sulit.',
    })
  }
  if (val.tipe === 'ranking_urutan') {
    const n = val.opsi.length
    const unik = new Set(val.jawaban)
    const valid =
      val.jawaban.length === n &&
      unik.size === n &&
      val.jawaban.every((idx) => idx >= 0 && idx < n)
    if (!valid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['jawaban'],
        message: 'jawaban ranking_urutan harus permutasi lengkap 0..opsi.length-1.',
      })
    }
  }
  if (val.tipe === 'multi_langkah') {
    if (val.langkah.length !== val.jawaban.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['jawaban'],
        message: 'Jumlah jawaban multi_langkah harus sama dengan jumlah langkah.',
      })
    }
    for (let i = 0; i < val.langkah.length; i++) {
      const l = val.langkah[i]
      if (l.tipe === 'pilihan_ganda' && (!l.opsi || l.jawaban >= l.opsi.length)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['langkah', i],
          message: 'Sub-langkah pilihan_ganda wajib memiliki opsi dan indeks jawaban valid.',
        })
      }
      if (l.tipe === 'isian_angka' && !l.satuan) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['langkah', i, 'satuan'],
          message: 'Sub-langkah isian_angka wajib memiliki satuan.',
        })
      }
    }
  }
})

export const skemaBankSoal = z.array(skemaSoal).min(1)

export type Soal = z.infer<typeof skemaSoal>
export type SoalPilihanGanda = z.infer<typeof skemaPilihanGanda>
export type SoalPilihanJamak = z.infer<typeof skemaPilihanJamak>
export type SoalIsian = z.infer<typeof skemaIsian>
export type SoalEsai = z.infer<typeof skemaEsai>
export type SoalRankingUrutan = z.infer<typeof skemaRankingUrutan>
export type SoalMultiLangkah = z.infer<typeof skemaMultiLangkah>

export type ModeInteraksiSoal =
  | 'pilihan-ganda'
  | 'pilihan-jamak'
  | 'isian'
  | 'esai'
  | 'ranking_urutan'
  | 'multi_langkah'

export function modeInteraksiSoal(soal: Soal): ModeInteraksiSoal {
  if (soal.tipe === 'pilihan-ganda') return 'pilihan-ganda'
  if (soal.tipe === 'pilihan-jamak') return 'pilihan-jamak'
  if (soal.tipe === 'isian') return 'isian'
  if (soal.tipe === 'esai') return 'esai'
  if (soal.tipe === 'pilihan_ganda' || soal.tipe === 'temukan_kesalahan' || soal.tipe === 'cek_dimensi' || soal.tipe === 'data_tidak_lengkap') {
    return 'pilihan-ganda'
  }
  if (soal.tipe === 'pilihan_jamak') return 'pilihan-jamak'
  if (soal.tipe === 'isian_angka') return 'isian'
  if (soal.tipe === 'esai_penalaran') return 'esai'
  if (soal.tipe === 'interpretasi_grafik' || soal.tipe === 'interpretasi_tabel') {
    if (soal.opsi && soal.opsi.length > 0) {
      return Array.isArray(soal.jawaban) ? 'pilihan-jamak' : 'pilihan-ganda'
    }
    return 'isian'
  }
  if (soal.tipe === 'ranking_urutan') return 'ranking_urutan'
  return 'multi_langkah'
}

export function pembahasanSoal(soal: Soal): string[] {
  if (soal.pembahasan && soal.pembahasan.length > 0) return soal.pembahasan
  if ('langkah_penyelesaian' in soal && Array.isArray(soal.langkah_penyelesaian)) {
    return soal.langkah_penyelesaian
  }
  return []
}

export function mediaSoal(soal: Soal): MediaParametrik | undefined {
  return 'media' in soal ? soal.media : undefined
}

export function labelLevel(level: Soal['level']): string {
  if (level === 'fondasi') return 'Fondasi'
  if (level === 'menengah') return 'Menengah'
  if (level === 'penalaran') return 'Penalaran'
  return 'Olimpiade'
}
