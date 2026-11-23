import { Suspense, lazy } from 'react'
import { Icon } from '@/components/ui/Icon'

const WidgetHR = lazy(() => import('./WidgetHR').then((m) => ({ default: m.WidgetHR })))
const WidgetOrbit = lazy(() => import('./WidgetOrbit').then((m) => ({ default: m.WidgetOrbit })))
const WidgetMagnitudo = lazy(() => import('./WidgetMagnitudo').then((m) => ({ default: m.WidgetMagnitudo })))

export type JenisWidget = 'hr' | 'orbit' | 'magnitudo'

const JUDUL: Record<JenisWidget, string> = {
  hr: 'Diagram HR interaktif',
  orbit: 'Simulator orbit & Kepler',
  magnitudo: 'Playground magnitudo',
}

const PETUNJUK: Record<JenisWidget, string> = {
  hr: 'Seret bintang (atau tombol panah) untuk mengubah suhu & luminositas; radius dan daerah HR dihitung langsung.',
  orbit: 'Ubah massa, sumbu mayor, dan eksentrisitas; perhatikan periode (Kepler III) serta sapuan luas yang sama (Kepler II).',
  magnitudo: 'Geser jarak, luminositas, dan ekstingsi; lihat fluks, magnitudo semu/absolut, dan modulus jarak berubah.',
}

function Fallback() {
  return (
    <div className="flex h-64 items-center justify-center rounded-[14px] border border-line bg-sunken/50">
      <span className="anim-pop font-mono text-[13px] text-faint">Memuat widget…</span>
    </div>
  )
}

export function Interaktif({
  jenis,
  judul,
}: {
  jenis: JenisWidget
  judul?: string
}) {
  const Widget = jenis === 'hr' ? WidgetHR : jenis === 'orbit' ? WidgetOrbit : WidgetMagnitudo
  return (
    <section className="not-prose my-7">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ungu-soft text-ungu">
          <Icon nama="bintang" ukuran={14} />
        </span>
        <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ungu">
          Interaktif · {judul ?? JUDUL[jenis]}
        </p>
      </div>
      <Suspense fallback={<Fallback />}>
        <Widget />
      </Suspense>
      <p className="mt-2 text-[13px] leading-relaxed text-faint">{PETUNJUK[jenis]}</p>
    </section>
  )
}