import type { HasilPenilaian, Jawaban, JawabanLangkah } from '@/types'
import { modeInteraksiSoal, type Soal, type SubLangkah } from '@/schemas/soal'
import { parseAngka, normalisasiSatuan } from './parse-angka'

const HURUF = 'ABCDEF'

function samaHimpunan(a: number[], b: number[]): boolean {
  const sa = [...new Set(a)].sort((x, y) => x - y)
  const sb = [...new Set(b)].sort((x, y) => x - y)
  return sa.length === sb.length && sa.every((v, i) => v === sb[i])
}

function formatAngkaId(n: number): string {
  if (Math.abs(n) >= 1e5 || (Math.abs(n) < 1e-3 && n !== 0)) {
    return n.toExponential(2).replace('.', ',')
  }
  return String(Number(n.toFixed(4))).replace('.', ',')
}

function nilaiIsianNumerik(
  target: number,
  toleransiRel: number,
  satuanTarget: string,
  signifikan: number | undefined,
  angkaInput: string,
  satuanInput: string,
): HasilPenilaian {
  const terurai = parseAngka(angkaInput)
  if (!terurai) {
    return {
      benar: false,
      skor: 0,
      pesan: 'Angka belum terbaca. Gunakan koma desimal, misalnya 5,67.',
    }
  }
  if (normalisasiSatuan(satuanInput) !== normalisasiSatuan(satuanTarget)) {
    return {
      benar: false,
      skor: 0,
      pesan: `Satuan belum tepat. Jawaban diharapkan dalam ${satuanTarget}.`,
    }
  }
  const toleransi = Math.max(1e-12, Math.abs(target) * toleransiRel)
  if (Math.abs(terurai.nilai - target) > toleransi) {
    return {
      benar: false,
      skor: 0,
      pesan: `Nilai belum tepat (toleransi ${Math.round(toleransiRel * 100)}%).`,
    }
  }
  if (signifikan && terurai.angkaPenting !== signifikan) {
    return {
      benar: false,
      skor: 0.5,
      pesan: `Nilainya benar, tetapi angka penting belum tepat: diminta ${signifikan} angka penting.`,
    }
  }
  return { benar: true, skor: 1 }
}

function nilaiSubLangkah(step: SubLangkah, input: JawabanLangkah | undefined): boolean {
  if (!input) return false
  if (step.tipe === 'pilihan_ganda' && input.tipe === 'pilihan_ganda') {
    return input.indeks === step.jawaban
  }
  if (step.tipe === 'isian_angka' && input.tipe === 'isian_angka') {
    const tol = step.toleransi ?? 0.02
    const sat = step.satuan ?? '—'
    const hasil = nilaiIsianNumerik(
      step.jawaban,
      tol,
      sat,
      step.signifikan,
      input.angka,
      sat === '—' ? sat : input.satuan,
    )
    return hasil.benar
  }
  return false
}

export function nilaiSoal(soal: Soal, jawaban: Jawaban): HasilPenilaian {
  const mode = modeInteraksiSoal(soal)
  if (mode !== jawaban.tipe) {
    return { benar: false, skor: 0, pesan: 'Jenis jawaban tidak cocok.' }
  }

  if (mode === 'pilihan-ganda' && jawaban.tipe === 'pilihan-ganda') {
    const target = 'jawaban' in soal && typeof soal.jawaban === 'number' ? soal.jawaban : -1
    const benar = jawaban.indeks === target
    return { benar, skor: benar ? 1 : 0, pesan: benar ? undefined : 'Pilihan belum tepat.' }
  }

  if (mode === 'pilihan-jamak' && jawaban.tipe === 'pilihan-jamak') {
    const target: number[] =
      'jawaban' in soal && Array.isArray(soal.jawaban)
        ? (soal.jawaban as unknown[]).filter((x): x is number => typeof x === 'number')
        : []
    const benar = samaHimpunan(jawaban.indeks, target)
    return {
      benar,
      skor: benar ? 1 : 0,
      pesan: benar ? undefined : 'Pilihan jamak harus tepat seluruhnya — tidak ada nilai parsial.',
    }
  }

  if (mode === 'isian' && jawaban.tipe === 'isian') {
    const target = 'jawaban' in soal && typeof soal.jawaban === 'number' ? soal.jawaban : NaN
    const tol =
      'toleransiRel' in soal
        ? soal.toleransiRel
        : 'toleransi' in soal && typeof soal.toleransi === 'number'
          ? soal.toleransi
          : 0.02
    const satuan = 'satuan' in soal ? soal.satuan : '—'
    const sig = 'signifikan' in soal ? soal.signifikan : undefined
    return nilaiIsianNumerik(target, tol, satuan, sig, jawaban.angka, jawaban.satuan)
  }

  if (mode === 'esai' && jawaban.tipe === 'esai' && 'rubrik' in soal) {
    const total = soal.rubrik.reduce((s, r) => s + r.bobot, 0)
    const tercapai = soal.rubrik.reduce((s, r, i) => s + (jawaban.rubrik[i] ? r.bobot : 0), 0)
    const skor = total > 0 ? tercapai / total : 0
    const benar = skor >= 0.7
    return {
      benar,
      skor,
      pesan: benar
        ? 'Poin penalaran utamamu sudah tercakup.'
        : 'Beberapa poin kunci belum tercakup — bandingkan dengan rubrik di bawah.',
    }
  }

  if (soal.tipe === 'ranking_urutan' && jawaban.tipe === 'ranking_urutan') {
    const target = soal.jawaban
    const n = target.length
    const cocok = target.filter((idx, pos) => jawaban.urutan[pos] === idx).length
    const benar = cocok === n
    const skor = n > 0 ? cocok / n : 0
    return {
      benar,
      skor,
      pesan: benar
        ? 'Urutan tepat seluruhnya.'
        : `${cocok} dari ${n} posisi sudah sesuai — periksa kembali hubungan fisis antar besaran.`,
    }
  }

  if (soal.tipe === 'multi_langkah' && jawaban.tipe === 'multi_langkah') {
    const detailLangkah = soal.langkah.map((step, i) => nilaiSubLangkah(step, jawaban.langkah[i]))
    const jumlahBenar = detailLangkah.filter(Boolean).length
    const total = soal.langkah.length
    const benar = jumlahBenar === total
    const skor = total > 0 ? jumlahBenar / total : 0
    return {
      benar,
      skor,
      detailLangkah,
      pesan: benar
        ? 'Seluruh rangkaian langkah penalaran tepat.'
        : `${jumlahBenar} dari ${total} langkah sudah tepat — perhatikan rantai keluaran tiap tahap.`,
    }
  }

  return { benar: false, skor: 0, pesan: 'Jawaban tidak dikenali.' }
}

export function kunciJawaban(soal: Soal): string {
  const mode = modeInteraksiSoal(soal)
  if (mode === 'pilihan-ganda' && 'jawaban' in soal && typeof soal.jawaban === 'number') {
    return HURUF[soal.jawaban] ?? '-'
  }
  if (mode === 'pilihan-jamak' && 'jawaban' in soal && Array.isArray(soal.jawaban)) {
    return soal.jawaban.map((i: number | string) => HURUF[Number(i)] ?? '-').join(', ')
  }
  if (mode === 'isian' && 'jawaban' in soal && typeof soal.jawaban === 'number') {
    const nilai = formatAngkaId(soal.jawaban)
    const satuan = 'satuan' in soal ? soal.satuan : '—'
    return satuan === '—' ? nilai : `${nilai} ${satuan}`
  }
  if (soal.tipe === 'ranking_urutan') {
    return soal.jawaban.map((idx, pos) => `${pos + 1}. ${soal.opsi[idx]}`).join(' → ')
  }
  if (soal.tipe === 'multi_langkah') {
    return soal.langkah
      .map((l, i) => {
        if (l.tipe === 'pilihan_ganda') {
          return `Langkah ${i + 1}: ${HURUF[l.jawaban] ?? '-'}`
        }
        const nilai = formatAngkaId(l.jawaban)
        const sat = l.satuan && l.satuan !== '—' ? ` ${l.satuan}` : ''
        return `Langkah ${i + 1}: ${nilai}${sat}`
      })
      .join(' · ')
  }
  return 'Dinilai dengan rubrik'
}

export { parseAngka, normalisasiSatuan }
