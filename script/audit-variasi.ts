import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { skemaBankSoal } from '../src/schemas/soal'

const akar = process.cwd()
const modulArgs = process.argv.slice(2).map((m) => m.toLowerCase())
const targetModuls = modulArgs.length > 0 ? modulArgs : ['f1', 'f2', 'f3']

interface SoalBaru {
  id: string
  modul: string
  subbab: string
  tipe: string
  difficulty: 'mudah' | 'sedang' | 'sulit'
  media?: { type: string; params: Record<string, unknown>; caption?: string }
  rumus_dibutuhkan: string[]
  langkah_penyelesaian: string[]
  alasan_sulit?: string
  opsi?: string[]
}

function cekKriteriaSulit(s: SoalBaru) {
  const teks = (s.alasan_sulit ?? '').toLowerCase()
  const critA = s.rumus_dibutuhkan.length >= 3
  const critB = /\(b\)|manipulasi|isolasi|substitusi|eliminasi/.test(teks)
  const critC =
    /\(c\)|chained|berantai|langkah 1/.test(teks) &&
    (s.langkah_penyelesaian.length >= 3 || s.tipe === 'multi_langkah')

  const jumlah = [critA, critB, critC].filter(Boolean).length
  return {
    lolos: jumlah >= 2,
    critA,
    critB,
    critC,
    jumlah,
  }
}

let adaGagal = false

for (const mod of targetModuls) {
  const path = join(akar, 'content/soal', `${mod}.json`)
  if (!existsSync(path)) {
    console.error(`✕ Berkas tidak ditemukan: content/soal/${mod}.json`)
    adaGagal = true
    continue
  }
  const raw = JSON.parse(readFileSync(path, 'utf8'))
  const parsed = skemaBankSoal.safeParse(raw)
  if (!parsed.success) {
    console.error(`✕ Skema gagal pada ${mod}.json:`)
    for (const issue of parsed.error.issues) {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`)
    }
    adaGagal = true
    continue
  }

  const semua = parsed.data
  const lama = semua.filter((s) => !('difficulty' in s))
  const baru = semua.filter((s): s is typeof s & SoalBaru => 'difficulty' in s)

  const vCount = baru.filter((s) => new RegExp(`^${mod}-v\\d+$`, 'i').test(s.id)).length
  const hCount = baru.filter((s) => new RegExp(`^${mod}-h\\d+$`, 'i').test(s.id)).length

  const tipeSet = new Set(baru.map((s) => s.tipe))
  const denganMedia = baru.filter((s) => Boolean(s.media))
  const visualSet = new Set(denganMedia.map((s) => s.media!.type))

  const mudah = baru.filter((s) => s.difficulty === 'mudah')
  const sedang = baru.filter((s) => s.difficulty === 'sedang')
  const sulit = baru.filter((s) => s.difficulty === 'sulit')

  const avgRumusSedang =
    sedang.length > 0
      ? sedang.reduce((t, s) => t + s.rumus_dibutuhkan.length, 0) / sedang.length
      : 0
  const avgRumusSulit =
    sulit.length > 0
      ? sulit.reduce((t, s) => t + s.rumus_dibutuhkan.length, 0) / sulit.length
      : 0

  const hasilSulit = sulit.map((s) => ({ id: s.id, ...cekKriteriaSulit(s) }))
  const benderaSulit = hasilSulit.filter((r) => !r.lolos)

  const chainedFrac =
    sulit.length > 0 ? hasilSulit.filter((r) => r.critC).length / sulit.length : 0
  const manipFrac =
    sulit.length > 0 ? hasilSulit.filter((r) => r.critB).length / sulit.length : 0

  const isPureNumeric = (s: SoalBaru) =>
    s.tipe === 'isian_angka' ||
    ((s.tipe === 'interpretasi_grafik' || s.tipe === 'interpretasi_tabel') &&
      (!s.opsi || s.opsi.length === 0))
  const nonNumericFrac =
    baru.length > 0 ? baru.filter((s) => !isPureNumeric(s)).length / baru.length : 0

  const repCov = baru.length > 0 ? denganMedia.length / baru.length : 0
  const diffBalance = `${Math.round((mudah.length / Math.max(1, baru.length)) * 100)}/${Math.round((sedang.length / Math.max(1, baru.length)) * 100)}/${Math.round((sulit.length / Math.max(1, baru.length)) * 100)}`

  const lolosSemua =
    lama.length === 30 &&
    baru.length === 20 &&
    vCount === 10 &&
    hCount === 10 &&
    tipeSet.size >= 5 &&
    repCov >= 0.5 &&
    visualSet.size >= 4 &&
    mudah.length === 4 &&
    sedang.length === 10 &&
    sulit.length === 6 &&
    avgRumusSedang >= 2 &&
    avgRumusSulit >= 3 &&
    chainedFrac >= 0.5 &&
    manipFrac >= 0.5 &&
    nonNumericFrac >= 0.3 &&
    benderaSulit.length === 0

  if (!lolosSemua) adaGagal = true

  console.log(`\n=== LAPORAN VARIASI MODUL ${mod.toUpperCase()} (${lolosSemua ? 'LOLOS' : 'PERLU PERBAIKAN'}) ===`)
  console.log(`Soal lama utuh     : ${lama.length}/30 | Soal baru: ${baru.length}/20 (${vCount} visual, ${hCount} hard)`)
  console.log(`1. type_entropy               : ${tipeSet.size} tipe berbeda (target >= 5) -> [${[...tipeSet].join(', ')}]`)
  console.log(`2. representation_coverage    : ${(repCov * 100).toFixed(1)}% (${denganMedia.length}/${baru.length}) (target >= 50%)`)
  console.log(`3. visual_type_diversity      : ${visualSet.size} tipe visual (target >= 4) -> [${[...visualSet].join(', ')}]`)
  console.log(`4. difficulty_balance         : ${diffBalance} (${mudah.length} mudah / ${sedang.length} sedang / ${sulit.length} sulit) (target 20/50/30)`)
  console.log(`5. formula_depth_avg          : sedang=${avgRumusSedang.toFixed(2)} (>=2), sulit=${avgRumusSulit.toFixed(2)} (>=3)`)
  console.log(`6. chained_reasoning_fraction : ${(chainedFrac * 100).toFixed(1)}% dari sulit (target >= 50%)`)
  console.log(`7. manipulation_fraction      : ${(manipFrac * 100).toFixed(1)}% dari sulit (target >= 50%)`)
  console.log(`8. non_numeric_ratio          : ${(nonNumericFrac * 100).toFixed(1)}% (target >= 30%)`)
  if (benderaSulit.length > 0) {
    console.log(`Bendera soal sulit gagal      : ${benderaSulit.map((b) => `${b.id} (${b.jumlah}/3)`).join(', ')}`)
  } else {
    console.log(`Bendera soal sulit gagal      : tidak ada (semua ${sulit.length} soal sulit lolos >= 2/3 kriteria)`)
  }
}

if (adaGagal) process.exitCode = 1
