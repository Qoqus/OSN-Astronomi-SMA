import { useRef, useState } from 'react'
import { klasifikasiHR, radiusDariLT, KONSTANTA } from '@/lib/fisika'
import { PanelKontrol, Slider, Toggle, TombolReset, Nilai, Preset } from './kontrol'

const T_MIN = 2500
const T_MAX = 40000
const L_MIN = 1e-4
const L_MAX = 1e6
const LOG_T_MIN = Math.log10(T_MIN)
const LOG_T_MAX = Math.log10(T_MAX)
const LOG_L_MIN = Math.log10(L_MIN)
const LOG_L_MAX = Math.log10(L_MAX)

const KIRI = 62
const KANAN = 412
const ATAS = 28
const BAWAH = 252

const xOf = (T: number) =>
  KIRI + ((LOG_T_MAX - Math.log10(T)) / (LOG_T_MAX - LOG_T_MIN)) * (KANAN - KIRI)
const yOf = (L: number) =>
  BAWAH - ((Math.log10(L) - LOG_L_MIN) / (LOG_L_MAX - LOG_L_MIN)) * (BAWAH - ATAS)
const tOfX = (x: number) =>
  10 ** (LOG_T_MAX - ((x - KIRI) / (KANAN - KIRI)) * (LOG_T_MAX - LOG_T_MIN))
const lOfY = (y: number) =>
  10 ** (LOG_L_MIN + ((BAWAH - y) / (BAWAH - ATAS)) * (LOG_L_MAX - LOG_L_MIN))

const clampT = (T: number) => Math.min(T_MAX, Math.max(T_MIN, T))
const clampL = (L: number) => Math.min(L_MAX, Math.max(L_MIN, L))
const deretUtamaL = (T: number) => 10 ** (5.5 * (Math.log10(T) - 3.76))

const PRESET = [
  { nama: 'Matahari', T: 5772, L: 1 },
  { nama: 'Sirius A', T: 9940, L: 25.4 },
  { nama: 'Betelgeuse', T: 3600, L: 126000 },
  { nama: 'Vega (ZAMS)', T: 9600, L: 40 },
]

function fmtL(L: number) {
  if (L >= 1000 || L < 0.01) return L.toExponential(1).replace('e+', 'e')
  return L.toFixed(L < 1 ? 3 : 1)
}

export function WidgetHR() {
  const [T, setT] = useState(5772)
  const [L, setL] = useState(1)
  const [kunciMS, setKunciMS] = useState(false)
  const [isoRadius, setIsoRadius] = useState(true)
  const [label, setLabel] = useState(true)
  const svgRef = useRef<SVGSVGElement>(null)
  const dragging = useRef(false)

  function terap(Tbaru: number, Lbaru: number) {
    const Tc = clampT(Tbaru)
    setT(Tc)
    setL(kunciMS ? clampL(deretUtamaL(Tc)) : clampL(Lbaru))
  }

  function dariPointer(e: React.PointerEvent) {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 440
    const y = ((e.clientY - rect.top) / rect.height) * 300
    terap(tOfX(x), lOfY(y))
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const dT = e.shiftKey ? 1.08 : 1.02
    const dL = e.shiftKey ? 1.3 : 1.1
    if (e.key === 'ArrowLeft') { terap(T * dT, L); e.preventDefault() }
    else if (e.key === 'ArrowRight') { terap(T / dT, L); e.preventDefault() }
    else if (e.key === 'ArrowUp') { terap(T, L * dL); e.preventDefault() }
    else if (e.key === 'ArrowDown') { terap(T, L / dL); e.preventDefault() }
  }

  const R = radiusDariLT(L, T)
  const daerah = klasifikasiHR(T, L)
  const sx = xOf(T)
  const sy = yOf(L)
  const presetAktif = PRESET.find((p) => Math.abs(p.T - T) < 1 && Math.abs(p.L - L) / p.L < 0.01)

  const isoR = [0.1, 1, 10, 100]
  const tickT = [30000, 10000, 6000, 3000]
  const tickL = [1e6, 1e4, 1e2, 1, 1e-2, 1e-4]

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div className="rounded-[14px] border border-line bg-sunken/50 p-2">
        <svg
          ref={svgRef}
          viewBox="0 0 440 300"
          className="w-full touch-none"
          role="application"
          aria-label="Diagram HR interaktif. Seret bintang atau gunakan tombol panah untuk mengubah suhu dan luminositas."
          onPointerMove={(e) => { if (dragging.current) dariPointer(e) }}
          onPointerUp={(e) => { dragging.current = false; (e.target as Element).releasePointerCapture?.(e.pointerId) }}
        >
          <rect x={KIRI} y={ATAS} width={KANAN - KIRI} height={BAWAH - ATAS} fill="var(--color-canvas)" opacity="0.5" />
          {tickL.map((l) => (
            <g key={l}>
              <line x1={KIRI} y1={yOf(l)} x2={KANAN} y2={yOf(l)} stroke="var(--color-line)" strokeWidth="0.6" />
              <text x={KIRI - 6} y={yOf(l) + 3} textAnchor="end" fill="var(--color-faint)" fontSize="8">
                {l >= 1 ? `10${sup(Math.log10(l))}` : `10⁻${sup(-Math.log10(l))}`}
              </text>
            </g>
          ))}
          {tickT.map((t) => (
            <text key={t} x={xOf(t)} y={BAWAH + 16} textAnchor="middle" fill="var(--color-faint)" fontSize="8">
              {t / 1000}k
            </text>
          ))}
          <line x1={KIRI} y1={BAWAH} x2={KANAN} y2={BAWAH} stroke="var(--color-faint)" strokeWidth="1.2" />
          <line x1={KIRI} y1={BAWAH} x2={KIRI} y2={ATAS} stroke="var(--color-faint)" strokeWidth="1.2" />
          <text x={KANAN} y={BAWAH + 30} textAnchor="end" fill="var(--color-muted)" fontSize="9">suhu T (K) → menurun</text>
          <text x={14} y={ATAS + 4} fill="var(--color-muted)" fontSize="9">L/L☉</text>

          {isoRadius && isoR.map((r) => {
            const L1 = r * r * (T_MAX / KONSTANTA.TSUN) ** 4
            const L2 = r * r * (T_MIN / KONSTANTA.TSUN) ** 4
            return (
              <g key={r}>
                <line x1={xOf(T_MAX)} y1={yOf(clampL(L1))} x2={xOf(T_MIN)} y2={yOf(clampL(L2))}
                  stroke="var(--color-line)" strokeWidth="1" strokeDasharray="4 3" />
                <text x={xOf(7000)} y={yOf(clampL(r * r * (7000 / KONSTANTA.TSUN) ** 4)) - 4}
                  fill="var(--color-faint)" fontSize="7.5" textAnchor="middle">{r} R☉</text>
              </g>
            )
          })}

          <path
            d={`M ${xOf(T_MAX)} ${yOf(clampL(deretUtamaL(T_MAX)))} ` +
              Array.from({ length: 40 }, (_, i) => {
                const t = 10 ** (LOG_T_MAX - (i / 39) * (LOG_T_MAX - LOG_T_MIN))
                return `L ${xOf(t)} ${yOf(clampL(deretUtamaL(t)))}`
              }).join(' ')}
            fill="none" stroke="var(--color-hijau)" strokeWidth="2" opacity="0.8"
          />
          <text x={xOf(11000)} y={yOf(deretUtamaL(11000)) - 8} fill="var(--color-hijau)" fontSize="9">deret utama</text>
          <ellipse cx={xOf(3600)} cy={yOf(2000)} rx="46" ry="20" fill="none" stroke="var(--color-korall)" strokeWidth="1.2" strokeDasharray="4 3" />
          <text x={xOf(3600)} y={yOf(2000) - 24} textAnchor="middle" fill="var(--color-korall)" fontSize="9">raksasa</text>
          <ellipse cx={xOf(12000)} cy={yOf(0.01)} rx="34" ry="13" fill="none" stroke="var(--color-info)" strokeWidth="1.2" strokeDasharray="4 3" />
          <text x={xOf(12000)} y={yOf(0.01) + 24} textAnchor="middle" fill="var(--color-info)" fontSize="9">katai putih</text>

          <g
            tabIndex={0}
            role="slider"
            aria-label={`Bintang: suhu ${Math.round(T)} K, luminositas ${fmtL(L)} L☉, ${daerah}`}
            aria-valuetext={`${Math.round(T)} K, ${fmtL(L)} L Matahari`}
            onKeyDown={onKeyDown}
            onPointerDown={(e) => {
              dragging.current = true
              ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
              dariPointer(e)
            }}
            className="cursor-grab focus:outline-none active:cursor-grabbing"
          >
            <circle cx={sx} cy={sy} r="16" fill="var(--color-amber)" opacity="0.18" />
            <circle cx={sx} cy={sy} r="8" fill="var(--color-amber)" stroke="var(--color-ink)" strokeWidth="2" />
            <circle cx={sx} cy={sy} r="20" fill="transparent" />
            {label && (
              <text x={sx + 13} y={sy - 10} fill="var(--color-ink)" fontSize="9" fontWeight="600">
                {Math.round(T)} K · {fmtL(L)} L☉
              </text>
            )}
          </g>
        </svg>
      </div>

      <PanelKontrol className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {PRESET.map((p) => (
            <Preset key={p.nama} label={p.nama} aktif={presetAktif?.nama === p.nama}
              onClick={() => { setKunciMS(false); setT(p.T); setL(p.L) }} />
          ))}
        </div>
        <Slider label="Suhu permukaan" value={Math.log10(T)} min={LOG_T_MIN} max={LOG_T_MAX} step={0.004}
          accent="var(--color-korall)" format={() => `${Math.round(T).toLocaleString('id-ID')} K`}
          onChange={(v) => terap(10 ** v, L)} />
        <Slider label="Luminositas" value={Math.log10(L)} min={LOG_L_MIN} max={LOG_L_MAX} step={0.02}
          accent="var(--color-amber)" format={() => `${fmtL(L)} L☉`}
          onChange={(v) => terap(T, 10 ** v)} />
        <div className="space-y-0.5 border-t border-line pt-2">
          <Toggle label="Kunci ke deret utama" checked={kunciMS} accent="var(--color-hijau)"
            onChange={(b) => { setKunciMS(b); if (b) setL(clampL(deretUtamaL(T))) }} />
          <Toggle label="Garis iso-radius" checked={isoRadius} onChange={setIsoRadius} />
          <Toggle label="Label bintang" checked={label} onChange={setLabel} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Nilai label="Radius" nilai={R >= 100 ? R.toFixed(0) : R.toFixed(2)} satuan="R☉" accent="var(--color-cyan)" />
          <Nilai label="Daerah" nilai={daerah} accent="var(--color-magenta)" />
        </div>
        <TombolReset onClick={() => { setKunciMS(false); setT(5772); setL(1); setIsoRadius(true); setLabel(true) }} />
      </PanelKontrol>
    </div>
  )
}

function sup(n: number) {
  const peta: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' }
  return String(n).split('').map((c) => peta[c] ?? c).join('')
}