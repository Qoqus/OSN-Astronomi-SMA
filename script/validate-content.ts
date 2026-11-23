import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { KATALOG, TOPIK } from '../content/index'
import { skemaBankSoal } from '../src/schemas/soal'
import { GAMBAR_SET } from '../src/components/figures/daftar'

const akar = process.cwd()
const MODE_AKHIR = process.env.KONTEN_FINAL === '1'
const galat: string[] = []
const peringatan: string[] = []

function bacaJson(rel: string): unknown {
  const path = join(akar, rel.replace(/^\//, ''))
  if (!existsSync(path)) {
    galat.push(`Berkas tidak ditemukan: ${rel}`)
    return null
  }
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch (e) {
    galat.push(`JSON tidak valid: ${rel} (${(e as Error).message})`)
    return null
  }
}

const folderSoal = join(akar, 'content/soal')
const berkasSoal = existsSync(folderSoal)
  ? readdirSync(folderSoal).filter((f) => f.endsWith('.json'))
  : []

interface Bank {
  path: string
  soal: ReturnType<typeof skemaBankSoal.parse>
}

const bank: Bank[] = []
for (const nama of berkasSoal) {
  const path = `/content/soal/${nama}`
  const isi = bacaJson(path)
  const hasil = skemaBankSoal.safeParse(isi)
  if (!hasil.success) {
    for (const issue of hasil.error.issues) {
      galat.push(`${path} → ${issue.path.join('.')}: ${issue.message}`)
    }
    continue
  }
  bank.push({ path, soal: hasil.data })
}

const idTerpakai = new Set<string>()
for (const b of bank) {
  for (const s of b.soal) {
    if (idTerpakai.has(s.id)) galat.push(`id soal ganda: ${s.id} (${b.path})`)
    idTerpakai.add(s.id)

    if (!(s.topik in TOPIK)) galat.push(`topik tidak dikenal pada ${s.id}: ${s.topik}`)

    if (s.gambar && !GAMBAR_SET.has(s.gambar)) {
      galat.push(`${s.id}: gambar tidak terdaftar di registry: ${s.gambar}`)
    }

    if ('opsi' in s && Array.isArray(s.opsi)) {
      const opsiLen = s.opsi.length
      if (typeof s.jawaban === 'number') {
        if (s.jawaban >= opsiLen) galat.push(`${s.id}: indeks jawaban di luar opsi`)
      } else if (Array.isArray(s.jawaban) && s.jawaban.every((x) => typeof x === 'number')) {
        const unik = new Set(s.jawaban)
        if (unik.size !== s.jawaban.length) galat.push(`${s.id}: jawaban berulang pada ${s.id}`)
        if (s.jawaban.some((i) => Number(i) >= opsiLen)) {
          galat.push(`${s.id}: indeks jawaban di luar opsi`)
        }
      }
    }
  }
}

const semuaSoal = bank.flatMap((b) => b.soal)
for (const bab of KATALOG) {
  if (!bab.tersedia) {
    if (bab.file || bab.soalFile) {
      peringatan.push(`${bab.kode} bertanda belum tersedia tetapi sudah punya berkas`)
    }
    continue
  }
  if (!bab.file) {
    galat.push(`${bab.kode}: bab tersedia tanpa file materi`)
  } else if (!existsSync(join(akar, bab.file.replace(/^\//, '')))) {
    galat.push(`${bab.kode}: materi tidak ditemukan (${bab.file})`)
  }

  if (!bab.soalFile) {
    galat.push(`${bab.kode}: bab tersedia tanpa bank soal`)
    continue
  }
  const b = bank.find((x) => x.path === bab.soalFile)
  if (!b) {
    galat.push(`${bab.kode}: bank soal tidak ditemukan (${bab.soalFile})`)
    continue
  }
  const minSoal = MODE_AKHIR ? 30 : 10
  if (b.soal.length < minSoal) galat.push(`${bab.kode}: minimal ${minSoal} soal, sekarang ${b.soal.length}`)
  if (!b.soal.some((s) => s.level === 'penalaran')) {
    galat.push(`${bab.kode}: wajib ada minimal satu soal level penalaran`)
  }
  const jmlOlimpiade = b.soal.filter((s) => s.level === 'olimpiade').length
  const jmlGambar = b.soal.filter((s) => Boolean(s.gambar || ('media' in s && s.media))).length
  if (MODE_AKHIR) {
    if (jmlOlimpiade < 6) galat.push(`${bab.kode}: minimal 6 soal olimpiade, sekarang ${jmlOlimpiade}`)
    if (jmlGambar < 10) galat.push(`${bab.kode}: minimal 10 soal bergambar/media, sekarang ${jmlGambar}`)
  } else {
    if (jmlOlimpiade === 0) peringatan.push(`${bab.kode}: belum ada soal olimpiade (${b.soal.length} soal)`)
  }
  for (const s of b.soal) {
    if (!bab.topik.includes(s.topik)) {
      galat.push(`${bab.kode}: ${s.id} memakai topik ${s.topik} di luar topik bab`)
    }
  }
}

const folderMateri = join(akar, 'content/materi')
function scanMdx(dir: string) {
  if (!existsSync(dir)) return
  for (const entri of readdirSync(dir, { withFileTypes: true })) {
    const penuh = join(dir, entri.name)
    if (entri.isDirectory()) {
      scanMdx(penuh)
    } else if (entri.name.endsWith('.mdx')) {
      const teks = readFileSync(penuh, 'utf8')
      for (const m of teks.matchAll(/<Gambar\s+id="([^"]+)"/g)) {
        if (!GAMBAR_SET.has(m[1])) {
          galat.push(`${entri.name}: <Gambar id="${m[1]}"> tidak terdaftar di registry`)
        }
      }
    }
  }
}
scanMdx(folderMateri)

const soalBaru = semuaSoal.filter((s) => 'difficulty' in s)
const tipe = {
  'pilihan-ganda': semuaSoal.filter((s) => s.tipe === 'pilihan-ganda').length,
  'pilihan-jamak': semuaSoal.filter((s) => s.tipe === 'pilihan-jamak').length,
  isian: semuaSoal.filter((s) => s.tipe === 'isian').length,
  esai: semuaSoal.filter((s) => s.tipe === 'esai').length,
}
const level = {
  fondasi: semuaSoal.filter((s) => s.level === 'fondasi').length,
  menengah: semuaSoal.filter((s) => s.level === 'menengah').length,
  penalaran: semuaSoal.filter((s) => s.level === 'penalaran').length,
  olimpiade: semuaSoal.filter((s) => s.level === 'olimpiade').length,
}
const bergambar = semuaSoal.filter((s) => Boolean(s.gambar || ('media' in s && s.media))).length

for (const p of peringatan) console.warn(`  ! ${p}`)
if (galat.length > 0) {
  console.error(`\nValidasi konten gagal (${galat.length} masalah):`)
  for (const g of galat) console.error(`  ✕ ${g}`)
  process.exitCode = 1
} else {
  console.log(
    `Konten valid${MODE_AKHIR ? ' (mode akhir)' : ''} — ${semuaSoal.length} soal (lama ${semuaSoal.length - soalBaru.length}: PG ${tipe['pilihan-ganda']}, jamak ${tipe['pilihan-jamak']}, isian ${tipe.isian}, esai ${tipe.esai}; baru ${soalBaru.length}), ${KATALOG.filter((b) => b.tersedia).length} bab tersedia.`,
  )
  console.log(
    `  Level: fondasi ${level.fondasi} · menengah ${level.menengah} · penalaran ${level.penalaran} · olimpiade ${level.olimpiade} | visual/media ${bergambar}/${semuaSoal.length}`,
  )
}
