import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Attempt } from '@/types'
import { antrekan, bacaAntrean, hapusDariAntrean, jumlahAntrean } from '../outbox'

function attempt(id: string, benar = false): Attempt {
  return {
    id,
    sesiId: 'sesi-uji',
    soalId: 'f1-01',
    topik: 'matematika',
    level: 'fondasi',
    tipe: 'pilihan-ganda',
    modul: 'santai',
    saat: 1,
    benar,
    skor: benar ? 1 : 0,
  }
}

let isi: Map<string, string>
let storage: Storage

beforeEach(() => {
  isi = new Map()
  storage = {
    getItem: (k: string) => isi.get(k) ?? null,
    setItem: (k: string, v: string) => {
      isi.set(k, String(v))
    },
    removeItem: (k: string) => {
      isi.delete(k)
    },
    clear: () => isi.clear(),
    key: (i: number) => [...isi.keys()][i] ?? null,
    get length() {
      return isi.size
    },
  } as Storage
  vi.stubGlobal('window', { localStorage: storage })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('outbox', () => {
  it('menyimpan dan membaca operasi', () => {
    antrekan({ kunci: 'attempt:a', jenis: 'attempt', profilId: 'p1', attempt: attempt('a') })
    const daftar = bacaAntrean()
    expect(daftar).toHaveLength(1)
    expect(daftar[0].jenis).toBe('attempt')
    expect(jumlahAntrean()).toBe(1)
  })

  it('mendedupe berdasarkan kunci dengan versi terbaru', () => {
    antrekan({ kunci: 'attempt:a', jenis: 'attempt', profilId: 'p1', attempt: attempt('a') })
    antrekan({ kunci: 'attempt:a', jenis: 'attempt', profilId: 'p1', attempt: attempt('a', true) })
    const daftar = bacaAntrean()
    expect(daftar).toHaveLength(1)
    const op = daftar[0]
    expect(op.jenis === 'attempt' && op.attempt.benar).toBe(true)
  })

  it('menghapus operasi berdasarkan kunci', () => {
    antrekan({ kunci: 'attempt:a', jenis: 'attempt', profilId: 'p1', attempt: attempt('a') })
    antrekan({
      kunci: 'capaian:p1:bahasa-angka',
      jenis: 'capaian',
      profilId: 'p1',
      capaianId: 'bahasa-angka',
    })
    hapusDariAntrean('attempt:a')
    expect(bacaAntrean().map((op) => op.kunci)).toEqual(['capaian:p1:bahasa-angka'])
  })

  it('membatasi antrean pada 200 operasi terbaru', () => {
    for (let i = 0; i < 205; i += 1) {
      antrekan({
        kunci: `attempt:${i}`,
        jenis: 'attempt',
        profilId: 'p1',
        attempt: attempt(`a${i}`),
      })
    }
    const daftar = bacaAntrean()
    expect(daftar).toHaveLength(200)
    expect(daftar[0].kunci).toBe('attempt:5')
    expect(daftar[199].kunci).toBe('attempt:204')
  })

  it('mengabaikan isi rusak di localStorage', () => {
    storage.setItem('ruanglangit.outbox', 'bukan json')
    expect(bacaAntrean()).toEqual([])
    storage.setItem('ruanglangit.outbox', '{"a":1}')
    expect(bacaAntrean()).toEqual([])
  })

  it('menggabungkan operasi gamifikasi per profil (coalesce)', () => {
    const g = {
      xp: 10,
      level: 1,
      streakCount: 1,
      bestStreak: 1,
      lastActiveDay: '2026-11-21',
      dailyGoal: 10,
      goalClaimedDay: '',
      harian: {},
    }
    antrekan({ kunci: 'gamifikasi:p1', jenis: 'gamifikasi', profilId: 'p1', gamifikasi: g })
    antrekan({
      kunci: 'gamifikasi:p1',
      jenis: 'gamifikasi',
      profilId: 'p1',
      gamifikasi: { ...g, xp: 99 },
    })
    const daftar = bacaAntrean()
    expect(daftar).toHaveLength(1)
    const op = daftar[0]
    expect(op.jenis === 'gamifikasi' && op.gamifikasi.xp).toBe(99)
  })
})
