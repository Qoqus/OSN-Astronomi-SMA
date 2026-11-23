import type { LearningState } from '@/types'
import { KATALOG } from '../../content/index'
import { akurasiKeseluruhan, babDikuasai, statistikTopik } from './chapter-status'
import { hariGoalTercapai } from './gamification'

export interface DefinisiCapaian {
  id: string
  nama: string
  deskripsi: string
  cek: (state: LearningState) => boolean
}

function akurasiTopik(state: LearningState, topik: string) {
  const s = statistikTopik(state).find((t) => t.topik === topik)
  return s ?? { topik, benar: 0, salah: 0, total: 0, akurasi: 0 }
}

function semuaDikuasai(state: LearningState, tier: 'fondasi' | 'inti' | 'lanjutan') {
  const target = KATALOG.filter((b) => b.tier === tier && b.tersedia)
  return target.length > 0 && target.every((b) => babDikuasai(state).has(b.id))
}

function streakIsianBenar(state: LearningState): number {
  const isian = [...state.attempts]
    .sort((a, b) => a.saat - b.saat)
    .filter((a) => a.tipe === 'isian' || a.tipe === 'isian_angka')
  let streak = 0
  for (const a of isian) {
    if (a.skor >= 1) streak += 1
    else streak = 0
  }
  return streak
}

function sesiSimulasiKuat(state: LearningState): number {
  const perSesi = new Map<string, { benar: number; total: number }>()
  for (const a of state.attempts.filter((x) => x.modul === 'simulasi')) {
    const s = perSesi.get(a.sesiId) ?? { benar: 0, total: 0 }
    s.total += 1
    if (a.benar) s.benar += 1
    perSesi.set(a.sesiId, s)
  }
  return [...perSesi.values()].filter((s) => s.total >= 5 && s.benar / s.total >= 0.7).length
}

export const DAFTAR_CAPAIAN: DefinisiCapaian[] = [
  {
    id: 'fondasi-selesai',
    nama: 'Fondasi Fisika Selesai',
    deskripsi: 'Semua bab fondasi yang tersedia sudah dikuasai.',
    cek: (s) => semuaDikuasai(s, 'fondasi'),
  },
  {
    id: 'bahasa-angka',
    nama: 'Bahasa Angka',
    deskripsi: 'Akurasi minimal 75% pada topik matematika dengan sedikitnya 12 soal.',
    cek: (s) => {
      const t = akurasiTopik(s, 'matematika')
      return t.total >= 12 && t.akurasi >= 0.75
    },
  },
  {
    id: 'geometri-langit',
    nama: 'Geometri Langit',
    deskripsi: 'Bab astronomi bola dikuasai dan 5 soal koordinat dijawab benar.',
    cek: (s) => {
      const a2 = KATALOG.find((b) => b.id === 'a2')
      const bola = statistikTopik(s).find((t) => t.topik === 'astronomi-bola')
      return Boolean(a2 && babDikuasai(s).has('a2') && bola && bola.benar >= 5)
    },
  },
  {
    id: 'penalaran-mekanika',
    nama: 'Penalaran Mekanika Langit',
    deskripsi: 'Lima soal level penalaran pada topik mekanika langit dijawab benar.',
    cek: (s) =>
      s.attempts.filter((a) => a.topik === 'mekanika-langit' && a.level === 'penalaran' && a.benar)
        .length >= 5,
  },
  {
    id: 'angka-penting',
    nama: 'Teliti Angka Penting',
    deskripsi: 'Sepuluh soal isian berturut-turut benar, termasuk satuan dan presisi.',
    cek: (s) => streakIsianBenar(s) >= 10,
  },
  {
    id: 'analisis-data',
    nama: 'Analisis Data',
    deskripsi: 'Akurasi minimal 70% pada topik analisis data dengan sedikitnya 12 soal.',
    cek: (s) => {
      const t = akurasiTopik(s, 'analisis-data')
      return t.total >= 12 && t.akurasi >= 0.7
    },
  },
  {
    id: 'uji-ketahanan',
    nama: 'Uji Ketahanan',
    deskripsi: 'Tiga sesi simulasi dengan skor minimal 70%.',
    cek: (s) => sesiSimulasiKuat(s) >= 3,
  },
  {
    id: 'siap-osk',
    nama: 'Siap OSK',
    deskripsi: 'Semua bab fondasi dan inti dikuasai dengan akurasi keseluruhan minimal 70%.',
    cek: (s) => {
      const akurasi = akurasiKeseluruhan(s)
      return (
        semuaDikuasai(s, 'fondasi') &&
        semuaDikuasai(s, 'inti') &&
        akurasi !== null &&
        akurasi >= 0.7
      )
    },
  },
  {
    id: 'streak-3',
    nama: 'Tiga Hari Beruntun',
    deskripsi: 'Belajar tiga hari berturut-turut.',
    cek: (s) => s.gamifikasi.bestStreak >= 3,
  },
  {
    id: 'streak-7',
    nama: 'Seminggu Penuh',
    deskripsi: 'Streak terbaik mencapai tujuh hari.',
    cek: (s) => s.gamifikasi.bestStreak >= 7,
  },
  {
    id: 'streak-30',
    nama: 'Sebulan Menyala',
    deskripsi: 'Streak terbaik mencapai tiga puluh hari.',
    cek: (s) => s.gamifikasi.bestStreak >= 30,
  },
  {
    id: 'level-5',
    nama: 'Penjelajah Muda',
    deskripsi: 'Mencapai level 5.',
    cek: (s) => s.gamifikasi.level >= 5,
  },
  {
    id: 'level-10',
    nama: 'Navigator Langit',
    deskripsi: 'Mencapai level 10.',
    cek: (s) => s.gamifikasi.level >= 10,
  },
  {
    id: 'goal-7',
    nama: 'Tujuh Target Harian',
    deskripsi: 'Menyelesaikan target harian pada tujuh hari berbeda.',
    cek: (s) => hariGoalTercapai(s.gamifikasi) >= 7,
  },
  {
    id: 'olimpiade-10',
    nama: 'Penakluk Olimpiade',
    deskripsi: 'Sepuluh soal level olimpiade dijawab benar.',
    cek: (s) => s.attempts.filter((a) => a.level === 'olimpiade' && a.benar).length >= 10,
  },
]

export interface CapaianDenganStatus extends DefinisiCapaian {
  terbuka: boolean
  dibukaPada?: number
}

export function daftarCapaian(state: LearningState): CapaianDenganStatus[] {
  return DAFTAR_CAPAIAN.map((c) => ({
    ...c,
    terbuka: c.cek(state),
    dibukaPada: state.achievements[c.id],
  }))
}

export function capainBaru(state: LearningState): DefinisiCapaian[] {
  return DAFTAR_CAPAIAN.filter((c) => c.cek(state) && !state.achievements[c.id])
}
