// @vitest-environment jsdom
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, waitFor, cleanup, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Bab } from '@/routes/bab'
import { Peta } from '@/routes/peta'
import { Memori } from '@/routes/memori'
import { Kuis } from '@/routes/kuis'
import { useStore } from '@/state/user-store'
import { sesiKuisBab } from '@/lib/quiz-builder'
import { soalUntukBab } from '@/lib/soal'
import { KATALOG } from '../../../content/index'

// Mock IntersectionObserver, matchMedia & scrollIntoView for jsdom
class MockIntersectionObserver {
  observe() {}
  disconnect() {}
  unobserve() {}
}

describe('Bab render & MDX integration', () => {
  const originalConsoleError = console.error
  let errorCalls: unknown[][] = []
  let scrollSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    errorCalls = []
    console.error = (...args: unknown[]) => {
      errorCalls.push(args)
    }
    globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
    scrollSpy = vi.fn()
    Element.prototype.scrollIntoView = scrollSpy as unknown as typeof Element.prototype.scrollIntoView
    HTMLElement.prototype.scrollIntoView = scrollSpy as unknown as typeof HTMLElement.prototype.scrollIntoView
  })

  afterEach(() => {
    cleanup()
    console.error = originalConsoleError
  })

  it.each(KATALOG)(
    'merender bab $id ($kode) tanpa error React dan tombol gerbang berfungsi',
    async (bab) => {
      const { container, getAllByRole } = render(
        <MemoryRouter initialEntries={[`/bab/${bab.id}`]}>
          <Routes>
            <Route path="/bab/:babId" element={<Bab />} />
          </Routes>
        </MemoryRouter>,
      )

      await waitFor(
        () => {
          expect(container.textContent).toContain(bab.judul)
          expect(container.textContent).toContain('Checklist penguasaan modul')
        },
        { timeout: 10000 },
      )

      const buttons = getAllByRole('button')
      const btnDerivasi = buttons.find((b) => b.textContent?.includes('Buka & Pelajari Derivasi'))
      const btnLogika = buttons.find((b) => b.textContent?.includes('Buka Ujian Logika & Nalar'))
      const btnObservasi = buttons.find((b) => b.textContent?.includes('Buka Observasi & Pemahaman'))

      expect(btnDerivasi).toBeDefined()
      expect(btnLogika).toBeDefined()
      expect(btnObservasi).toBeDefined()
      expect(document.getElementById('checklist-mastery')).not.toBeNull()
      expect(document.getElementById('ujian-logika-section')).not.toBeNull()

      fireEvent.click(btnDerivasi!)
      fireEvent.click(btnLogika!)
      fireEvent.click(btnObservasi!)
      expect(scrollSpy).toHaveBeenCalledTimes(3)

      expect(errorCalls).toEqual([])
    },
    15000,
  )

  it('merender halaman Peta, Memori, dan Kuis tanpa error React (getSnapshot)', () => {
    const rPeta = render(
      <MemoryRouter initialEntries={['/peta']}>
        <Peta />
      </MemoryRouter>,
    )
    expect(rPeta.container.textContent).toContain('Peta')
    cleanup()

    const rMemori = render(
      <MemoryRouter initialEntries={['/memori']}>
        <Memori />
      </MemoryRouter>,
    )
    expect(rMemori.container.textContent).toContain('Pusat Memori')
    cleanup()

    const babF1 = KATALOG[0]
    const sesi = sesiKuisBab('Tes Kuis', babF1.id, soalUntukBab(babF1))
    expect(sesi).not.toBeNull()
    useStore.getState().mulaiSesi(sesi!)

    const rKuis = render(
      <MemoryRouter initialEntries={['/kuis']}>
        <Kuis />
      </MemoryRouter>,
    )
    expect(rKuis.container.textContent).toContain('Tes Kuis')
    useStore.getState().tutupSesi()

    expect(errorCalls).toEqual([])
  })
})
