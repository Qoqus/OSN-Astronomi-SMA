export type Tier = 'fondasi' | 'inti' | 'lanjutan'
export type Level = 'fondasi' | 'menengah' | 'penalaran' | 'olimpiade'
export type Difficulty = 'mudah' | 'sedang' | 'sulit'
export type TipeSoalLama = 'pilihan-ganda' | 'pilihan-jamak' | 'isian' | 'esai'
export type TipeSoalBaru =
  | 'pilihan_ganda'
  | 'pilihan_jamak'
  | 'isian_angka'
  | 'esai_penalaran'
  | 'interpretasi_grafik'
  | 'interpretasi_tabel'
  | 'temukan_kesalahan'
  | 'cek_dimensi'
  | 'ranking_urutan'
  | 'multi_langkah'
  | 'data_tidak_lengkap'
export type TipeSoal = TipeSoalLama | TipeSoalBaru
export type Modul = 'kuis-bab' | 'santai' | 'simulasi' | 'ulangan' | 'campuran'
export type StatusBab = 'belum' | 'sedang' | 'dikuasai'

export interface Profil {
  id: string
  normalizedName: string
  displayName: string
}

export interface ProgressBab {
  dibukaPada: number
  refleksi: Record<string, string>
  checkpoint: Record<string, boolean>
  subBabSelesai: string[]
  masteryChecklist?: Record<string, boolean>
}

export interface Attempt {
  id: string
  sesiId: string
  soalId: string
  topik: string
  level: Level
  tipe: TipeSoal
  modul: Modul
  babId?: string
  saat: number
  benar: boolean
  skor: number
  durasiMs?: number
}

export interface Harian {
  soal: number
  xp: number
}

export interface Gamifikasi {
  xp: number
  level: number
  streakCount: number
  bestStreak: number
  lastActiveDay: string
  dailyGoal: number
  goalClaimedDay: string
  harian: Record<string, Harian>
}

export interface SrsKartu {
  intervalHari: number
  ease: number
  repetisi: number
  jatuhTempo: number
  terakhirUlas: number
  totalUlas: number
  totalIngat: number
}

export interface KartuMemori {
  id: string
  kategori: string
  depan: string
  belakang: string
  petunjuk?: string
  babId?: string
  kustom?: boolean
  dibuatPada?: number
}

export interface DrillStats {
  konstantaTerbaik: number
  urutanTerbaik: number
  totalSesiMemori: number
}

export interface LearningState {
  bab: Record<string, ProgressBab>
  attempts: Attempt[]
  achievements: Record<string, number>
  gamifikasi: Gamifikasi
  srs?: Record<string, SrsKartu>
  kartuKustom?: KartuMemori[]
  bookmarkSoal?: string[]
  drillStats?: DrillStats
}

export interface EvaluasiRubrikItem {
  indeks: number
  status: 'penuh' | 'sebagian' | 'belum'
  faktor: number
  alasan: string
}

export interface EvaluasiEsaiAI {
  skor: number
  benar: boolean
  ringkasan: string
  kekuatan: string[]
  perbaikan: string[]
  konsepTerlewat: string[]
  rubrikHasil: EvaluasiRubrikItem[]
}

export interface HasilPenilaian {
  benar: boolean
  skor: number
  pesan?: string
  evaluasiAi?: EvaluasiEsaiAI
  detailLangkah?: boolean[]
}

export type JawabanLangkah =
  | { tipe: 'pilihan_ganda'; indeks: number }
  | { tipe: 'isian_angka'; angka: string; satuan: string }

export type Jawaban =
  | { tipe: 'pilihan-ganda'; indeks: number }
  | { tipe: 'pilihan-jamak'; indeks: number[] }
  | { tipe: 'isian'; angka: string; satuan: string }
  | { tipe: 'esai'; rubrik: boolean[]; teks?: string; evaluasiAi?: EvaluasiEsaiAI }
  | { tipe: 'ranking_urutan'; urutan: number[] }
  | { tipe: 'multi_langkah'; langkah: JawabanLangkah[] }

export interface SesiKuis {
  id: string
  mode: Modul
  judul: string
  babId?: string
  soalIds: string[]
  mulai: number
  batasMs?: number
  indeks: number
  jawaban: Record<string, Jawaban>
  hasil: Record<string, HasilPenilaian>
  selesai: boolean
}

export interface Rekomendasi {
  jenis: 'bab' | 'latihan'
  babId?: string
  topik?: string
  judul: string
  alasan: string
}

export interface StatistikTopik {
  topik: string
  benar: number
  salah: number
  total: number
  akurasi: number
  skorRataRata: number
  soalUnik: number
  sesi: number
  level: Level[]
}
