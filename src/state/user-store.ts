import { create } from 'zustand'
import type {
  Attempt,
  HasilPenilaian,
  Jawaban,
  LearningState,
  Profil,
  SesiKuis,
} from '@/types'
import {
  STATE_KOSONG,
  bacaProfil,
  bacaSesi,
  bacaState,
  tulisProfil,
  tulisSesi,
  tulisState,
} from '@/lib/storage'
import { gabungState, kirimCapaian, kirimGamifikasi, kirimPercobaan, kirimProgress, masukProfil } from '@/lib/api'
import { capainBaru } from '@/lib/achievements'
import { BONUS_GOAL, hariIni, levelDariXp, perbaruiGamifikasi, type Perayaan } from '@/lib/gamification'
import { nilaiKartuSrs, type NilaiIngatan } from '@/lib/srs'
import type { KartuMemori } from '@/types'

const profilAwal = bacaProfil()
const stateAwal: LearningState = profilAwal ? bacaState(profilAwal.id) : { ...STATE_KOSONG }

interface AksiStore {
  profil: Profil | null
  state: LearningState
  sesi: SesiKuis | null
  perayaan: Perayaan[]
  masuk: (nama: string) => Promise<void>
  keluar: () => void
  bukaBab: (babId: string) => void
  toggleSubBabSelesai: (babId: string, subBabId: string) => void
  simpanRefleksi: (babId: string, blockId: string, teks: string) => void
  simpanCheckpoint: (babId: string, blockId: string, benar: boolean) => void
  toggleMasteryItem: (babId: string, itemId: string) => void
  catatPercobaan: (input: Omit<Attempt, 'id' | 'saat'> & { saat?: number }) => void
  mulaiSesi: (sesi: SesiKuis) => void
  simpanHasil: (soalId: string, jawaban: Jawaban, hasil: HasilPenilaian) => void
  majuSoal: () => void
  selesaikanSesi: () => void
  tutupSesi: () => void
  imporState: (tambahan: LearningState) => void
  tutupPerayaan: () => void
  aturTujuanHarian: (n: number) => void
  ulasKartuSrs: (kartuId: string, nilai: NilaiIngatan) => void
  tambahKartuKustom: (kartu: Omit<KartuMemori, 'id' | 'kustom' | 'dibuatPada'>) => KartuMemori
  hapusKartuKustom: (kartuId: string) => void
  toggleBookmarkSoal: (soalId: string) => void
  catatHasilDrill: (jenis: 'konstanta' | 'urutan', skorPersen: number, xpTambahan: number) => void
}

export const useStore = create<AksiStore>()((set, get) => {
  const simpan = () => {
    const { profil, state, sesi } = get()
    if (profil) tulisState(profil.id, state)
    tulisSesi(sesi)
  }

  const tambahXpLangsung = (state: LearningState, gain: number): { state: LearningState; events: Perayaan[] } => {
    if (gain <= 0) return { state, events: [] }
    const g = state.gamifikasi
    const hari = hariIni()
    const events: Perayaan[] = []
    const prevHarian = g.harian[hari] ?? { soal: 0, xp: 0 }
    let xp = g.xp + gain
    let goalClaimedDay = g.goalClaimedDay
    const harian = {
      ...g.harian,
      [hari]: { soal: prevHarian.soal, xp: prevHarian.xp + gain },
    }
    if (prevHarian.soal >= g.dailyGoal && goalClaimedDay !== hari) {
      goalClaimedDay = hari
      xp += BONUS_GOAL
      events.push({ jenis: 'goal', hari })
    }
    const level = levelDariXp(xp)
    if (level > g.level) events.push({ jenis: 'level', level })
    const gamifikasi = {
      ...g,
      xp,
      level,
      lastActiveDay: g.lastActiveDay || hari,
      streakCount: g.streakCount || 1,
      bestStreak: Math.max(g.bestStreak, g.streakCount || 1),
      goalClaimedDay,
      harian,
    }
    return { state: { ...state, gamifikasi }, events }
  }

  return {
    profil: profilAwal,
    state: stateAwal,
    sesi: bacaSesi(),
    perayaan: [],

    async masuk(nama) {
      const hasil = await masukProfil(nama)
      const state = gabungState(hasil.state, null)
      tulisProfil(hasil.profil)
      tulisState(hasil.profil.id, state)
      tulisSesi(null)
      set({ profil: hasil.profil, state, sesi: null })
    },

    keluar() {
      tulisProfil(null)
      tulisSesi(null)
      set({ profil: null, state: { ...STATE_KOSONG }, sesi: null, perayaan: [] })
    },

    bukaBab(babId) {
      const { profil, state } = get()
      const lama = state.bab[babId]
      const berikut = lama
        ? { ...lama, dibukaPada: Date.now() }
        : { dibukaPada: Date.now(), refleksi: {}, checkpoint: {}, subBabSelesai: [] }
      const baru: LearningState = { ...state, bab: { ...state.bab, [babId]: berikut } }
      set({ state: baru })
      simpan()
      if (profil) kirimProgress(profil, babId, berikut)
    },

    toggleSubBabSelesai(babId, subBabId) {
      const { profil, state } = get()
      const lama = state.bab[babId] ?? {
        dibukaPada: Date.now(),
        refleksi: {},
        checkpoint: {},
        subBabSelesai: [],
      }
      const sudah = lama.subBabSelesai.includes(subBabId)
      const subBabSelesai = sudah
        ? lama.subBabSelesai.filter((id) => id !== subBabId)
        : [...lama.subBabSelesai, subBabId]
      const berikut = { ...lama, subBabSelesai }
      const baru: LearningState = { ...state, bab: { ...state.bab, [babId]: berikut } }
      set({ state: baru })
      simpan()
      if (profil) kirimProgress(profil, babId, berikut)
    },

    simpanRefleksi(babId, blockId, teks) {
      const { profil, state } = get()
      const lama = state.bab[babId] ?? {
        dibukaPada: Date.now(),
        refleksi: {},
        checkpoint: {},
        subBabSelesai: [],
      }
      const berikut = { ...lama, refleksi: { ...lama.refleksi, [blockId]: teks } }
      const baru: LearningState = { ...state, bab: { ...state.bab, [babId]: berikut } }
      set({ state: baru })
      simpan()
      if (profil) kirimProgress(profil, babId, berikut)
    },

    simpanCheckpoint(babId, blockId, benar) {
      const { profil, state } = get()
      const lama = state.bab[babId] ?? {
        dibukaPada: Date.now(),
        refleksi: {},
        checkpoint: {},
        subBabSelesai: [],
      }
      const berikut = { ...lama, checkpoint: { ...lama.checkpoint, [blockId]: benar } }
      const baru: LearningState = { ...state, bab: { ...state.bab, [babId]: berikut } }
      set({ state: baru })
      simpan()
      if (profil) kirimProgress(profil, babId, berikut)
    },

    toggleMasteryItem(babId, itemId) {
      const { profil, state } = get()
      const lama = state.bab[babId] ?? {
        dibukaPada: Date.now(),
        refleksi: {},
        checkpoint: {},
        subBabSelesai: [],
        masteryChecklist: {},
      }
      const prevMap = lama.masteryChecklist ?? {}
      const masteryChecklist = { ...prevMap, [itemId]: !prevMap[itemId] }
      const berikut = { ...lama, masteryChecklist }
      const baru: LearningState = { ...state, bab: { ...state.bab, [babId]: berikut } }
      set({ state: baru })
      simpan()
      if (profil) kirimProgress(profil, babId, berikut)
    },

    catatPercobaan(input) {
      const { profil, state } = get()
      const attempt: Attempt = { ...input, id: crypto.randomUUID(), saat: input.saat ?? Date.now() }
      const { gamifikasi, events } = perbaruiGamifikasi(state.gamifikasi, attempt, new Date(attempt.saat))
      let baru: LearningState = {
        ...state,
        attempts: [...state.attempts, attempt].slice(-500),
        gamifikasi,
      }
      const perayaanBaru: Perayaan[] = [...events]
      const terbuka = capainBaru(baru)
      if (terbuka.length > 0) {
        const achievements = { ...baru.achievements }
        for (const c of terbuka) {
          achievements[c.id] = Date.now()
          perayaanBaru.push({ jenis: 'capaian', id: c.id, nama: c.nama })
        }
        baru = { ...baru, achievements }
        if (profil) for (const c of terbuka) kirimCapaian(profil, c.id)
      }
      set({ state: baru, perayaan: [...get().perayaan, ...perayaanBaru] })
      simpan()
      if (profil) {
        kirimPercobaan(profil, attempt)
        kirimGamifikasi(profil, gamifikasi)
      }
    },

    mulaiSesi(sesi) {
      set({ sesi })
      tulisSesi(sesi)
    },

    simpanHasil(soalId, jawaban, hasil) {
      const sesi = get().sesi
      if (!sesi) return
      const berikut: SesiKuis = {
        ...sesi,
        jawaban: { ...sesi.jawaban, [soalId]: jawaban },
        hasil: { ...sesi.hasil, [soalId]: hasil },
      }
      set({ sesi: berikut })
      tulisSesi(berikut)
    },

    majuSoal() {
      const sesi = get().sesi
      if (!sesi) return
      const indeks = sesi.indeks + 1
      const berikut: SesiKuis = {
        ...sesi,
        indeks,
        selesai: indeks >= sesi.soalIds.length,
      }
      set({ sesi: berikut })
      tulisSesi(berikut)
    },

    selesaikanSesi() {
      const sesi = get().sesi
      if (!sesi) return
      const berikut = { ...sesi, selesai: true }
      set({ sesi: berikut })
      tulisSesi(berikut)
    },

    tutupSesi() {
      set({ sesi: null })
      tulisSesi(null)
    },

    imporState(tambahan) {
      const { state } = get()
      const baru = gabungState(state, tambahan)
      set({ state: baru })
      simpan()
    },

    tutupPerayaan() {
      set((s) => ({ perayaan: s.perayaan.slice(1) }))
    },

    aturTujuanHarian(n) {
      const goal = Math.max(5, Math.min(20, Math.round(n / 5) * 5))
      const { profil, state } = get()
      const gamifikasi = { ...state.gamifikasi, dailyGoal: goal }
      const baru = { ...state, gamifikasi }
      set({ state: baru })
      simpan()
      if (profil) kirimGamifikasi(profil, gamifikasi)
    },

    ulasKartuSrs(kartuId, nilai) {
      const { profil, state } = get()
      const srsLama = state.srs ?? {}
      const hasilKartu = nilaiKartuSrs(srsLama[kartuId], nilai)
      const xpGain = nilai === 0 ? 1 : 3
      const { state: denganXp, events } = tambahXpLangsung(
        {
          ...state,
          srs: { ...srsLama, [kartuId]: hasilKartu },
        },
        xpGain,
      )
      set({
        state: denganXp,
        perayaan: events.length ? [...get().perayaan, ...events] : get().perayaan,
      })
      simpan()
      if (profil) kirimGamifikasi(profil, denganXp.gamifikasi)
    },

    tambahKartuKustom(input) {
      const { state } = get()
      const kartu: KartuMemori = {
        ...input,
        id: `kustom-${crypto.randomUUID()}`,
        kustom: true,
        dibuatPada: Date.now(),
      }
      const kartuKustom = [kartu, ...(state.kartuKustom ?? [])]
      set({ state: { ...state, kartuKustom } })
      simpan()
      return kartu
    },

    hapusKartuKustom(kartuId) {
      const { state } = get()
      const kartuKustom = (state.kartuKustom ?? []).filter((k) => k.id !== kartuId)
      const srs = { ...(state.srs ?? {}) }
      delete srs[kartuId]
      set({ state: { ...state, kartuKustom, srs } })
      simpan()
    },

    toggleBookmarkSoal(soalId) {
      const { state } = get()
      const lama = state.bookmarkSoal ?? []
      const ada = lama.includes(soalId)
      const bookmarkSoal = ada ? lama.filter((id) => id !== soalId) : [soalId, ...lama]
      set({ state: { ...state, bookmarkSoal } })
      simpan()
    },

    catatHasilDrill(jenis, skorPersen, xpTambahan) {
      const { profil, state } = get()
      const lama = state.drillStats ?? { konstantaTerbaik: 0, urutanTerbaik: 0, totalSesiMemori: 0 }
      const drillStats = {
        konstantaTerbaik:
          jenis === 'konstanta' ? Math.max(lama.konstantaTerbaik, skorPersen) : lama.konstantaTerbaik,
        urutanTerbaik:
          jenis === 'urutan' ? Math.max(lama.urutanTerbaik, skorPersen) : lama.urutanTerbaik,
        totalSesiMemori: lama.totalSesiMemori + 1,
      }
      const { state: denganXp, events } = tambahXpLangsung(
        { ...state, drillStats },
        xpTambahan,
      )
      set({
        state: denganXp,
        perayaan: events.length ? [...get().perayaan, ...events] : get().perayaan,
      })
      simpan()
      if (profil) kirimGamifikasi(profil, denganXp.gamifikasi)
    },
  }
})
