import { useEffect, type ReactNode } from 'react'
import {
  BrowserRouter,
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import { useStore } from '@/state/user-store'
import { kirimAntrean } from '@/lib/api'
import { pasangPendengarSuaraGlobal, useSuaraAktif } from '@/lib/sound'
import { BottomNav, NavAtas } from '@/components/ui/BottomNav'
import { Icon } from '@/components/ui/Icon'
import { LangitBintang } from '@/components/ui/LangitBintang'
import { LapisanPerayaan } from '@/components/gamification/LapisanPerayaan'
import { Masuk } from '@/routes/masuk'
import { Beranda } from '@/routes/beranda'
import { Peta } from '@/routes/peta'
import { Bab } from '@/routes/bab'
import { Kuis } from '@/routes/kuis'
import { Latihan } from '@/routes/latihan'
import { Progres } from '@/routes/progres'
import { Memori } from '@/routes/memori'
import { Referensi } from '@/routes/referensi'

function GulirKeAtas() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
  return null
}

function SinkronAntrean() {
  const profilId = useStore((s) => s.profil?.id)
  useEffect(() => {
    void kirimAntrean()
    const saatOnline = () => void kirimAntrean()
    window.addEventListener('online', saatOnline)
    return () => window.removeEventListener('online', saatOnline)
  }, [profilId])
  return null
}

function Dilindungi({ children }: { children: ReactNode }) {
  const profil = useStore((s) => s.profil)
  if (!profil) return <Navigate to="/masuk" replace />
  return <>{children}</>
}

function Kerangka() {
  const profil = useStore((s) => s.profil)
  const [suara, toggleSuara] = useSuaraAktif()
  const { pathname } = useLocation()
  const adalahHalamanBab = pathname.startsWith('/bab/')
  const inisial = profil?.displayName.trim().charAt(0).toUpperCase() ?? '?'
  const kelasLebar = adalahHalamanBab ? 'max-w-[1140px]' : 'max-w-[920px]'

  return (
    <div className="relative min-h-dvh">
      <div className="lapis-nebula" aria-hidden="true" />
      <LangitBintang />
      <div className="lapis-grain" aria-hidden="true" />

      <div className="relative z-10">
        <header className="sticky top-0 z-30 border-b border-line/70 bg-canvas/80 backdrop-blur-md">
          <div className={`mx-auto flex ${kelasLebar} items-center gap-3 px-5 py-3`}>
            <Link to="/" className="flex shrink-0 items-baseline gap-2 whitespace-nowrap">
              <span className="bg-gradient-to-r from-cyan via-ungu to-magenta bg-clip-text font-display text-[1.15rem] font-semibold tracking-tight text-transparent">
                Ruang Langit
              </span>
              <span className="hidden font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint sm:inline">
                OSN Astronomi
              </span>
            </Link>
            <div className="ml-auto">
              <NavAtas />
            </div>
            <button
              type="button"
              onClick={toggleSuara}
              data-suara="none"
              aria-label={suara ? 'Matikan efek suara' : 'Aktifkan efek suara'}
              title={suara ? 'Efek suara aktif (klik untuk senyapkan)' : 'Efek suara mati (klik untuk aktifkan)'}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-muted transition hover:border-cyan/50 hover:text-ink"
            >
              <Icon nama={suara ? 'suara' : 'suaraMati'} ukuran={17} />
            </button>
            <Link
              to="/progres"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-[14px] font-medium text-muted transition hover:border-ungu/50 hover:text-ink"
              aria-label="Progres dan profil"
            >
              {inisial}
            </Link>
          </div>
        </header>

        <main className={`mx-auto w-full ${kelasLebar} px-5 pb-28 pt-6 md:pb-16`}>
          <Outlet />
        </main>

        <BottomNav />
      </div>

      <LapisanPerayaan />
    </div>
  )
}

export function App() {
  useEffect(() => pasangPendengarSuaraGlobal(), [])

  return (
    <BrowserRouter>
      <GulirKeAtas />
      <SinkronAntrean />
      <Routes>
        <Route path="/masuk" element={<Masuk />} />
        <Route element={<Kerangka />}>
          <Route
            path="/"
            element={
              <Dilindungi>
                <Beranda />
              </Dilindungi>
            }
          />
          <Route
            path="/peta"
            element={
              <Dilindungi>
                <Peta />
              </Dilindungi>
            }
          />
          <Route
            path="/bab/:babId"
            element={
              <Dilindungi>
                <Bab />
              </Dilindungi>
            }
          />
          <Route
            path="/kuis"
            element={
              <Dilindungi>
                <Kuis />
              </Dilindungi>
            }
          />
          <Route
            path="/latihan"
            element={
              <Dilindungi>
                <Latihan />
              </Dilindungi>
            }
          />
          <Route
            path="/memori"
            element={
              <Dilindungi>
                <Memori />
              </Dilindungi>
            }
          />
          <Route
            path="/referensi"
            element={
              <Dilindungi>
                <Referensi />
              </Dilindungi>
            }
          />
          <Route
            path="/progres"
            element={
              <Dilindungi>
                <Progres />
              </Dilindungi>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
