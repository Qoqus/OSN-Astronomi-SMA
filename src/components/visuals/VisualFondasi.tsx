import { useId, useState } from 'react'
import clsx from 'clsx'

type Params = Record<string, unknown>

function num(val: unknown, fallback: number): number {
  return typeof val === 'number' && Number.isFinite(val) ? val : fallback
}

function str(val: unknown, fallback = ''): string {
  return typeof val === 'string' ? val : fallback
}

function bool(val: unknown, fallback = false): boolean {
  return typeof val === 'boolean' ? val : fallback
}

function formatId(n: number, digits = 3): string {
  if (!Number.isFinite(n)) return '—'
  if (Math.abs(n) >= 1e4 || (Math.abs(n) > 0 && Math.abs(n) < 1e-3)) {
    return n.toExponential(2).replace('.', ',')
  }
  const rounded = Number(n.toFixed(digits))
  return String(rounded).replace('.', ',')
}

// ---------------------------------------------------------------------------
// 1. LOG SCALE BAR
// ---------------------------------------------------------------------------
interface LogMarker {
  label: string
  exp: number
  valueText?: string
  highlight?: boolean
  note?: string
}

interface LogZone {
  label: string
  fromExp: number
  toExp: number
  tone?: 'cyan' | 'ungu' | 'amber' | 'hijau'
}

export function LogScaleBar({
  params,
  interactive = true,
}: {
  params: Params
  interactive?: boolean
}) {
  const minExp = num(params.minExp, -15)
  const maxExp = num(params.maxExp, 27)
  const axisLabel = str(params.axisLabel, 'Skala logaritmik basis 10')
  const unit = str(params.unit, '')
  const showLinearToggle = bool(params.compareLinear, false)
  const rawMarkers = Array.isArray(params.markers) ? params.markers : []
  const markers: LogMarker[] = rawMarkers
    .filter((m): m is Record<string, unknown> => Boolean(m && typeof m === 'object'))
    .map((m) => ({
      label: str(m.label, '?'),
      exp: num(m.exp, 0),
      valueText: typeof m.valueText === 'string' ? m.valueText : undefined,
      highlight: bool(m.highlight, false),
      note: typeof m.note === 'string' ? m.note : undefined,
    }))
  const rawZones = Array.isArray(params.zones) ? params.zones : []
  const zones: LogZone[] = rawZones
    .filter((z): z is Record<string, unknown> => Boolean(z && typeof z === 'object'))
    .map((z) => ({
      label: str(z.label, ''),
      fromExp: num(z.fromExp, minExp),
      toExp: num(z.toExp, maxExp),
      tone: (['cyan', 'ungu', 'amber', 'hijau'].includes(str(z.tone)) ? str(z.tone) : 'cyan') as LogZone['tone'],
    }))

  const [selectedIdx, setSelectedIdx] = useState<number | null>(
    markers.findIndex((m) => m.highlight) >= 0 ? markers.findIndex((m) => m.highlight) : null,
  )
  const [compareIdx, setCompareIdx] = useState<number | null>(null)
  const [linearView, setLinearView] = useState(false)

  const span = Math.max(1, maxExp - minExp)
  const padL = 36
  const padR = 36
  const W = 620
  const plotW = W - padL - padR
  const toX = (exp: number) => padL + ((exp - minExp) / span) * plotW

  const step = span > 24 ? 6 : span > 12 ? 3 : span > 6 ? 2 : 1
  const ticks: number[] = []
  for (let e = Math.ceil(minExp / step) * step; e <= maxExp; e += step) {
    ticks.push(e)
  }

  const toneColor: Record<NonNullable<LogZone['tone']>, string> = {
    cyan: 'var(--color-cyan)',
    ungu: 'var(--color-ungu)',
    amber: 'var(--color-amber)',
    hijau: 'var(--color-hijau)',
  }

  const sel = selectedIdx !== null ? markers[selectedIdx] : undefined
  const cmp = compareIdx !== null ? markers[compareIdx] : undefined
  const deltaExp = sel && cmp ? sel.exp - cmp.exp : null

  return (
    <div className="w-full space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-[12px]">
        <span className="font-medium text-muted">
          {axisLabel}
          {unit ? ` (${unit})` : ''}
        </span>
        {interactive && showLinearToggle && (
          <button
            type="button"
            onClick={() => setLinearView((v) => !v)}
            className="rounded-md border border-line bg-surface px-2.5 py-1 text-[11.5px] font-medium text-cyan transition hover:border-cyan/60"
          >
            {linearView ? 'Tampilkan skala logaritmik' : 'Bandingkan dengan skala linear'}
          </button>
        )}
      </div>

      <svg
        viewBox={`0 0 ${W} ${markers.length > 0 ? 176 : 96}`}
        className="w-full overflow-visible"
        role="img"
        aria-label={`${axisLabel} dari 10^${minExp} sampai 10^${maxExp}`}
      >
        {/* Zones */}
        {!linearView &&
          zones.map((z, idx) => {
            const x1 = toX(Math.max(minExp, z.fromExp))
            const x2 = toX(Math.min(maxExp, z.toExp))
            const c = toneColor[z.tone ?? 'cyan']
            return (
              <g key={idx}>
                <rect
                  x={x1}
                  y={76}
                  width={Math.max(4, x2 - x1)}
                  height={12}
                  rx={4}
                  fill={c}
                  opacity={0.18}
                />
                {z.label && (
                  <text
                    x={(x1 + x2) / 2}
                    y={69}
                    textAnchor="middle"
                    fill={c}
                    fontSize="10"
                    fontWeight="600"
                  >
                    {z.label}
                  </text>
                )}
              </g>
            )
          })}

        {/* Main Axis */}
        <line
          x1={padL}
          y1={92}
          x2={W - padR}
          y2={92}
          stroke="var(--color-line)"
          strokeWidth="2"
        />

        {!linearView ? (
          ticks.map((e) => {
            const x = toX(e)
            return (
              <g key={e}>
                <line
                  x1={x}
                  y1={86}
                  x2={x}
                  y2={98}
                  stroke="var(--color-faint)"
                  strokeWidth="1.2"
                />
                <text
                  x={x}
                  y={114}
                  textAnchor="middle"
                  fill="var(--color-muted)"
                  fontSize="10.5"
                  className="tabular-nums"
                >
                  10^{e}
                </text>
              </g>
            )
          })
        ) : (
          <g>
            {[0, 0.25, 0.5, 0.75, 1].map((frac, idx) => {
              const x = padL + frac * plotW
              const val = Math.pow(10, maxExp) * frac
              return (
                <g key={idx}>
                  <line x1={x} y1={86} x2={x} y2={98} stroke="var(--color-amber)" strokeWidth="1.2" />
                  <text x={x} y={114} textAnchor="middle" fill="var(--color-amber)" fontSize="10">
                    {frac === 0 ? '0' : `${formatId(val, 1)}`}
                  </text>
                </g>
              )
            })}
            <text x={W / 2} y={134} textAnchor="middle" fill="var(--color-amber)" fontSize="10.5">
              Pada skala linear, hampir semua objek kecil menumpuk di titik 0!
            </text>
          </g>
        )}

        {/* Markers */}
        {!linearView &&
          markers.map((m, i) => {
            const x = toX(m.exp)
            const lane = i % 2 === 0 ? -1 : 1
            const yLabel = lane < 0 ? (i % 4 === 0 ? 32 : 52) : i % 4 === 1 ? 142 : 162
            const active = selectedIdx === i || compareIdx === i
            const fill = m.highlight || active ? 'var(--color-cyan)' : 'var(--color-amber)'
            return (
              <g
                key={`${m.label}-${i}`}
                onClick={() => {
                  if (!interactive) return
                  if (selectedIdx === null || selectedIdx === i) {
                    setSelectedIdx(i)
                  } else {
                    setCompareIdx(i)
                  }
                }}
                className={interactive ? 'cursor-pointer' : undefined}
              >
                <line
                  x1={x}
                  y1={92}
                  x2={x}
                  y2={lane < 0 ? yLabel + 6 : yLabel - 12}
                  stroke={fill}
                  strokeWidth={active ? '1.8' : '1.2'}
                  strokeDasharray={active ? undefined : '2 2'}
                />
                <circle
                  cx={x}
                  cy={92}
                  r={active ? 6 : 4.5}
                  fill={fill}
                  stroke="var(--color-surface)"
                  strokeWidth="1.5"
                />
                <text
                  x={x}
                  y={yLabel}
                  textAnchor="middle"
                  fill={active ? 'var(--color-cyan)' : 'var(--color-ink)'}
                  fontSize="10.5"
                  fontWeight={active || m.highlight ? '600' : '400'}
                >
                  {m.label}
                  {m.valueText ? ` (${m.valueText})` : ''}
                </text>
              </g>
            )
          })}
      </svg>

      {interactive && (sel || cmp) && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-[10px] border border-line bg-surface/80 px-3 py-2 text-[12px] text-muted">
          <div>
            {sel && (
              <span>
                Terpilih: <strong className="text-ink">{sel.label}</strong> (10^
                <span className="tabular-nums">{formatId(sel.exp, 2)}</span>
                {unit ? ` ${unit}` : ''})
                {sel.note ? ` — ${sel.note}` : ''}
              </span>
            )}
            {cmp && deltaExp !== null && (
              <span className="ml-2 text-cyan">
                · Rasio vs {cmp.label}:{' '}
                <strong className="tabular-nums">
                  10^{formatId(deltaExp, 2)} ({formatId(Math.pow(10, deltaExp), 2)}×)
                </strong>
              </span>
            )}
          </div>
          <span className="text-[11px] text-faint">
            Klik dua penanda untuk melihat rasio orde besar
          </span>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// 2. DATA TABLE
// ---------------------------------------------------------------------------
interface TableCol {
  key: string
  label: string
  unit?: string
  align?: 'left' | 'right' | 'center'
}

export function DataTableParametrik({ params }: { params: Params }) {
  const title = str(params.title, '')
  const rawCols = Array.isArray(params.columns) ? params.columns : []
  const columns: TableCol[] = rawCols
    .filter((c): c is Record<string, unknown> => Boolean(c && typeof c === 'object'))
    .map((c) => ({
      key: str(c.key, ''),
      label: str(c.label, ''),
      unit: typeof c.unit === 'string' ? c.unit : undefined,
      align: (['left', 'right', 'center'].includes(str(c.align))
        ? str(c.align)
        : 'left') as TableCol['align'],
    }))
  const rawRows = Array.isArray(params.rows) ? params.rows : []
  const rows = rawRows.filter((r): r is Record<string, unknown> => Boolean(r && typeof r === 'object'))
  const highlightRow = typeof params.highlightRow === 'number' ? params.highlightRow : -1
  const highlightColumn = str(params.highlightColumn, '')
  const uncertaintyNote = str(params.uncertaintyNote, '')
  const footnotes = Array.isArray(params.footnotes)
    ? params.footnotes.filter((f): f is string => typeof f === 'string')
    : []

  const [pinnedRow, setPinnedRow] = useState<number | null>(null)

  return (
    <div className="w-full space-y-2">
      {title && <p className="text-[12.5px] font-medium text-ink/90">{title}</p>}
      <div className="overflow-x-auto rounded-[10px] border border-line bg-surface/60">
        <table className="w-full border-collapse text-[13.5px]">
          <thead>
            <tr className="bg-sunken/80 text-left text-[11.5px] uppercase tracking-[0.06em] text-faint">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={clsx(
                    'px-3.5 py-2.5 font-semibold whitespace-nowrap',
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center',
                    col.key === highlightColumn && 'text-cyan',
                  )}
                >
                  <div>{col.label}</div>
                  {col.unit && (
                    <div className="mt-0.5 text-[10.5px] font-normal normal-case tracking-normal text-muted">
                      [{col.unit}]
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const active = idx === highlightRow || idx === pinnedRow
              return (
                <tr
                  key={idx}
                  onClick={() => setPinnedRow((p) => (p === idx ? null : idx))}
                  className={clsx(
                    'cursor-pointer border-t border-line/80 transition',
                    active ? 'bg-cyan-soft/35' : 'hover:bg-sunken/40',
                  )}
                >
                  {columns.map((col) => {
                    const val = row[col.key]
                    const teks =
                      typeof val === 'number'
                        ? formatId(val, 4)
                        : typeof val === 'string'
                          ? val
                          : '—'
                    return (
                      <td
                        key={col.key}
                        className={clsx(
                          'px-3.5 py-2 tabular-nums whitespace-nowrap',
                          col.align === 'right' && 'text-right',
                          col.align === 'center' && 'text-center',
                          col.key === highlightColumn && 'font-medium text-cyan',
                        )}
                      >
                        {teks}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {(uncertaintyNote || footnotes.length > 0) && (
        <div className="space-y-0.5 text-[11.5px] text-faint">
          {uncertaintyNote && <p>Catatan ketidakpastian: {uncertaintyNote}</p>}
          {footnotes.map((fn, i) => (
            <p key={i}>{fn}</p>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// 3. LINEARIZATION PLOT (supports points, error bars, fit lines, slope envelope)
// ---------------------------------------------------------------------------
interface PlotPoint {
  x: number
  y: number
  dx?: number
  dy?: number
  label?: string
}

export function LinearizationPlot({
  params,
  interactive = true,
}: {
  params: Params
  interactive?: boolean
}) {
  const title = str(params.title, '')
  const xLabel = str(params.xLabel, 'x')
  const yLabel = str(params.yLabel, 'y')
  const rawPts = Array.isArray(params.points) ? params.points : []
  const points: PlotPoint[] = rawPts
    .filter((p): p is Record<string, unknown> => Boolean(p && typeof p === 'object'))
    .map((p) => ({
      x: num(p.x, 0),
      y: num(p.y, 0),
      dx: typeof p.dx === 'number' ? p.dx : undefined,
      dy: typeof p.dy === 'number' ? p.dy : undefined,
      label: typeof p.label === 'string' ? p.label : undefined,
    }))

  const xs = points.map((p) => p.x)
  const ys = points.map((p) => p.y)
  const xMin = num(params.xMin, xs.length ? Math.min(...xs) - 0.5 : 0)
  const xMax = num(params.xMax, xs.length ? Math.max(...xs) + 0.5 : 5)
  const yMin = num(params.yMin, ys.length ? Math.min(...ys) - 0.5 : 0)
  const yMax = num(params.yMax, ys.length ? Math.max(...ys) + 0.5 : 5)

  const fitObj =
    params.fitLine && typeof params.fitLine === 'object'
      ? (params.fitLine as Record<string, unknown>)
      : null
  const fitLine = fitObj
    ? {
        slope: num(fitObj.slope, 1),
        intercept: num(fitObj.intercept, 0),
        minSlope: typeof fitObj.minSlope === 'number' ? fitObj.minSlope : undefined,
        maxSlope: typeof fitObj.maxSlope === 'number' ? fitObj.maxSlope : undefined,
        label: typeof fitObj.label === 'string' ? fitObj.label : undefined,
      }
    : null

  const showTriangleInit = bool(params.showSlopeTriangle, false)
  const [showTriangle, setShowTriangle] = useState(showTriangleInit)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const [crosshair, setCrosshair] = useState<{ x: number; y: number } | null>(null)

  const W = 560
  const H = 310
  const padL = 62
  const padR = 24
  const padT = 26
  const padB = 48
  const pW = W - padL - padR
  const pH = H - padT - padB

  const mapX = (x: number) => padL + ((x - xMin) / Math.max(1e-9, xMax - xMin)) * pW
  const mapY = (y: number) => padT + pH - ((y - yMin) / Math.max(1e-9, yMax - yMin)) * pH

  const xTicks = Array.from({ length: 6 }, (_, i) => xMin + ((xMax - xMin) * i) / 5)
  const yTicks = Array.from({ length: 6 }, (_, i) => yMin + ((yMax - yMin) * i) / 5)

  function clipSegment(slope: number, intercept: number) {
    const x1 = xMin
    const y1 = slope * x1 + intercept
    const x2 = xMax
    const y2 = slope * x2 + intercept
    return { x1: mapX(x1), y1: mapY(y1), x2: mapX(x2), y2: mapY(y2) }
  }

  const clipId = useId()
  const activePoint = hoverIdx !== null ? points[hoverIdx] : null

  return (
    <div className="w-full space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {title ? (
          <p className="text-[12.5px] font-medium text-ink/90">{title}</p>
        ) : (
          <span />
        )}
        {interactive && fitLine && (
          <button
            type="button"
            onClick={() => setShowTriangle((v) => !v)}
            className="rounded-md border border-line bg-surface px-2.5 py-1 text-[11.5px] font-medium text-cyan transition hover:border-cyan/60"
          >
            {showTriangle ? 'Sembunyikan segitiga gradien' : 'Tampilkan segitiga gradien (Δy/Δx)'}
          </button>
        )}
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full select-none"
        role="img"
        aria-label={title || `Plot ${yLabel} terhadap ${xLabel}`}
        onMouseMove={(e) => {
          if (!interactive) return
          const rect = e.currentTarget.getBoundingClientRect()
          const sx = ((e.clientX - rect.left) / rect.width) * W
          const sy = ((e.clientY - rect.top) / rect.height) * H
          if (sx >= padL && sx <= padL + pW && sy >= padT && sy <= padT + pH) {
            const dxVal = xMin + ((sx - padL) / pW) * (xMax - xMin)
            const dyVal = yMin + ((padT + pH - sy) / pH) * (yMax - yMin)
            setCrosshair({ x: dxVal, y: dyVal })
          } else {
            setCrosshair(null)
          }
        }}
        onMouseLeave={() => setCrosshair(null)}
      >
        <defs>
          <clipPath id={clipId}>
            <rect x={padL} y={padT} width={pW} height={pH} />
          </clipPath>
        </defs>

        {/* Grid */}
        {xTicks.map((xt, i) => (
          <g key={`xg-${i}`}>
            <line
              x1={mapX(xt)}
              y1={padT}
              x2={mapX(xt)}
              y2={padT + pH}
              stroke="var(--color-line)"
              strokeOpacity="0.45"
              strokeDasharray="3 3"
            />
            <text
              x={mapX(xt)}
              y={padT + pH + 17}
              textAnchor="middle"
              fill="var(--color-muted)"
              fontSize="10.5"
              className="tabular-nums"
            >
              {formatId(xt, 2)}
            </text>
          </g>
        ))}
        {yTicks.map((yt, i) => (
          <g key={`yg-${i}`}>
            <line
              x1={padL}
              y1={mapY(yt)}
              x2={padL + pW}
              y2={mapY(yt)}
              stroke="var(--color-line)"
              strokeOpacity="0.45"
              strokeDasharray="3 3"
            />
            <text
              x={padL - 8}
              y={mapY(yt) + 3.5}
              textAnchor="end"
              fill="var(--color-muted)"
              fontSize="10.5"
              className="tabular-nums"
            >
              {formatId(yt, 2)}
            </text>
          </g>
        ))}

        {/* Axes */}
        <rect
          x={padL}
          y={padT}
          width={pW}
          height={pH}
          fill="none"
          stroke="var(--color-faint)"
          strokeWidth="1.2"
        />

        {/* Fit lines & envelope */}
        <g clipPath={`url(#${clipId})`}>
          {fitLine && fitLine.minSlope !== undefined && fitLine.maxSlope !== undefined && (() => {
            const xMid = (xMin + xMax) / 2
            const yMid = fitLine.slope * xMid + fitLine.intercept
            const segMin = clipSegment(fitLine.minSlope, yMid - fitLine.minSlope * xMid)
            const segMax = clipSegment(fitLine.maxSlope, yMid - fitLine.maxSlope * xMid)
            return (
              <g>
                <line
                  x1={segMin.x1}
                  y1={segMin.y1}
                  x2={segMin.x2}
                  y2={segMin.y2}
                  stroke="var(--color-amber)"
                  strokeWidth="1.3"
                  strokeDasharray="5 4"
                />
                <line
                  x1={segMax.x1}
                  y1={segMax.y1}
                  x2={segMax.x2}
                  y2={segMax.y2}
                  stroke="var(--color-amber)"
                  strokeWidth="1.3"
                  strokeDasharray="5 4"
                />
              </g>
            )
          })()}

          {fitLine && (() => {
            const seg = clipSegment(fitLine.slope, fitLine.intercept)
            const tx1 = xMin + (xMax - xMin) * 0.25
            const tx2 = xMin + (xMax - xMin) * 0.75
            const ty1 = fitLine.slope * tx1 + fitLine.intercept
            const ty2 = fitLine.slope * tx2 + fitLine.intercept
            return (
              <g>
                <line
                  x1={seg.x1}
                  y1={seg.y1}
                  x2={seg.x2}
                  y2={seg.y2}
                  stroke="var(--color-ungu)"
                  strokeWidth="2"
                />
                {showTriangle && (
                  <g>
                    <polyline
                      points={`${mapX(tx1)},${mapY(ty1)} ${mapX(tx2)},${mapY(ty1)} ${mapX(tx2)},${mapY(ty2)}`}
                      fill="none"
                      stroke="var(--color-hijau)"
                      strokeWidth="1.4"
                      strokeDasharray="4 3"
                    />
                    <text
                      x={(mapX(tx1) + mapX(tx2)) / 2}
                      y={mapY(ty1) + 14}
                      textAnchor="middle"
                      fill="var(--color-hijau)"
                      fontSize="10.5"
                    >
                      Δx = {formatId(tx2 - tx1, 2)}
                    </text>
                    <text
                      x={mapX(tx2) + 6}
                      y={(mapY(ty1) + mapY(ty2)) / 2}
                      fill="var(--color-hijau)"
                      fontSize="10.5"
                    >
                      Δy = {formatId(ty2 - ty1, 2)}
                    </text>
                  </g>
                )}
              </g>
            )
          })()}

          {/* Points & Error bars */}
          {points.map((pt, i) => {
            const cx = mapX(pt.x)
            const cy = mapY(pt.y)
            const hovered = hoverIdx === i
            return (
              <g
                key={i}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
                className="cursor-pointer"
              >
                {pt.dy !== undefined && pt.dy > 0 && (
                  <g stroke="var(--color-cyan)" strokeWidth="1.3" opacity="0.85">
                    <line x1={cx} y1={mapY(pt.y - pt.dy)} x2={cx} y2={mapY(pt.y + pt.dy)} />
                    <line x1={cx - 4} y1={mapY(pt.y - pt.dy)} x2={cx + 4} y2={mapY(pt.y - pt.dy)} />
                    <line x1={cx - 4} y1={mapY(pt.y + pt.dy)} x2={cx + 4} y2={mapY(pt.y + pt.dy)} />
                  </g>
                )}
                {pt.dx !== undefined && pt.dx > 0 && (
                  <g stroke="var(--color-cyan)" strokeWidth="1.3" opacity="0.85">
                    <line x1={mapX(pt.x - pt.dx)} y1={cy} x2={mapX(pt.x + pt.dx)} y2={cy} />
                    <line x1={mapX(pt.x - pt.dx)} y1={cy - 4} x2={mapX(pt.x - pt.dx)} y2={cy + 4} />
                    <line x1={mapX(pt.x + pt.dx)} y1={cy - 4} x2={mapX(pt.x + pt.dx)} y2={cy + 4} />
                  </g>
                )}
                <circle
                  cx={cx}
                  cy={cy}
                  r={hovered ? 5.5 : 4}
                  fill={hovered ? 'var(--color-amber)' : 'var(--color-cyan)'}
                  stroke="var(--color-surface)"
                  strokeWidth="1.3"
                />
                {pt.label && (
                  <text
                    x={cx + 7}
                    y={cy - 6}
                    fill="var(--color-ink)"
                    fontSize="10"
                  >
                    {pt.label}
                  </text>
                )}
              </g>
            )
          })}

          {crosshair && (
            <g stroke="var(--color-faint)" strokeWidth="0.8" strokeDasharray="2 2" pointerEvents="none">
              <line x1={mapX(crosshair.x)} y1={padT} x2={mapX(crosshair.x)} y2={padT + pH} />
              <line x1={padL} y1={mapY(crosshair.y)} x2={padL + pW} y2={mapY(crosshair.y)} />
            </g>
          )}
        </g>

        {/* Axis labels */}
        <text
          x={padL + pW / 2}
          y={H - 8}
          textAnchor="middle"
          fill="var(--color-ink)"
          fontSize="12"
          fontWeight="500"
        >
          {xLabel}
        </text>
        <text
          x={16}
          y={padT + pH / 2}
          textAnchor="middle"
          transform={`rotate(-90 16 ${padT + pH / 2})`}
          fill="var(--color-ink)"
          fontSize="12"
          fontWeight="500"
        >
          {yLabel}
        </text>

        {fitLine?.label && (
          <text x={padL + pW - 6} y={padT + 16} textAnchor="end" fill="var(--color-ungu)" fontSize="11">
            {fitLine.label}
          </text>
        )}
      </svg>

      {interactive && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11.5px] text-faint">
          <span className="tabular-nums">
            {activePoint
              ? `Titik ${activePoint.label ?? ''}: x = ${formatId(activePoint.x, 3)}${activePoint.dx ? ` ± ${formatId(activePoint.dx, 3)}` : ''}, y = ${formatId(activePoint.y, 3)}${activePoint.dy ? ` ± ${formatId(activePoint.dy, 3)}` : ''}`
              : crosshair
                ? `Kursor: x = ${formatId(crosshair.x, 2)}, y = ${formatId(crosshair.y, 2)}`
                : 'Arahkan kursor ke titik atau area grafik untuk membaca koordinat'}
          </span>
          {fitLine && (
            <span className="tabular-nums text-muted">
              Garis fit: m = {formatId(fitLine.slope, 3)}, c = {formatId(fitLine.intercept, 3)}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// 4. PZS SPHERICAL TRIANGLE
// ---------------------------------------------------------------------------
export function PzsTriangleVisual({
  params,
  interactive = true,
}: {
  params: Params
  interactive?: boolean
}) {
  const initPhi = num(params.phiDeg, -7)
  const initDec = num(params.decDeg, 20)
  const initHa = num(params.haDeg, 45)
  const allowControls = bool(params.interactive, interactive)
  const highlightSide = str(params.highlightSide, '')

  const [phiDeg, setPhiDeg] = useState(initPhi)
  const [decDeg, setDecDeg] = useState(initDec)
  const [haDeg, setHaDeg] = useState(initHa)

  const toRad = (d: number) => (d * Math.PI) / 180
  const toDeg = (r: number) => (r * 180) / Math.PI

  const phi = toRad(phiDeg)
  const dec = toRad(decDeg)
  const ha = toRad(haDeg)

  const cosZ = Math.max(
    -1,
    Math.min(1, Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(ha)),
  )
  const zDeg = toDeg(Math.acos(cosZ))
  const altDeg = 90 - zDeg

  const sinZ = Math.max(1e-6, Math.sin(toRad(zDeg)))
  const cosA = Math.max(
    -1,
    Math.min(1, (Math.sin(dec) - Math.sin(phi) * cosZ) / (Math.max(1e-6, Math.cos(phi)) * sinZ)),
  )
  let azDeg = toDeg(Math.acos(cosA))
  if (Math.sin(ha) > 0) azDeg = 360 - azDeg

  // Project 3 vertices cleanly onto a celestial sphere representation
  const cx = 190
  const cy = 148
  const R = 112
  const Px = cx
  const Py = cy - R * 0.72
  const Zx = cx - R * 0.45
  const Zy = cy + R * 0.12
  const shiftH = Math.sin(ha) * 58
  const shiftD = -Math.sin(dec) * 32
  const Sx = cx + R * 0.48 + shiftH * 0.35
  const Sy = cy + R * 0.18 + shiftD

  const pzArc = `M ${Px} ${Py} Q ${cx - R * 0.42} ${cy - R * 0.44} ${Zx} ${Zy}`
  const psArc = `M ${Px} ${Py} Q ${cx + R * 0.42} ${cy - R * 0.42} ${Sx} ${Sy}`
  const zsArc = `M ${Zx} ${Zy} Q ${cx + 5} ${cy + R * 0.42} ${Sx} ${Sy}`

  return (
    <div className="w-full space-y-3">
      <div className="grid gap-4 md:grid-cols-[1.2fr_1fr] md:items-center">
        <svg
          viewBox="0 0 380 286"
          className="mx-auto w-full max-w-[380px]"
          role="img"
          aria-label="Segitiga bola astronomi Kutub-Zenit-Bintang (PZS)"
        >
          {/* Celestial sphere */}
          <circle
            cx={cx}
            cy={cy}
            r={R}
            fill="var(--color-surface)"
            fillOpacity="0.45"
            stroke="var(--color-line)"
            strokeWidth="1.4"
          />
          <ellipse
            cx={cx}
            cy={cy + 26}
            rx={R}
            ry={28}
            fill="none"
            stroke="var(--color-faint)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <text x={cx + R - 18} y={cy + 46} fill="var(--color-faint)" fontSize="10">
            Horizon
          </text>

          {/* Sides of spherical triangle */}
          <path
            d={pzArc}
            fill="none"
            stroke={highlightSide === 'PZ' ? 'var(--color-amber)' : 'var(--color-cyan)'}
            strokeWidth={highlightSide === 'PZ' ? '2.6' : '2'}
          />
          <path
            d={psArc}
            fill="none"
            stroke={highlightSide === 'PS' ? 'var(--color-amber)' : 'var(--color-ungu)'}
            strokeWidth={highlightSide === 'PS' ? '2.6' : '2'}
          />
          <path
            d={zsArc}
            fill="none"
            stroke={highlightSide === 'ZS' ? 'var(--color-amber)' : 'var(--color-hijau)'}
            strokeWidth={highlightSide === 'ZS' ? '2.6' : '2'}
          />

          {/* Side labels */}
          <text x={(Px + Zx) / 2 - 36} y={(Py + Zy) / 2 - 4} fill="var(--color-cyan)" fontSize="11">
            90°−φ
          </text>
          <text x={(Px + Sx) / 2 + 16} y={(Py + Sy) / 2 - 4} fill="var(--color-ungu)" fontSize="11">
            90°−δ
          </text>
          <text x={(Zx + Sx) / 2} y={(Zy + Sy) / 2 + 28} fill="var(--color-hijau)" fontSize="11" textAnchor="middle">
            z = {formatId(zDeg, 1)}°
          </text>

          {/* Angle H at P */}
          <text x={Px} y={Py + 24} textAnchor="middle" fill="var(--color-amber)" fontSize="11" fontWeight="600">
            H = {formatId(haDeg, 0)}°
          </text>

          {/* Vertices */}
          <circle cx={Px} cy={Py} r="5" fill="var(--color-amber)" />
          <text x={Px} y={Py - 10} textAnchor="middle" fill="var(--color-ink)" fontSize="12" fontWeight="600">
            P (Kutub)
          </text>

          <circle cx={Zx} cy={Zy} r="5" fill="var(--color-cyan)" />
          <text x={Zx - 10} y={Zy + 16} textAnchor="end" fill="var(--color-ink)" fontSize="12" fontWeight="600">
            Z (Zenit)
          </text>

          <circle cx={Sx} cy={Sy} r="5.5" fill="var(--color-hijau)" />
          <text x={Sx + 10} y={Sy + 4} fill="var(--color-ink)" fontSize="12" fontWeight="600">
            S (Bintang)
          </text>
        </svg>

        <div className="space-y-3 rounded-[12px] border border-line bg-surface/75 p-3.5 text-[12.5px]">
          <div className="grid grid-cols-2 gap-2 tabular-nums">
            <div className="rounded-lg bg-sunken/70 p-2">
              <div className="text-[11px] text-faint">Jarak zenit (z)</div>
              <div className="text-[15px] font-semibold text-hijau">{formatId(zDeg, 1)}°</div>
            </div>
            <div className="rounded-lg bg-sunken/70 p-2">
              <div className="text-[11px] text-faint">Ketinggian (alt)</div>
              <div className="text-[15px] font-semibold text-cyan">{formatId(altDeg, 1)}°</div>
            </div>
            <div className="rounded-lg bg-sunken/70 p-2">
              <div className="text-[11px] text-faint">Azimut (A)</div>
              <div className="text-[15px] font-semibold text-ink">{formatId(azDeg, 1)}°</div>
            </div>
            <div className="rounded-lg bg-sunken/70 p-2">
              <div className="text-[11px] text-faint">Jarak kutub (PS)</div>
              <div className="text-[15px] font-semibold text-ungu">{formatId(90 - decDeg, 1)}°</div>
            </div>
          </div>

          {allowControls && (
            <div className="space-y-2 border-t border-line pt-2.5">
              <label className="block">
                <div className="flex justify-between text-[11.5px] text-muted">
                  <span>Lintang pengamat (φ)</span>
                  <span className="tabular-nums text-ink">{phiDeg}°</span>
                </div>
                <input
                  type="range"
                  min={-80}
                  max={80}
                  step={1}
                  value={phiDeg}
                  onChange={(e) => setPhiDeg(Number(e.target.value))}
                  className="mt-1 w-full accent-cyan"
                />
              </label>
              <label className="block">
                <div className="flex justify-between text-[11.5px] text-muted">
                  <span>Deklinasi bintang (δ)</span>
                  <span className="tabular-nums text-ink">{decDeg}°</span>
                </div>
                <input
                  type="range"
                  min={-80}
                  max={80}
                  step={1}
                  value={decDeg}
                  onChange={(e) => setDecDeg(Number(e.target.value))}
                  className="mt-1 w-full accent-ungu"
                />
              </label>
              <label className="block">
                <div className="flex justify-between text-[11.5px] text-muted">
                  <span>Sudut jam (H)</span>
                  <span className="tabular-nums text-ink">{haDeg}°</span>
                </div>
                <input
                  type="range"
                  min={-150}
                  max={150}
                  step={5}
                  value={haDeg}
                  onChange={(e) => setHaDeg(Number(e.target.value))}
                  className="mt-1 w-full accent-amber"
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 5. SCHEMATIC (parametric geometry & physics schematics)
// ---------------------------------------------------------------------------
export function SchematicVisual({
  params,
  interactive = true,
}: {
  params: Params
  interactive?: boolean
}) {
  const variant = str(params.variant, 'unit_circle')

  if (variant === 'unit_circle') {
    const initAngle = num(params.angleDeg, 45)
    const allowSlider = bool(params.interactive, false) && interactive
    const [angleDeg, setAngleDeg] = useState(initAngle)
    const rad = (angleDeg * Math.PI) / 180
    const cx = 165
    const cy = 140
    const R = 96
    const px = cx + R * Math.cos(rad)
    const py = cy - R * Math.sin(rad)
    const cosV = Math.cos(rad)
    const sinV = Math.sin(rad)

    return (
      <div className="w-full space-y-2.5">
        <div className="grid gap-4 sm:grid-cols-[1.15fr_1fr] sm:items-center">
          <svg viewBox="0 0 330 280" className="mx-auto w-full max-w-[330px]" role="img" aria-label={`Lingkaran satuan pada sudut ${angleDeg} derajat`}>
            <line x1="30" y1={cy} x2="300" y2={cy} stroke="var(--color-line)" strokeWidth="1.2" />
            <line x1={cx} y1="18" x2={cx} y2="262" stroke="var(--color-line)" strokeWidth="1.2" />
            <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--color-faint)" strokeWidth="1.3" />

            {/* Arc length highlight */}
            <path
              d={`M ${cx + 28} ${cy} A 28 28 0 ${angleDeg > 180 ? 1 : 0} 0 ${cx + 28 * Math.cos(rad)} ${cy - 28 * Math.sin(rad)}`}
              fill="none"
              stroke="var(--color-amber)"
              strokeWidth="2"
            />
            <line x1={cx} y1={cy} x2={px} y2={py} stroke="var(--color-ungu)" strokeWidth="2.2" />
            <line x1={px} y1={cy} x2={px} y2={py} stroke="var(--color-korall)" strokeWidth="2" strokeDasharray="4 3" />
            <line x1={cx} y1={cy} x2={px} y2={cy} stroke="var(--color-cyan)" strokeWidth="2" />
            <circle cx={px} cy={py} r="5.5" fill="var(--color-amber)" stroke="var(--color-surface)" strokeWidth="1.5" />

            <text x={px + (cosV >= 0 ? 10 : -10)} y={py + (sinV >= 0 ? -10 : 16)} textAnchor={cosV >= 0 ? 'start' : 'end'} fill="var(--color-ink)" fontSize="11" className="tabular-nums">
              ({formatId(cosV, 2)}; {formatId(sinV, 2)})
            </text>
            <text x={(cx + px) / 2} y={cy + (sinV >= 0 ? 16 : -8)} textAnchor="middle" fill="var(--color-cyan)" fontSize="11">
              cos θ
            </text>
            <text x={px + (cosV >= 0 ? 8 : -8)} y={(cy + py) / 2} textAnchor={cosV >= 0 ? 'start' : 'end'} fill="var(--color-korall)" fontSize="11">
              sin θ
            </text>
            <text x={cx + 38} y={cy - 14} fill="var(--color-amber)" fontSize="11" className="tabular-nums">
              θ = {formatId(angleDeg, 0)}°
            </text>
          </svg>

          <div className="space-y-2 rounded-[12px] border border-line bg-surface/75 p-3.5 text-[12.5px] tabular-nums">
            <div className="flex justify-between">
              <span className="text-muted">Sudut (rad)</span>
              <span className="font-semibold text-amber">{formatId(rad, 4)} rad</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">cos θ (x)</span>
              <span className="font-semibold text-cyan">{formatId(cosV, 3)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">sin θ (y)</span>
              <span className="font-semibold text-korall">{formatId(sinV, 3)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">tan θ</span>
              <span className="font-semibold text-ungu">
                {Math.abs(cosV) < 1e-4 ? '∞' : formatId(Math.tan(rad), 3)}
              </span>
            </div>
            {allowSlider && (
              <label className="block border-t border-line pt-2">
                <span className="text-[11.5px] text-faint">Geser sudut θ</span>
                <input
                  type="range"
                  min={0}
                  max={360}
                  step={5}
                  value={angleDeg}
                  onChange={(e) => setAngleDeg(Number(e.target.value))}
                  className="mt-1 w-full accent-amber"
                />
              </label>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'small_angle') {
    const angleDeg = num(params.angleDeg, 8)
    const sizeLabel = str(params.sizeLabel, 'd')
    const distLabel = str(params.distLabel, 'D')
    const angleLabel = str(params.angleLabel, 'θ')
    const rad = (angleDeg * Math.PI) / 180
    const relErrSin = ((rad - Math.sin(rad)) / Math.max(1e-9, Math.sin(rad))) * 100
    const relErrTan = ((Math.tan(rad) - rad) / Math.max(1e-9, Math.tan(rad))) * 100

    const ox = 56
    const oy = 115
    const L = 340
    const halfH = Math.max(16, Math.min(72, Math.tan(rad / 2) * L * 1.4))

    return (
      <svg viewBox="0 0 480 220" className="w-full" role="img" aria-label="Geometri aproksimasi sudut kecil">
        <line x1={ox} y1={oy} x2={ox + L} y2={oy - halfH} stroke="var(--color-cyan)" strokeWidth="1.8" />
        <line x1={ox} y1={oy} x2={ox + L} y2={oy + halfH} stroke="var(--color-cyan)" strokeWidth="1.8" />
        <line x1={ox} y1={oy} x2={ox + L} y2={oy} stroke="var(--color-line)" strokeWidth="1.2" strokeDasharray="4 4" />
        <line x1={ox + L} y1={oy - halfH} x2={ox + L} y2={oy + halfH} stroke="var(--color-amber)" strokeWidth="2.4" />
        <path
          d={`M ${ox + L - 6} ${oy - halfH} Q ${ox + L + 14} ${oy} ${ox + L - 6} ${oy + halfH}`}
          fill="none"
          stroke="var(--color-ungu)"
          strokeWidth="1.6"
          strokeDasharray="4 3"
        />
        <circle cx={ox} cy={oy} r="5" fill="var(--color-hijau)" />
        <text x={ox} y={oy + 22} textAnchor="middle" fill="var(--color-hijau)" fontSize="11">Pengamat</text>
        <text x={ox + 68} y={oy - 8} fill="var(--color-cyan)" fontSize="12">{angleLabel} ≈ {formatId(angleDeg, 1)}° ({formatId(rad, 4)} rad)</text>
        <text x={ox + L / 2} y={oy + 18} textAnchor="middle" fill="var(--color-muted)" fontSize="12">{distLabel}</text>
        <text x={ox + L + 16} y={oy + 4} fill="var(--color-amber)" fontSize="12">{sizeLabel} ≈ {distLabel}·{angleLabel}</text>
        <text x={ox} y={196} fill="var(--color-faint)" fontSize="11" className="tabular-nums">
          Galat relatif sin θ ≈ θ: {formatId(Math.abs(relErrSin), 3)}% · Galat tan θ ≈ θ: {formatId(Math.abs(relErrTan), 3)}%
        </text>
      </svg>
    )
  }

  if (variant === 'vector_projection') {
    const rawVecs = Array.isArray(params.vectors) ? params.vectors : []
    const vectors = rawVecs
      .filter((v): v is Record<string, unknown> => Boolean(v && typeof v === 'object'))
      .map((v, i) => ({
        label: str(v.label, `v${i + 1}`),
        mag: num(v.mag, 50),
        angleDeg: num(v.angleDeg, 35),
        color: i === 0 ? 'var(--color-cyan)' : i === 1 ? 'var(--color-magenta)' : 'var(--color-amber)',
      }))
    const axisLabel = str(params.axisLabel, 'Garis pandang pengamat (radial)')
    const orthoLabel = str(params.orthoLabel, 'Bidang langit (tangensial)')
    const showComponents = bool(params.showComponents, true)

    const ox = 85
    const oy = 185
    const maxMag = Math.max(1, ...vectors.map((v) => v.mag))
    const scale = 190 / maxMag

    return (
      <svg viewBox="0 0 460 240" className="w-full" role="img" aria-label="Proyeksi vektor pada garis pandang dan bidang langit">
        <defs>
          <marker id="vecArrow" markerWidth="8" markerHeight="8" refX="6" refY="3.5" orient="auto">
            <path d="M0 0 L7 3.5 L0 7 Z" fill="var(--color-cyan)" />
          </marker>
          <marker id="vecArrowAmb" markerWidth="8" markerHeight="8" refX="6" refY="3.5" orient="auto">
            <path d="M0 0 L7 3.5 L0 7 Z" fill="var(--color-amber)" />
          </marker>
        </defs>
        <line x1={ox} y1={oy} x2="410" y2={oy} stroke="var(--color-faint)" strokeWidth="1.2" />
        <line x1={ox} y1={oy} x2={ox} y2="24" stroke="var(--color-faint)" strokeWidth="1.2" />
        <text x="410" y={oy + 18} textAnchor="end" fill="var(--color-muted)" fontSize="11">{axisLabel}</text>
        <text x={ox + 8} y="30" fill="var(--color-muted)" fontSize="11">{orthoLabel}</text>

        {vectors.map((v, i) => {
          const rad = (v.angleDeg * Math.PI) / 180
          const vx = ox + v.mag * scale * Math.cos(rad)
          const vy = oy - v.mag * scale * Math.sin(rad)
          const vr = v.mag * Math.cos(rad)
          const vt = v.mag * Math.sin(rad)
          return (
            <g key={i}>
              {showComponents && (
                <g strokeDasharray="4 3" strokeWidth="1.4" opacity="0.8">
                  <line x1={vx} y1={vy} x2={vx} y2={oy} stroke="var(--color-hijau)" />
                  <line x1={ox} y1={oy} x2={vx} y2={oy} stroke="var(--color-hijau)" />
                  <line x1={vx} y1={vy} x2={ox} y2={vy} stroke="var(--color-ungu)" />
                  <text x={(ox + vx) / 2} y={oy + 16} textAnchor="middle" fill="var(--color-hijau)" fontSize="10.5" className="tabular-nums">
                    v_r = {formatId(vr, 1)}
                  </text>
                  <text x={ox - 8} y={(oy + vy) / 2 + 4} textAnchor="end" fill="var(--color-ungu)" fontSize="10.5" className="tabular-nums">
                    v_t = {formatId(vt, 1)}
                  </text>
                </g>
              )}
              <line
                x1={ox}
                y1={oy}
                x2={vx}
                y2={vy}
                stroke={v.color}
                strokeWidth="2.4"
                markerEnd={i === 0 ? 'url(#vecArrow)' : 'url(#vecArrowAmb)'}
              />
              <text x={vx + 8} y={vy - 6} fill={v.color} fontSize="11.5" fontWeight="600" className="tabular-nums">
                {v.label} ({formatId(v.mag, 1)}, {v.angleDeg}°)
              </text>
            </g>
          )
        })}
      </svg>
    )
  }

  if (variant === 'inverse_square') {
    const radii = Array.isArray(params.radii)
      ? params.radii.filter((r): r is number => typeof r === 'number' && r > 0)
      : [1, 2, 3]
    const sourceLabel = str(params.sourceLabel, 'L')
    const baseFluxLabel = str(params.baseFluxLabel, 'F₀')
    const maxR = Math.max(...radii, 1)

    return (
      <svg viewBox="0 0 540 215" className="w-full" role="img" aria-label="Hukum kuadrat terbalik untuk fluks radiasi">
        <circle cx="52" cy="110" r="10" fill="var(--color-amber)" />
        <text x="52" y="138" textAnchor="middle" fill="var(--color-amber)" fontSize="11.5" fontWeight="600">{sourceLabel}</text>
        {radii.map((r, idx) => {
          const x = 52 + (r / maxR) * 415
          const boxSize = Math.min(72, 18 + (r / maxR) * 52)
          const invR2 = 1 / (r * r)
          return (
            <g key={r}>
              <path
                d={`M 62 110 L ${x} ${110 - boxSize * 0.55} L ${x} ${110 + boxSize * 0.55} Z`}
                fill="var(--color-amber)"
                opacity={0.07}
              />
              <rect
                x={x - boxSize / 2}
                y={110 - boxSize / 2}
                width={boxSize}
                height={boxSize}
                fill="var(--color-cyan)"
                fillOpacity={Math.max(0.08, 0.32 - idx * 0.08)}
                stroke="var(--color-cyan)"
                strokeWidth="1.5"
              />
              <text x={x} y={110 - boxSize / 2 - 10} textAnchor="middle" fill="var(--color-ink)" fontSize="11" className="tabular-nums">
                r = {r} r₀
              </text>
              <text x={x} y={110 + boxSize / 2 + 16} textAnchor="middle" fill="var(--color-cyan)" fontSize="11" className="tabular-nums">
                A = {r * r} A₀ · F = {formatId(invR2, 3)} {baseFluxLabel}
              </text>
            </g>
          )
        })}
      </svg>
    )
  }

  if (variant === 'trapezoid_integral') {
    const intervals = Math.max(2, Math.min(12, num(params.intervals, 4)))
    const xLabel = str(params.xLabel, 't (jam)')
    const yLabel = str(params.yLabel, 'ΔF (relatif)')
    const peak = num(params.peak, 1)
    const xMax = num(params.xMax, 4)

    const W = 500
    const H = 230
    const padL = 56
    const padR = 24
    const padT = 22
    const padB = 42
    const pW = W - padL - padR
    const pH = H - padT - padB

    const f = (x: number) => {
      const u = (x - xMax / 2) / (xMax / 2)
      return Math.max(0, peak * (1 - u * u))
    }
    const mx = (x: number) => padL + (x / xMax) * pW
    const my = (y: number) => padT + pH - (y / (peak * 1.15)) * pH

    const pts = Array.from({ length: 61 }, (_, i) => {
      const x = (i / 60) * xMax
      return `${mx(x)},${my(f(x))}`
    }).join(' ')

    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Integrasi numerik metode trapesium di bawah kurva">
        {Array.from({ length: intervals }, (_, i) => {
          const x1 = (i / intervals) * xMax
          const x2 = ((i + 1) / intervals) * xMax
          const y1 = f(x1)
          const y2 = f(x2)
          return (
            <polygon
              key={i}
              points={`${mx(x1)},${my(0)} ${mx(x1)},${my(y1)} ${mx(x2)},${my(y2)} ${mx(x2)},${my(0)}`}
              fill="var(--color-cyan)"
              fillOpacity={0.18}
              stroke="var(--color-cyan)"
              strokeWidth="1.2"
            />
          )
        })}
        <polyline points={pts} fill="none" stroke="var(--color-amber)" strokeWidth="2.2" />
        <line x1={padL} y1={padT + pH} x2={padL + pW} y2={padT + pH} stroke="var(--color-faint)" strokeWidth="1.3" />
        <line x1={padL} y1={padT} x2={padL} y2={padT + pH} stroke="var(--color-faint)" strokeWidth="1.3" />
        <text x={padL + pW / 2} y={H - 8} textAnchor="middle" fill="var(--color-ink)" fontSize="11.5">
          {xLabel} ({intervals} sub-interval trapesium)
        </text>
        <text x={18} y={padT + pH / 2} textAnchor="middle" transform={`rotate(-90 18 ${padT + pH / 2})`} fill="var(--color-ink)" fontSize="11.5">
          {yLabel}
        </text>
      </svg>
    )
  }

  if (variant === 'error_propagation') {
    const formula = str(params.formula, 'f = x^a · y^b')
    const rawTerms = Array.isArray(params.terms) ? params.terms : []
    const terms = rawTerms
      .filter((t): t is Record<string, unknown> => Boolean(t && typeof t === 'object'))
      .map((t) => {
        const relPct = num(t.relPct, 1)
        const power = Math.abs(num(t.power, 1))
        const varContrib = Math.pow(power * relPct, 2)
        return { label: str(t.label, 'x'), relPct, power, varContrib }
      })
    const totalVar = Math.max(1e-9, terms.reduce((s, t) => s + t.varContrib, 0))
    const totalRel = Math.sqrt(totalVar)

    return (
      <div className="w-full space-y-2.5 rounded-[12px] border border-line bg-surface/75 p-4 text-[13px]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-medium text-ink">Kontribusi varians kuadratur: {formula}</span>
          <span className="tabular-nums font-semibold text-cyan">
            σ_f / f = {formatId(totalRel, 2)}%
          </span>
        </div>
        <div className="space-y-2">
          {terms.map((t, i) => {
            const pctShare = (t.varContrib / totalVar) * 100
            return (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[12px] tabular-nums">
                  <span className="text-muted">
                    {t.label} (pangkat |{t.power}|, ralat {formatId(t.relPct, 2)}%)
                  </span>
                  <span className="font-medium text-ink">{formatId(pctShare, 1)}% dari σ_f²</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-sunken">
                  <div
                    className={clsx(
                      'h-full rounded-full transition-all',
                      pctShare > 65 ? 'bg-amber' : 'bg-cyan',
                    )}
                    style={{ width: `${Math.min(100, pctShare)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Fallback schematic with nodes/annotations
  const title = str(params.title, 'Diagram skematis')
  const items = Array.isArray(params.steps)
    ? params.steps.filter((s): s is string => typeof s === 'string')
    : []
  return (
    <div className="w-full rounded-[12px] border border-line bg-surface/70 p-4 text-[13px]">
      <p className="font-medium text-ink">{title}</p>
      {items.length > 0 && (
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          {items.map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="rounded-lg border border-line bg-sunken px-2.5 py-1 text-[12px] text-ink">
                {step}
              </span>
              {i < items.length - 1 && <span className="text-faint">→</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
