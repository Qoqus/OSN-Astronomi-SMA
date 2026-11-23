import { NavLink } from 'react-router-dom'
import { Icon, type NamaIkon } from './Icon'

const ITEM_DESKTOP: { ke: string; label: string; ikon: NamaIkon }[] = [
  { ke: '/', label: 'Beranda', ikon: 'beranda' },
  { ke: '/peta', label: 'Peta', ikon: 'peta' },
  { ke: '/latihan', label: 'Latihan', ikon: 'latihan' },
  { ke: '/memori', label: 'Memori', ikon: 'memori' },
  { ke: '/referensi', label: 'Referensi', ikon: 'referensi' },
  { ke: '/progres', label: 'Progres', ikon: 'progres' },
]

const ITEM_MOBILE: { ke: string; label: string; ikon: NamaIkon }[] = [
  { ke: '/', label: 'Beranda', ikon: 'beranda' },
  { ke: '/peta', label: 'Peta', ikon: 'peta' },
  { ke: '/latihan', label: 'Latihan', ikon: 'latihan' },
  { ke: '/memori', label: 'Memori', ikon: 'memori' },
  { ke: '/referensi', label: 'Referensi', ikon: 'referensi' },
]

export function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-canvas/90 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      aria-label="Navigasi utama"
    >
      <ul className="mx-auto flex max-w-[560px] items-stretch justify-around px-1">
        {ITEM_MOBILE.map((it) => (
          <li key={it.ke} className="flex-1">
            <NavLink
              to={it.ke}
              end={it.ke === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2 text-[11px] whitespace-nowrap transition ${
                  isActive ? 'text-ungu' : 'text-faint hover:text-muted'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={
                      isActive
                        ? 'flex h-7 w-11 items-center justify-center rounded-full bg-ungu-soft shadow-[0_0_14px_rgb(139_92_246/0.4)]'
                        : 'flex h-7 w-11 items-center justify-center'
                    }
                  >
                    <Icon nama={it.ikon} ukuran={19} strokeWidth={isActive ? 2 : 1.6} />
                  </span>
                  <span className={isActive ? 'font-medium' : ''}>{it.label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function NavAtas() {
  return (
    <nav className="hidden md:block" aria-label="Navigasi utama">
      <ul className="flex items-center gap-1">
        {ITEM_DESKTOP.map((it) => (
          <li key={it.ke}>
            <NavLink
              to={it.ke}
              end={it.ke === '/'}
              className={({ isActive }) =>
                `whitespace-nowrap shrink-0 rounded-full px-3.5 py-2 text-[14px] transition ${
                  isActive
                    ? 'bg-ungu-soft text-ungu shadow-[0_0_14px_rgb(139_92_246/0.25)]'
                    : 'text-muted hover:text-ink'
                }`
              }
            >
              {it.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}