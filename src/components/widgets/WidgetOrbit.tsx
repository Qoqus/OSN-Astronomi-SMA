import { useEffect, useRef, useState } from 'react'
import { keplerIII, posisiOrbit, visViva } from '@/lib/fisika'
import { PanelKontrol, Slider, Toggle, TombolReset, Nilai, Preset } from './kontrol'

const FX = 224
const FY = 162
const DUA_PI = Math.PI * 2

const PRESET = [
  { nama: 'Bumi', a: 1, e: 0.0167, m: 1 },
  { nama: 'Mars', a: 1.524, e: 0.0934, m: 1 },
  { nama: 'Merkurius', a: 0.387, e: 0.2056, m: 1 },
  { nama: 'Komet', a: 3, e: 0.7, m: 1 },
]

export function WidgetOrbit() {
  const [massa, setMassa] = useState(1)
  const [a, setA] = useState(1)
  const [e, setE] = useState(0.0167)
  const [kecepatan, setKecepatan] = useState(1)
  const [sapuan, setSapuan] = useState(true)
  const [jejak, setJejak] = useState(true)
  const [vektor, setVektor] = useState(false)
  const [M, setM] = useState(0)
  const [reduksi] = useState(
    () =>
      typeof window !== 'undefined' &&
      Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches),
  )

  const params = useRef({ a, e, massa, kecepatan })
  params.current = { a, e, massa, kecepatan }
  const Mref = useRef(0)
  const trail = useRef<{ x: number; y: number }[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const raf = useRef(0)
  const last = useRef(0)
  const inView = useRef(true)
  const hidden = useRef(false)

  useEffect(() => {
    trail.current = []
  }, [a, e, massa])

  useEffect(() => {
    if (reduksi) return
    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - last.current) / 1000)
      last.current = t
      const p = params.current
      Mref.current = (Mref.current + dt * p.kecepatan * 0.9) % DUA_PI
      const pos = posisiOrbit(p.a, p.e, Mref.current)
      trail.current.push({ x: pos.x, y: pos.y })
      if (trail.current.length > 150) trail.current.shift()
      setM(Mref.current)
      raf.current = requestAnimationFrame(loop)
    }
    const start = () => {
      if (raf.current) return
      last.current = performance.now()
      raf.current = requestAnimationFrame(loop)
    }
    const stop = () => {
      if (raf.current) cancelAnimationFrame(raf.current)
      raf.current = 0
    }
    const sync = () => {
      if (!hidden.current && inView.current) start()
      else stop()
    }
    const onVis = () => {
      hidden.current = document.hidden
      sync()
    }
    document.addEventListener('visibilitychange', onVis)
    const io = new IntersectionObserver(
      ([en]) => {
        inView.current = en.isIntersecting
        sync()
      },
      { threshold: 0.05 },
    )
    if (containerRef.current) io.observe(containerRef.current)
    sync()
    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVis)
      io.disconnect()
    }
  }, [reduksi])

  const skala = 132 / (a * (1 + e))
  const pos = posisiOrbit(a, e, M)
  const px = FX + pos.x * skala
  const py = FY - pos.y * skala
  const P = keplerIII(a, massa)
  const v = visViva(pos.r, a, massa)

  const posAwal = posisiOrbit(a, e, M - 0.5)
  const sektor = Array.from({ length: 14 }, (_, i) => {
    const p = posisiOrbit(a, e, M - 0.5 + (i / 13) * 0.5)
    return `${FX + p.x * skala},${FY - p.y * skala}`
  }).join(' ')

  const dv = posisiOrbit(a, e, M + 0.02)
  const vx = (dv.x - pos.x)
  const vy = (dv.y - pos.y)
  const vn = Math.hypot(vx, vy) || 1
  const vLen = 26 + v * 1.1
  const vEx = px + (vx / vn) * vLen
  const vEy = py - (vy / vn) * vLen

  const presetAktif = PRESET.find((p) => Math.abs(p.a - a) < 0.001 && Math.abs(p.e - e) < 0.001)

  function scrub(n: number) {
    Mref.current = n
    trail.current = []
    setM(n)
  }

  return (
    <div ref={containerRef} className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div className="rounded-[14px] border border-line bg-sunken/50 p-2">
        <svg viewBox="0 0 448 324" className="w-full" role="img"
          aria-label={`Simulator orbit: periode ${P.toFixed(2)} tahun, jarak ${pos.r.toFixed(2)} AU, kecepatan ${v.toFixed(1)} km/s`}>
          <ellipse cx={FX - a * e * skala} cy={FY} rx={a * skala} ry={a * Math.sqrt(1 - e * e) * skala}
            fill="none" stroke="var(--color-line)" strokeWidth="1.3" />
          <line x1={FX - a * (1 + e) * skala} y1={FY} x2={FX + a * (1 - e) * skala} y2={FY}
            stroke="var(--color-line)" strokeWidth="0.8" strokeDasharray="4 4" />

          {sapuan && (
            <polygon points={`${FX},${FY} ${sektor}`} fill="var(--color-ungu)" opacity="0.22" stroke="var(--color-ungu)" strokeWidth="0.6" />
          )}
          {jejak && trail.current.length > 1 && (
            <polyline points={trail.current.map((p) => `${FX + p.x * skala},${FY - p.y * skala}`).join(' ')}
              fill="none" stroke="var(--color-cyan)" strokeWidth="1.6" opacity="0.7" />
          )}

          <circle cx={FX} cy={FY} r={9 + massa * 0.7} fill="var(--color-amber)" />
          <circle cx={FX} cy={FY} r={16 + massa} fill="var(--color-amber)" opacity="0.15" />
          <text x={FX} y={FY + 30} textAnchor="middle" fill="var(--color-amber)" fontSize="9">Matahari ({massa.toFixed(1)} M☉)</text>

          {vektor && (
            <line x1={px} y1={py} x2={vEx} y2={vEy} stroke="var(--color-magenta)" strokeWidth="2" markerEnd="url(#panahOrbit)" />
          )}
          <line x1={FX} y1={FY} x2={px} y2={py} stroke="var(--color-faint)" strokeWidth="0.9" strokeDasharray="3 3" />
          <circle cx={px} cy={py} r="7" fill="var(--color-info)" stroke="var(--color-ink)" strokeWidth="1.6" />
          <text x={px + 11} y={py - 8} fill="var(--color-muted)" fontSize="9">r = {pos.r.toFixed(2)} AU</text>

          <text x={FX + a * (1 - e) * skala} y={FY + 16} textAnchor="middle" fill="var(--color-hijau)" fontSize="8">periapsis</text>
          <text x={FX - a * (1 + e) * skala} y={FY + 16} textAnchor="middle" fill="var(--color-korall)" fontSize="8">apoapsis</text>
          <defs>
            <marker id="panahOrbit" markerWidth="8" markerHeight="8" refX="6" refY="3.5" orient="auto">
              <path d="M0 0 L7 3.5 L0 7 Z" fill="var(--color-magenta)" />
            </marker>
          </defs>
        </svg>
        {reduksi && (
          <div className="px-2 pb-1">
            <Slider label="Waktu (fase orbit)" value={M} min={0} max={DUA_PI} step={0.01}
              accent="var(--color-cyan)" format={(n) => `${((n / DUA_PI) * 100).toFixed(0)}%`} onChange={scrub} />
          </div>
        )}
      </div>

      <PanelKontrol className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {PRESET.map((p) => (
            <Preset key={p.nama} label={p.nama} aktif={presetAktif?.nama === p.nama}
              onClick={() => { setA(p.a); setE(p.e); setMassa(p.m); trail.current = [] }} />
          ))}
        </div>
        <Slider label="Massa pusat" value={massa} min={0.1} max={10} step={0.1} accent="var(--color-amber)"
          format={(n) => `${n.toFixed(1)} M☉`} onChange={setMassa} />
        <Slider label="Semi-sumbu mayor a" value={a} min={0.2} max={10} step={0.05} accent="var(--color-cyan)"
          format={(n) => `${n.toFixed(2)} AU`} onChange={setA} />
        <Slider label="Eksentrisitas e" value={e} min={0} max={0.8} step={0.005} accent="var(--color-magenta)"
          format={(n) => n.toFixed(3)} onChange={setE} />
        <Slider label="Kecepatan animasi" value={kecepatan} min={0.2} max={4} step={0.1} accent="var(--color-ungu)"
          format={(n) => `${n.toFixed(1)}×`} onChange={setKecepatan} />
        <div className="space-y-0.5 border-t border-line pt-2">
          <Toggle label="Sapuan luas (Kepler II)" checked={sapuan} accent="var(--color-ungu)" onChange={setSapuan} />
          <Toggle label="Jejak orbit" checked={jejak} onChange={setJejak} />
          <Toggle label="Vektor kecepatan" checked={vektor} accent="var(--color-magenta)" onChange={setVektor} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Nilai label="Periode" nilai={P < 1 ? (P * 365.25).toFixed(0) : P.toFixed(2)} satuan={P < 1 ? 'hari' : 'thn'} accent="var(--color-hijau)" />
          <Nilai label="Jarak r" nilai={pos.r.toFixed(2)} satuan="AU" accent="var(--color-cyan)" />
          <Nilai label="Laju v" nilai={v.toFixed(1)} satuan="km/s" accent="var(--color-magenta)" />
        </div>
        <TombolReset onClick={() => { setMassa(1); setA(1); setE(0.0167); setKecepatan(1); setSapuan(true); setJejak(true); setVektor(false); trail.current = []; scrub(0) }} />
      </PanelKontrol>
    </div>
  )
}