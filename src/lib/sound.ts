import { useSyncExternalStore } from 'react'

export type JenisSuara =
  | 'klik'
  | 'pilih'
  | 'flip'
  | 'benar'
  | 'sebagian'
  | 'salah'
  | 'rayakan'

const KUNCI_STORAGE = 'ruanglangit:suara'
const SELECTOR_INTERAKTIF =
  'button, a[href], [role="button"], summary, input[type="checkbox"], input[type="radio"], select, [data-suara]'

let konteksAudio: AudioContext | null = null
let terakhirKlikMs = 0
const pendengarState = new Set<() => void>()

function bacaPreferensi(): boolean {
  if (typeof window === 'undefined') return true
  try {
    return window.localStorage.getItem(KUNCI_STORAGE) !== '0'
  } catch {
    return true
  }
}

let aktifSekarang = bacaPreferensi()

export function suaraAktif(): boolean {
  return aktifSekarang
}

export function aturSuaraAktif(aktif: boolean): void {
  aktifSekarang = aktif
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(KUNCI_STORAGE, aktif ? '1' : '0')
    } catch {
      // Abaikan jika storage diblokir
    }
  }
  for (const fn of pendengarState) fn()
  if (aktif) mainkanSuara('pilih')
}

export function toggleSuaraAktif(): boolean {
  const berikutnya = !aktifSekarang
  aturSuaraAktif(berikutnya)
  return berikutnya
}

function langgananSuara(cb: () => void): () => void {
  pendengarState.add(cb)
  return () => {
    pendengarState.delete(cb)
  }
}

export function useSuaraAktif(): [boolean, () => void] {
  const aktif = useSyncExternalStore(langgananSuara, suaraAktif, () => true)
  return [aktif, () => toggleSuaraAktif()]
}

function ambilKonteks(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  if (!konteksAudio) {
    try {
      konteksAudio = new Ctor()
    } catch {
      return null
    }
  }
  if (konteksAudio.state === 'suspended') {
    void konteksAudio.resume().catch(() => {})
  }
  return konteksAudio
}

interface OpsiNada {
  frekAwal: number
  frekAkhir?: number
  mulaiDetik: number
  durasiDetik: number
  volume: number
  gelombang?: OscillatorType
  filterHz?: number
}

function bunyikanNada(ctx: AudioContext, opsi: OpsiNada) {
  const {
    frekAwal,
    frekAkhir = frekAwal,
    mulaiDetik,
    durasiDetik,
    volume,
    gelombang = 'sine',
    filterHz,
  } = opsi

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = gelombang
  osc.frequency.setValueAtTime(frekAwal, mulaiDetik)
  if (frekAkhir !== frekAwal) {
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(20, frekAkhir),
      mulaiDetik + durasiDetik,
    )
  }

  gain.gain.setValueAtTime(0.0001, mulaiDetik)
  gain.gain.linearRampToValueAtTime(volume, mulaiDetik + 0.005)
  gain.gain.exponentialRampToValueAtTime(0.0001, mulaiDetik + durasiDetik)

  if (filterHz) {
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(filterHz, mulaiDetik)
    osc.connect(filter)
    filter.connect(gain)
  } else {
    osc.connect(gain)
  }

  gain.connect(ctx.destination)
  osc.start(mulaiDetik)
  osc.stop(mulaiDetik + durasiDetik + 0.01)
}

export function mainkanSuara(jenis: JenisSuara): void {
  if (!aktifSekarang) return

  if (jenis === 'klik') {
    const sekarangMs = Date.now()
    if (sekarangMs - terakhirKlikMs < 28) return
    terakhirKlikMs = sekarangMs
  }

  try {
    const ctx = ambilKonteks()
    if (!ctx) return
    const t = ctx.currentTime + 0.004

    if (jenis === 'klik') {
      // Ketukan taktil halus seperti tombol mekanik/kaca empuk
      bunyikanNada(ctx, {
        frekAwal: 580,
        frekAkhir: 290,
        mulaiDetik: t,
        durasiDetik: 0.038,
        volume: 0.06,
        gelombang: 'sine',
      })
      bunyikanNada(ctx, {
        frekAwal: 1350,
        frekAkhir: 650,
        mulaiDetik: t,
        durasiDetik: 0.015,
        volume: 0.024,
        gelombang: 'triangle',
      })
      return
    }

    if (jenis === 'pilih') {
      // Pop pemilihan opsi / tanda / checklist
      bunyikanNada(ctx, {
        frekAwal: 440,
        frekAkhir: 660,
        mulaiDetik: t,
        durasiDetik: 0.065,
        volume: 0.075,
        gelombang: 'sine',
      })
      return
    }

    if (jenis === 'flip') {
      // Shimmer lembut saat membalik kartu memori
      bunyikanNada(ctx, {
        frekAwal: 392,
        frekAkhir: 587.33,
        mulaiDetik: t,
        durasiDetik: 0.09,
        volume: 0.065,
        gelombang: 'sine',
      })
      bunyikanNada(ctx, {
        frekAwal: 783.99,
        mulaiDetik: t + 0.02,
        durasiDetik: 0.08,
        volume: 0.03,
        gelombang: 'sine',
      })
      return
    }

    if (jenis === 'benar') {
      // Akor naik hangat & cerah (C5 - E5 - G5 - C6)
      const nada = [523.25, 659.25, 783.99, 1046.5]
      nada.forEach((f, i) => {
        const offset = i * 0.056
        bunyikanNada(ctx, {
          frekAwal: f,
          mulaiDetik: t + offset,
          durasiDetik: i === nada.length - 1 ? 0.34 : 0.2,
          volume: i === nada.length - 1 ? 0.1 : 0.085,
          gelombang: 'sine',
          filterHz: 3200,
        })
        if (i === 0 || i === nada.length - 1) {
          bunyikanNada(ctx, {
            frekAwal: f,
            mulaiDetik: t + offset,
            durasiDetik: 0.18,
            volume: 0.03,
            gelombang: 'triangle',
            filterHz: 2200,
          })
        }
      })
      return
    }

    if (jenis === 'sebagian') {
      // Dua nada hangat netral-positif (E5 - G5)
      bunyikanNada(ctx, {
        frekAwal: 659.25,
        mulaiDetik: t,
        durasiDetik: 0.14,
        volume: 0.08,
        gelombang: 'sine',
      })
      bunyikanNada(ctx, {
        frekAwal: 783.99,
        mulaiDetik: t + 0.085,
        durasiDetik: 0.22,
        volume: 0.085,
        gelombang: 'sine',
      })
      return
    }

    if (jenis === 'salah') {
      // Dua nada turun lembut teredam (tidak menusuk telinga)
      bunyikanNada(ctx, {
        frekAwal: 277.18,
        frekAkhir: 246.94,
        mulaiDetik: t,
        durasiDetik: 0.14,
        volume: 0.095,
        gelombang: 'triangle',
        filterHz: 680,
      })
      bunyikanNada(ctx, {
        frekAwal: 207.65,
        frekAkhir: 174.61,
        mulaiDetik: t + 0.095,
        durasiDetik: 0.22,
        volume: 0.1,
        gelombang: 'triangle',
        filterHz: 620,
      })
      return
    }

    if (jenis === 'rayakan') {
      // Arpeggio kosmik saat sesi selesai bagus / naik level / capaian terbuka
      const nada = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.51]
      nada.forEach((f, i) => {
        const offset = i * 0.068
        bunyikanNada(ctx, {
          frekAwal: f,
          mulaiDetik: t + offset,
          durasiDetik: i >= nada.length - 2 ? 0.45 : 0.22,
          volume: 0.085,
          gelombang: 'sine',
        })
        bunyikanNada(ctx, {
          frekAwal: f * 0.5,
          mulaiDetik: t + offset,
          durasiDetik: 0.26,
          volume: 0.025,
          gelombang: 'triangle',
          filterHz: 1800,
        })
      })
    }
  } catch {
    // Abaikan error AudioContext di lingkungan non-browser
  }
}

function cariTargetInteraktif(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof Element)) return null
  const el = target.closest(SELECTOR_INTERAKTIF)
  if (!(el instanceof HTMLElement)) return null
  if (el.getAttribute('data-suara') === 'none') return null
  if (
    (el instanceof HTMLButtonElement ||
      el instanceof HTMLInputElement ||
      el instanceof HTMLSelectElement) &&
    el.disabled
  ) {
    return null
  }
  if (el.getAttribute('aria-disabled') === 'true') return null
  return el
}

export function pasangPendengarSuaraGlobal(): () => void {
  if (typeof document === 'undefined') return () => {}

  const saatPointer = (e: PointerEvent) => {
    const el = cariTargetInteraktif(e.target)
    if (el) mainkanSuara('klik')
  }

  const saatKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Enter' && e.key !== ' ') return
    const el = cariTargetInteraktif(e.target)
    if (el) mainkanSuara('klik')
  }

  document.addEventListener('pointerdown', saatPointer, { capture: true, passive: true })
  document.addEventListener('keydown', saatKeyDown, { capture: true, passive: true })

  return () => {
    document.removeEventListener('pointerdown', saatPointer, { capture: true })
    document.removeEventListener('keydown', saatKeyDown, { capture: true })
  }
}
