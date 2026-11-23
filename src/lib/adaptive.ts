import type { LearningState, Rekomendasi } from '@/types'
import { KATALOG, TOPIK, babById, type Bab } from '../../content/index'
import { akurasiKeseluruhan, babDikuasai, statistikTopik, statusBab } from './chapter-status'

const MIN_PERCOBAAN_LEMAH = 4
const AMBANG_LEMAH = 0.6

function leluhurBelumSelesai(
  bab: Bab,
  dikuasai: Set<string>,
  dikunjungi: Set<string>,
  hanyaTersedia: boolean,
): Bab | null {
  for (const idPrasyarat of bab.prasyarat) {
    if (dikunjungi.has(idPrasyarat)) continue
    dikunjungi.add(idPrasyarat)
    const prasyarat = babById.get(idPrasyarat)
    if (!prasyarat) continue
    if (!dikuasai.has(prasyarat.id) && (!hanyaTersedia || prasyarat.tersedia)) return prasyarat
    const lebihDalam = leluhurBelumSelesai(prasyarat, dikuasai, dikunjungi, hanyaTersedia)
    if (lebihDalam) return lebihDalam
  }
  return null
}

export function rekomendasiBerikut(state: LearningState): Rekomendasi {
  const dikuasai = babDikuasai(state)
  const stat = statistikTopik(state)
  const lemah = stat
    .filter((s) => s.total >= MIN_PERCOBAAN_LEMAH && s.akurasi < AMBANG_LEMAH)
    .sort((a, b) => a.akurasi - b.akurasi)

  for (const s of lemah) {
    const pemilik = KATALOG.filter((b) => b.tersedia && b.topik.includes(s.topik)).sort(
      (a, b) => a.topik.indexOf(s.topik) - b.topik.indexOf(s.topik),
    )[0]
    if (!pemilik) continue
    const leluhur = leluhurBelumSelesai(pemilik, dikuasai, new Set(), true)
    const target = !dikuasai.has(pemilik.id) && pemilik.tersedia ? pemilik : leluhur ?? pemilik
    return {
      jenis: 'bab',
      babId: target.id,
      judul: target.judul,
      alasan: `Akurasi ${TOPIK[s.topik] ?? s.topik} baru ${Math.round(s.akurasi * 100)}% — kuatkan ${target.judul} dulu.`,
    }
  }

  const berikut = KATALOG.filter((b) => b.tersedia).find(
    (b) =>
      !dikuasai.has(b.id) &&
      b.prasyarat.every((p) => dikuasai.has(p)),
  )
  if (berikut) {
    const segar = !state.bab[berikut.id] && !state.attempts.some((a) => a.babId === berikut.id)
    return {
      jenis: 'bab',
      babId: berikut.id,
      judul: berikut.judul,
      alasan: segar
        ? 'Semua prasyaratnya siap — ini langkah berikutnya di peta belajarmu.'
        : 'Bab ini belum tuntas. Selesaikan materinya lalu uji pemahaman.',
    }
  }

  const terlemah = stat.filter((s) => s.total >= 2).sort((a, b) => a.akurasi - b.akurasi)[0]
  if (terlemah) {
    return {
      jenis: 'latihan',
      topik: terlemah.topik,
      judul: `Latihan santai: ${TOPIK[terlemah.topik] ?? terlemah.topik}`,
      alasan: `${terlemah.salah} dari ${terlemah.total} soal topik ini masih meleset.`,
    }
  }

  return {
    jenis: 'latihan',
    judul: 'Mulai dari Fondasi',
    alasan: 'Belum ada data latihan. Kerjakan satu bab fondasi untuk memetakan kekuatanmu.',
  }
}

export function ringkasanProgres(state: LearningState) {
  const dikuasai = babDikuasai(state)
  return {
    dikuasai: dikuasai.size,
    total: KATALOG.length,
    akurasi: akurasiKeseluruhan(state),
    percobaan: state.attempts.length,
    statusF1: KATALOG[0] ? statusBab(KATALOG[0], state) : 'belum',
  }
}
