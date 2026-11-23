import { useId, useState } from 'react'

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

function formatId(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—'
  if (Math.abs(n) >= 1e4 || (Math.abs(n) > 0 && Math.abs(n) < 1e-3)) {
    return n.toExponential(2).replace('.', ',')
  }
  return String(Number(n.toFixed(digits))).replace('.', ',')
}

// Deterministic pseudo-random generator for reproducible noise from params
function seededNoise(seed: number): () => number {
  let a = Math.floor(seed * 9973) || 1337
  return () => {
    a = (a * 1664525 + 1013904223) >>> 0
    return a / 4294967296 - 0.5
  }
}

// ---------------------------------------------------------------------------
// 6. HR DIAGRAM (log T_eff inverted vs log L/L_sun + iso-radius lines)
// ---------------------------------------------------------------------------
export function HrDiagramVisual({ params }: { params: Params }) {
  const showIsoRadius = bool(params.showIsoRadius, true)
  const rawStars = Array.isArray(params.stars) ? params.stars : []
  const stars = rawStars
    .filter((s): s is Record<string, unknown> => Boolean(s && typeof s === 'object'))
    .map((s) => ({
      name: str(s.name, '★'),
      teff: num(s.teff, 5778),
      lum: num(s.lum, 1),
      highlight: bool(s.highlight, false),
    }))

  const W = 540
  const H = 300
  const padL = 58
  const padR = 24
  const padT = 22
  const padB = 46
  const pW = W - padL - padR
  const pH = H - padT - padB

  // log T from 4.6 (40000 K, left) to 3.4 (2500 K, right)
  const logTMax = 4.55
  const logTMin = 3.45
  const logLMin = -4
  const logLMax = 6

  const mapX = (teff: number) => {
    const lt = Math.log10(Math.max(1500, teff))
    return padL + ((logTMax - lt) / (logTMax - logTMin)) * pW
  }
  const mapY = (lum: number) => {
    const ll = Math.log10(Math.max(1e-5, lum))
    return padT + pH - ((ll - logLMin) / (logLMax - logLMin)) * pH
  }

  const clipId = useId()
  const radii = [0.01, 0.1, 1, 10, 100]
  const tTicks = [30000, 10000, 5778, 3000]
  const lTicks = [-4, -2, 0, 2, 4, 6]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Diagram Hertzsprung-Russell">
      <defs>
        <clipPath id={clipId}>
          <rect x={padL} y={padT} width={pW} height={pH} />
        </clipPath>
      </defs>

      <rect x={padL} y={padT} width={pW} height={pH} fill="none" stroke="var(--color-faint)" strokeWidth="1.2" />

      <g clipPath={`url(#${clipId})`}>
        {/* Main sequence band */}
        <path
          d={`M ${mapX(32000)} ${mapY(1e5)} Q ${mapX(8000)} ${mapY(20)} ${mapX(2800)} ${mapY(1e-3)}`}
          fill="none"
          stroke="var(--color-ungu)"
          strokeOpacity="0.24"
          strokeWidth="22"
          strokeLinecap="round"
        />
        <text x={mapX(8500)} y={mapY(18) - 14} fill="var(--color-ungu)" fontSize="10.5" opacity="0.85">
          Deret utama
        </text>

        {/* Iso-radius lines L/Lsun = (R/Rsun)^2 (T/Tsun)^4 */}
        {showIsoRadius &&
          radii.map((r) => {
            const t1 = 35000
            const t2 = 2800
            const l1 = r * r * Math.pow(t1 / 5778, 4)
            const l2 = r * r * Math.pow(t2 / 5778, 4)
            return (
              <g key={r}>
                <line
                  x1={mapX(t1)}
                  y1={mapY(l1)}
                  x2={mapX(t2)}
                  y2={mapY(l2)}
                  stroke="var(--color-line)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={mapX(4200)}
                  y={Math.max(padT + 14, Math.min(padT + pH - 6, mapY(r * r * Math.pow(4200 / 5778, 4)) - 4))}
                  fill="var(--color-faint)"
                  fontSize="9.5"
                >
                  {r} R☉
                </text>
              </g>
            )
          })}

        {stars.map((s, i) => {
          const cx = mapX(s.teff)
          const cy = mapY(s.lum)
          return (
            <g key={i}>
              <circle
                cx={cx}
                cy={cy}
                r={s.highlight ? 6 : 4.5}
                fill={s.highlight ? 'var(--color-amber)' : 'var(--color-cyan)'}
                stroke="var(--color-surface)"
                strokeWidth="1.4"
              />
              <text
                x={cx + 8}
                y={cy + 3}
                fill={s.highlight ? 'var(--color-amber)' : 'var(--color-ink)'}
                fontSize="10.5"
                fontWeight={s.highlight ? '600' : '400'}
              >
                {s.name}
              </text>
            </g>
          )
        })}
      </g>

      {tTicks.map((t) => (
        <text key={t} x={mapX(t)} y={padT + pH + 16} textAnchor="middle" fill="var(--color-muted)" fontSize="10" className="tabular-nums">
          {t.toLocaleString('id-ID')} K
        </text>
      ))}
      {lTicks.map((ll) => (
        <text key={ll} x={padL - 8} y={mapY(Math.pow(10, ll)) + 3} textAnchor="end" fill="var(--color-muted)" fontSize="10" className="tabular-nums">
          10^{ll}
        </text>
      ))}
      <text x={padL + pW / 2} y={H - 8} textAnchor="middle" fill="var(--color-ink)" fontSize="11.5">
        Suhu efektif T_eff (meningkat ke kiri)
      </text>
      <text x={15} y={padT + pH / 2} textAnchor="middle" transform={`rotate(-90 15 ${padT + pH / 2})`} fill="var(--color-ink)" fontSize="11.5">
        Luminositas (L / L☉)
      </text>
    </svg>
  )
}

// ---------------------------------------------------------------------------
// 7. LIGHT CURVE (transit / eclipsing / flare with noise & error bars)
// ---------------------------------------------------------------------------
export function LightCurveVisual({ params }: { params: Params }) {
  const period = num(params.period, 4) // days or hours
  const depth = num(params.depth, 0.02) // fractional flux drop
  const duration = num(params.duration, 0.4) // same time unit
  const noise = num(params.noise, 0.002)
  const errorBar = num(params.errorBar, noise > 0 ? noise : 0.002)
  const samples = Math.max(12, Math.min(80, num(params.samples, 36)))
  const timeUnit = str(params.timeUnit, 'jam')
  const shadeArea = bool(params.shadeArea, false)
  const seed = num(params.seed, 7)
  const showModel = bool(params.showModel, true)

  const tTotal = Math.max(duration * 2.4, period)
  const tCenter = tTotal / 2
  const halfDur = duration / 2
  const ingress = duration * 0.15

  function modelFlux(t: number): number {
    const dt = Math.abs(t - tCenter)
    if (dt >= halfDur) return 1
    if (dt <= halfDur - ingress) return 1 - depth
    const frac = (halfDur - dt) / Math.max(1e-6, ingress)
    return 1 - depth * frac
  }

  const rand = seededNoise(seed)
  const data = Array.from({ length: samples }, (_, i) => {
    const t = (i / (samples - 1)) * tTotal
    const f = modelFlux(t) + rand() * noise * 2
    return { t, f }
  })

  const yMin = 1 - Math.max(depth * 1.45, noise * 5, 0.01)
  const yMax = 1 + Math.max(depth * 0.35, noise * 4, 0.005)

  const W = 540
  const H = 260
  const padL = 62
  const padR = 20
  const padT = 22
  const padB = 44
  const pW = W - padL - padR
  const pH = H - padT - padB

  const mx = (t: number) => padL + (t / tTotal) * pW
  const my = (f: number) => padT + pH - ((f - yMin) / Math.max(1e-9, yMax - yMin)) * pH

  const modelPts = Array.from({ length: 120 }, (_, i) => {
    const t = (i / 119) * tTotal
    return `${mx(t)},${my(modelFlux(t))}`
  }).join(' ')

  const areaPts = [
    `${mx(0)},${my(1)}`,
    ...Array.from({ length: 120 }, (_, i) => {
      const t = (i / 119) * tTotal
      return `${mx(t)},${my(modelFlux(t))}`
    }),
    `${mx(tTotal)},${my(1)}`,
  ].join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Kurva cahaya fluks terhadap waktu">
      <rect x={padL} y={padT} width={pW} height={pH} fill="none" stroke="var(--color-faint)" strokeWidth="1.2" />
      <line x1={padL} y1={my(1)} x2={padL + pW} y2={my(1)} stroke="var(--color-line)" strokeDasharray="4 4" />

      {shadeArea && <polygon points={areaPts} fill="var(--color-amber)" fillOpacity="0.18" />}
      {showModel && <polyline points={modelPts} fill="none" stroke="var(--color-ungu)" strokeWidth="1.8" />}

      {data.map((d, i) => {
        const cx = mx(d.t)
        const cy = my(d.f)
        return (
          <g key={i}>
            {errorBar > 0 && (
              <line
                x1={cx}
                y1={my(d.f - errorBar)}
                x2={cx}
                y2={my(d.f + errorBar)}
                stroke="var(--color-cyan)"
                strokeWidth="1"
                opacity="0.7"
              />
            )}
            <circle cx={cx} cy={cy} r="2.8" fill="var(--color-cyan)" />
          </g>
        )
      })}

      <text x={padL - 8} y={my(1) + 3.5} textAnchor="end" fill="var(--color-muted)" fontSize="10.5" className="tabular-nums">
        1,000
      </text>
      <text x={padL - 8} y={my(1 - depth) + 3.5} textAnchor="end" fill="var(--color-amber)" fontSize="10.5" className="tabular-nums">
        {formatId(1 - depth, 3)}
      </text>
      <text x={padL + pW / 2} y={H - 8} textAnchor="middle" fill="var(--color-ink)" fontSize="11.5">
        Waktu ({timeUnit}) · durasi τ = {formatId(duration, 2)} {timeUnit} · δ = {formatId(depth * 100, 2)}%
      </text>
      <text x={15} y={padT + pH / 2} textAnchor="middle" transform={`rotate(-90 15 ${padT + pH / 2})`} fill="var(--color-ink)" fontSize="11.5">
        Fluks relatif
      </text>
    </svg>
  )
}

// ---------------------------------------------------------------------------
// 8. RV CURVE
// ---------------------------------------------------------------------------
export function RvCurveVisual({ params }: { params: Params }) {
  const K = num(params.K, 80) // m/s or km/s
  const period = num(params.period, 5)
  const gamma = num(params.gamma, 0)
  const unit = str(params.unit, 'm/s')
  const errorBar = num(params.errorBar, K * 0.08)

  const W = 540
  const H = 240
  const padL = 62
  const padR = 20
  const padT = 20
  const padB = 40
  const pW = W - padL - padR
  const pH = H - padT - padB
  const yMin = gamma - K * 1.35
  const yMax = gamma + K * 1.35

  const mx = (t: number) => padL + (t / period) * pW
  const my = (v: number) => padT + pH - ((v - yMin) / (yMax - yMin)) * pH

  const pts = Array.from({ length: 100 }, (_, i) => {
    const t = (i / 99) * period
    const v = gamma + K * Math.sin((2 * Math.PI * t) / period)
    return `${mx(t)},${my(v)}`
  }).join(' ')

  const rand = seededNoise(K + period)
  const samples = Array.from({ length: 16 }, (_, i) => {
    const t = ((i + 0.5) / 16) * period
    const v = gamma + K * Math.sin((2 * Math.PI * t) / period) + rand() * errorBar
    return { t, v }
  })

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Kurva kecepatan radial">
      <rect x={padL} y={padT} width={pW} height={pH} fill="none" stroke="var(--color-faint)" strokeWidth="1.2" />
      <line x1={padL} y1={my(gamma)} x2={padL + pW} y2={my(gamma)} stroke="var(--color-line)" strokeDasharray="4 4" />
      <polyline points={pts} fill="none" stroke="var(--color-ungu)" strokeWidth="2" />
      {samples.map((s, i) => (
        <g key={i}>
          <line x1={mx(s.t)} y1={my(s.v - errorBar)} x2={mx(s.t)} y2={my(s.v + errorBar)} stroke="var(--color-cyan)" strokeWidth="1.1" />
          <circle cx={mx(s.t)} cy={my(s.v)} r="3" fill="var(--color-cyan)" />
        </g>
      ))}
      <text x={padL - 8} y={my(gamma + K) + 4} textAnchor="end" fill="var(--color-amber)" fontSize="10">+{formatId(gamma + K, 1)}</text>
      <text x={padL - 8} y={my(gamma - K) + 4} textAnchor="end" fill="var(--color-amber)" fontSize="10">{formatId(gamma - K, 1)}</text>
      <text x={padL + pW / 2} y={H - 8} textAnchor="middle" fill="var(--color-ink)" fontSize="11.5">
        Waktu (P = {formatId(period, 2)} hari, K = {formatId(K, 1)} {unit})
      </text>
      <text x={16} y={padT + pH / 2} textAnchor="middle" transform={`rotate(-90 16 ${padT + pH / 2})`} fill="var(--color-ink)" fontSize="11.5">
        v_r ({unit})
      </text>
    </svg>
  )
}

// ---------------------------------------------------------------------------
// 9. SPECTRUM (continuum + absorption/emission lines)
// ---------------------------------------------------------------------------
export function SpectrumVisual({ params }: { params: Params }) {
  const lambdaMin = num(params.lambdaMin, 400)
  const lambdaMax = num(params.lambdaMax, 700)
  const shiftZ = num(params.shiftZ, 0)
  const rawLines = Array.isArray(params.lines) ? params.lines : []
  const lines = rawLines
    .filter((l): l is Record<string, unknown> => Boolean(l && typeof l === 'object'))
    .map((l) => ({
      lambda: num(l.lambda, 500) * (1 + shiftZ),
      strength: num(l.strength, 0.5),
      kind: str(l.kind, 'absorption'),
      label: str(l.label, ''),
    }))

  const W = 540
  const H = 220
  const padL = 52
  const padR = 20
  const padT = 22
  const padB = 42
  const pW = W - padL - padR
  const pH = H - padT - padB
  const mx = (lam: number) => padL + ((lam - lambdaMin) / (lambdaMax - lambdaMin)) * pW
  const my = (flux: number) => padT + pH - flux * (pH * 0.75)

  const pts = Array.from({ length: 180 }, (_, i) => {
    const lam = lambdaMin + (i / 179) * (lambdaMax - lambdaMin)
    let f = 0.78
    for (const ln of lines) {
      const g = Math.exp(-Math.pow((lam - ln.lambda) / 4, 2))
      f += ln.kind === 'emission' ? ln.strength * 0.45 * g : -ln.strength * 0.6 * g
    }
    return `${mx(lam)},${my(Math.max(0.05, Math.min(1.25, f)))}`
  }).join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Profil spektrum terhadap panjang gelombang">
      <rect x={padL} y={padT} width={pW} height={pH} fill="none" stroke="var(--color-faint)" strokeWidth="1.2" />
      <polyline points={pts} fill="none" stroke="var(--color-cyan)" strokeWidth="1.8" />
      {lines.map((ln, i) => (
        <g key={i}>
          <line x1={mx(ln.lambda)} y1={padT} x2={mx(ln.lambda)} y2={padT + pH} stroke="var(--color-amber)" strokeOpacity="0.45" strokeDasharray="3 3" />
          {ln.label && (
            <text x={mx(ln.lambda)} y={padT + 14} textAnchor="middle" fill="var(--color-amber)" fontSize="9.5">
              {ln.label}
            </text>
          )}
        </g>
      ))}
      <text x={padL + pW / 2} y={H - 8} textAnchor="middle" fill="var(--color-ink)" fontSize="11.5">
        Panjang gelombang λ (nm) [{lambdaMin}–{lambdaMax} nm]
      </text>
    </svg>
  )
}

// ---------------------------------------------------------------------------
// 10. BLACKBODY CURVE
// ---------------------------------------------------------------------------
export function BlackbodyCurveVisual({ params }: { params: Params }) {
  const temps = Array.isArray(params.temperatures)
    ? params.temperatures.filter((t): t is number => typeof t === 'number' && t > 0)
    : [3500, 5800, 9000]
  const lMin = num(params.lambdaMinNm, 150)
  const lMax = num(params.lambdaMaxNm, 2000)

  const planck = (lamNm: number, T: number) => {
    const lamM = lamNm * 1e-9
    const c2 = 1.4388e-2
    return 1 / (Math.pow(lamM * 1e6, 5) * (Math.exp(c2 / (lamM * T)) - 1))
  }

  let peakMax = 1e-12
  for (const T of temps) {
    const wien = 2.898e6 / T
    peakMax = Math.max(peakMax, planck(Math.max(lMin, Math.min(lMax, wien)), T))
  }

  const W = 540
  const H = 250
  const padL = 50
  const padR = 20
  const padT = 22
  const padB = 42
  const pW = W - padL - padR
  const pH = H - padT - padB
  const mx = (l: number) => padL + ((l - lMin) / (lMax - lMin)) * pW
  const my = (v: number) => padT + pH - (v / peakMax) * (pH * 0.9)
  const palette = ['var(--color-korall)', 'var(--color-amber)', 'var(--color-cyan)', 'var(--color-ungu)']

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Kurva radiasi benda hitam Planck">
      <rect x={padL} y={padT} width={pW} height={pH} fill="none" stroke="var(--color-faint)" strokeWidth="1.2" />
      <rect x={mx(380)} y={padT} width={Math.max(2, mx(750) - mx(380))} height={pH} fill="var(--color-ungu)" fillOpacity="0.1" />
      {temps.map((T, idx) => {
        const color = palette[idx % palette.length]
        const pts = Array.from({ length: 100 }, (_, i) => {
          const l = lMin + (i / 99) * (lMax - lMin)
          return `${mx(l)},${my(planck(l, T))}`
        }).join(' ')
        const lamPeak = 2.898e6 / T
        return (
          <g key={T}>
            <polyline points={pts} fill="none" stroke={color} strokeWidth="2" />
            {lamPeak >= lMin && lamPeak <= lMax && (
              <circle cx={mx(lamPeak)} cy={my(planck(lamPeak, T))} r="3.5" fill={color} />
            )}
            <text x={padL + pW - 8} y={padT + 18 + idx * 15} textAnchor="end" fill={color} fontSize="11" className="tabular-nums">
              T = {T} K (λ_max ≈ {Math.round(lamPeak)} nm)
            </text>
          </g>
        )
      })}
      <text x={padL + pW / 2} y={H - 8} textAnchor="middle" fill="var(--color-ink)" fontSize="11.5">
        Panjang gelombang λ (nm)
      </text>
    </svg>
  )
}

// ---------------------------------------------------------------------------
// 11. ORBIT DIAGRAM
// ---------------------------------------------------------------------------
export function OrbitDiagramVisual({ params }: { params: Params }) {
  const e = Math.max(0, Math.min(0.88, num(params.eccentricity, 0.45)))
  const aLabel = str(params.aLabel, 'a')
  const showFoci = bool(params.showFoci, true)
  const bodyLabel = str(params.bodyLabel, 'Planet')
  const focusLabel = str(params.focusLabel, 'Matahari')

  const cx = 240
  const cy = 120
  const aPx = 155
  const bPx = aPx * Math.sqrt(1 - e * e)
  const cPx = aPx * e

  return (
    <svg viewBox="0 0 480 240" className="w-full" role="img" aria-label="Diagram orbit elips Kepler">
      <ellipse cx={cx} cy={cy} rx={aPx} ry={bPx} fill="none" stroke="var(--color-cyan)" strokeWidth="2" />
      <line x1={cx - aPx} y1={cy} x2={cx + aPx} y2={cy} stroke="var(--color-line)" strokeDasharray="4 4" />
      {showFoci && (
        <>
          <circle cx={cx - cPx} cy={cy} r="7" fill="var(--color-amber)" />
          <text x={cx - cPx} y={cy + 20} textAnchor="middle" fill="var(--color-amber)" fontSize="11">{focusLabel}</text>
          <circle cx={cx + cPx} cy={cy} r="3" fill="var(--color-faint)" />
        </>
      )}
      <circle cx={cx + aPx * 0.55} cy={cy - bPx * Math.sqrt(1 - 0.55 * 0.55)} r="5" fill="var(--color-hijau)" />
      <text x={cx + aPx * 0.55 + 8} y={cy - bPx * 0.84 - 4} fill="var(--color-hijau)" fontSize="11">{bodyLabel}</text>
      <text x={cx - aPx - 6} y={cy - 8} textAnchor="end" fill="var(--color-muted)" fontSize="10.5">r_p = {aLabel}(1−e)</text>
      <text x={cx + aPx + 6} y={cy - 8} fill="var(--color-muted)" fontSize="10.5">r_a = {aLabel}(1+e)</text>
      <text x={cx} y={224} textAnchor="middle" fill="var(--color-faint)" fontSize="11" className="tabular-nums">
        Eksentrisitas e = {formatId(e, 2)} · setengah sumbu besar {aLabel}
      </text>
    </svg>
  )
}

// ---------------------------------------------------------------------------
// 12. SKY MAP
// ---------------------------------------------------------------------------
export function SkyMapVisual({ params }: { params: Params }) {
  const title = str(params.title, 'Peta koordinat langit lokal')
  const rawStars = Array.isArray(params.stars) ? params.stars : []
  const stars = rawStars
    .filter((s): s is Record<string, unknown> => Boolean(s && typeof s === 'object'))
    .map((s) => ({
      name: str(s.name, '★'),
      azDeg: num(s.azDeg, 180),
      altDeg: num(s.altDeg, 45),
    }))
  const cx = 160
  const cy = 145
  const R = 115

  return (
    <svg viewBox="0 0 320 295" className="mx-auto w-full max-w-[330px]" role="img" aria-label={title}>
      <circle cx={cx} cy={cy} r={R} fill="var(--color-surface)" fillOpacity="0.5" stroke="var(--color-cyan)" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={R * 0.67} fill="none" stroke="var(--color-line)" strokeDasharray="3 3" />
      <circle cx={cx} cy={cy} r={R * 0.33} fill="none" stroke="var(--color-line)" strokeDasharray="3 3" />
      <line x1={cx - R} y1={cy} x2={cx + R} y2={cy} stroke="var(--color-line)" strokeWidth="1" />
      <line x1={cx} y1={cy - R} x2={cx} y2={cy + R} stroke="var(--color-line)" strokeWidth="1" />
      <text x={cx} y={cy - R - 8} textAnchor="middle" fill="var(--color-ink)" fontSize="11.5" fontWeight="600">U (0°)</text>
      <text x={cx + R + 12} y={cy + 4} fill="var(--color-ink)" fontSize="11.5" fontWeight="600">T (90°)</text>
      <text x={cx} y={cy + R + 16} textAnchor="middle" fill="var(--color-ink)" fontSize="11.5" fontWeight="600">S (180°)</text>
      <text x={cx - R - 12} y={cy + 4} textAnchor="end" fill="var(--color-ink)" fontSize="11.5" fontWeight="600">B (270°)</text>
      <circle cx={cx} cy={cy} r="2.5" fill="var(--color-faint)" />
      {stars.map((s, i) => {
        const r = R * (1 - Math.max(0, Math.min(90, s.altDeg)) / 90)
        const rad = ((s.azDeg - 90) * Math.PI) / 180
        const x = cx + r * Math.cos(rad)
        const y = cy + r * Math.sin(rad)
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="4.5" fill="var(--color-amber)" />
            <text x={x + 7} y={y + 3} fill="var(--color-amber)" fontSize="10.5" className="tabular-nums">
              {s.name} ({s.altDeg}°)
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ---------------------------------------------------------------------------
// 13-20. COMPACT PARAMETRIC ASTROPHYSICS RENDERERS
// ---------------------------------------------------------------------------
export function ColorColorDiagramVisual({ params }: { params: Params }) {
  const ebv = num(params.ebv, 0.3)
  const stars = Array.isArray(params.stars) ? (params.stars as { name?: string; bv: number; ub: number }[]) : []
  const W = 460
  const H = 250
  const padL = 56
  const padB = 42
  const pW = W - padL - 24
  const pH = H - 24 - padB
  const mx = (bv: number) => padL + ((bv + 0.4) / 2.2) * pW
  const my = (ub: number) => 24 + ((ub + 1.2) / 2.4) * pH // inverted UV up
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Diagram dua warna U-B vs B-V">
      <rect x={padL} y="24" width={pW} height={pH} fill="none" stroke="var(--color-faint)" strokeWidth="1.2" />
      <path d={`M ${mx(-0.3)} ${my(-1.1)} Q ${mx(0.2)} ${my(0.1)} ${mx(1.4)} ${my(1.1)}`} fill="none" stroke="var(--color-ungu)" strokeWidth="2" />
      <line x1={mx(0.1)} y1={my(-0.1)} x2={mx(0.1 + ebv)} y2={my(-0.1 + 0.72 * ebv)} stroke="var(--color-korall)" strokeWidth="2" />
      <text x={mx(0.1 + ebv) + 6} y={my(-0.1 + 0.72 * ebv)} fill="var(--color-korall)" fontSize="10.5">E(B−V) = {formatId(ebv, 2)}</text>
      {stars.map((s, i) => (
        <g key={i}>
          <circle cx={mx(s.bv)} cy={my(s.ub)} r="4" fill="var(--color-cyan)" />
          {s.name && <text x={mx(s.bv) + 6} y={my(s.ub)} fill="var(--color-ink)" fontSize="10">{s.name}</text>}
        </g>
      ))}
      <text x={padL + pW / 2} y={H - 8} textAnchor="middle" fill="var(--color-ink)" fontSize="11.5">B − V (mag)</text>
      <text x={18} y={24 + pH / 2} textAnchor="middle" transform={`rotate(-90 18 ${24 + pH / 2})`} fill="var(--color-ink)" fontSize="11.5">U − B (mag)</text>
    </svg>
  )
}

export function PhaseFoldVisual({ params }: { params: Params }) {
  const period = num(params.period, 3.2)
  const amp = num(params.amp, 0.4)
  const W = 500
  const H = 220
  const padL = 52
  const pW = W - padL - 24
  const pH = H - 62
  const mx = (ph: number) => padL + (ph / 2) * pW
  const my = (m: number) => 22 + ((m + amp * 1.4) / (amp * 2.8)) * pH
  const pts = Array.from({ length: 100 }, (_, i) => {
    const ph = (i / 99) * 2
    const val = -amp * Math.cos(2 * Math.PI * ph)
    return `${mx(ph)},${my(val)}`
  }).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Kurva cahaya terlipat fase">
      <rect x={padL} y="22" width={pW} height={pH} fill="none" stroke="var(--color-faint)" strokeWidth="1.2" />
      <polyline points={pts} fill="none" stroke="var(--color-cyan)" strokeWidth="2" />
      <text x={padL + pW / 2} y={H - 8} textAnchor="middle" fill="var(--color-ink)" fontSize="11.5">
        Fase φ (P = {formatId(period, 2)} hari)
      </text>
    </svg>
  )
}

export function RotCurveVisual({ params }: { params: Params }) {
  const vFlat = num(params.vFlat, 220)
  const rCore = num(params.rCore, 5)
  const W = 500
  const H = 220
  const padL = 56
  const pW = W - padL - 24
  const pH = H - 62
  const mx = (r: number) => padL + (r / 30) * pW
  const my = (v: number) => 22 + pH - (v / (vFlat * 1.3)) * pH
  const obsPts = Array.from({ length: 60 }, (_, i) => {
    const r = 0.5 + (i / 59) * 29.5
    const v = vFlat * (1 - Math.exp(-r / rCore))
    return `${mx(r)},${my(v)}`
  }).join(' ')
  const kepPts = Array.from({ length: 60 }, (_, i) => {
    const r = 0.5 + (i / 59) * 29.5
    const v = r < rCore ? (vFlat * 0.85 * r) / rCore : vFlat * 0.85 * Math.sqrt(rCore / r)
    return `${mx(r)},${my(v)}`
  }).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Kurva rotasi galaksi">
      <rect x={padL} y="22" width={pW} height={pH} fill="none" stroke="var(--color-faint)" strokeWidth="1.2" />
      <polyline points={obsPts} fill="none" stroke="var(--color-cyan)" strokeWidth="2.2" />
      <polyline points={kepPts} fill="none" stroke="var(--color-amber)" strokeWidth="1.6" strokeDasharray="5 4" />
      <text x={padL + pW - 8} y={my(vFlat) - 8} textAnchor="end" fill="var(--color-cyan)" fontSize="10.5">Teramati (v ≈ {vFlat} km/s)</text>
      <text x={padL + pW - 8} y={my(vFlat * 0.35)} textAnchor="end" fill="var(--color-amber)" fontSize="10.5">Keplerian (barion saja)</text>
      <text x={padL + pW / 2} y={H - 8} textAnchor="middle" fill="var(--color-ink)" fontSize="11.5">Jarak galactocentric R (kpc)</text>
    </svg>
  )
}

export function HubbleDiagramVisual({ params }: { params: Params }) {
  const H0 = num(params.H0, 70)
  const maxD = num(params.maxD, 400)
  const W = 500
  const H = 230
  const padL = 62
  const pW = W - padL - 24
  const pH = H - 64
  const mx = (d: number) => padL + (d / maxD) * pW
  const my = (v: number) => 22 + pH - (v / (H0 * maxD * 1.1)) * pH
  const rand = seededNoise(H0)
  const pts = Array.from({ length: 12 }, (_, i) => {
    const d = (i + 1) * (maxD / 13)
    const v = H0 * d + rand() * H0 * 30
    return { d, v }
  })
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Diagram Hubble v terhadap d">
      <rect x={padL} y="22" width={pW} height={pH} fill="none" stroke="var(--color-faint)" strokeWidth="1.2" />
      <line x1={mx(0)} y1={my(0)} x2={mx(maxD)} y2={my(H0 * maxD)} stroke="var(--color-ungu)" strokeWidth="2" />
      {pts.map((p, i) => (
        <circle key={i} cx={mx(p.d)} cy={my(p.v)} r="3.5" fill="var(--color-cyan)" />
      ))}
      <text x={padL + pW - 8} y={38} textAnchor="end" fill="var(--color-ungu)" fontSize="11">H₀ = {H0} km/s/Mpc</text>
      <text x={padL + pW / 2} y={H - 8} textAnchor="middle" fill="var(--color-ink)" fontSize="11.5">Jarak d (Mpc)</text>
    </svg>
  )
}

export function FilterCurvesVisual({ params }: { params: Params }) {
  const filters = [
    { name: 'U', peak: 365, width: 34, color: 'var(--color-ungu)' },
    { name: 'B', peak: 445, width: 45, color: 'var(--color-cyan)' },
    { name: 'V', peak: 551, width: 44, color: 'var(--color-hijau)' },
    { name: 'R', peak: 658, width: 65, color: 'var(--color-amber)' },
    { name: 'I', peak: 806, width: 70, color: 'var(--color-korall)' },
  ]
  const highlight = str(params.highlight, '')
  const W = 520
  const H = 210
  const padL = 46
  const pW = W - padL - 20
  const pH = H - 62
  const mx = (l: number) => padL + ((l - 280) / 680) * pW
  const my = (t: number) => 20 + pH - t * (pH * 0.9)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Kurva transmisi filter UBVRI">
      <rect x={padL} y="20" width={pW} height={pH} fill="none" stroke="var(--color-faint)" strokeWidth="1.2" />
      {filters.map((f) => {
        const pts = Array.from({ length: 80 }, (_, i) => {
          const l = 280 + (i / 79) * 680
          const val = Math.exp(-Math.pow((l - f.peak) / f.width, 2))
          return `${mx(l)},${my(val)}`
        }).join(' ')
        return (
          <g key={f.name}>
            <polyline points={pts} fill="none" stroke={f.color} strokeWidth={highlight === f.name ? '2.8' : '1.7'} />
            <text x={mx(f.peak)} y={my(1.03)} textAnchor="middle" fill={f.color} fontSize="11" fontWeight="600">{f.name}</text>
          </g>
        )
      })}
      <text x={padL + pW / 2} y={H - 8} textAnchor="middle" fill="var(--color-ink)" fontSize="11.5">Panjang gelombang λ (nm)</text>
    </svg>
  )
}

export function AiryDiskVisual({ params }: { params: Params }) {
  const separationRatio = num(params.separationRatio, 1.0) // in units of 1.22 lambda/D
  const W = 500
  const H = 210
  const padL = 46
  const pW = W - padL - 20
  const pH = H - 60
  const sinc2 = (x: number) => (Math.abs(x) < 1e-4 ? 1 : Math.pow(Math.sin(x) / x, 2))
  const mx = (u: number) => padL + ((u + 4) / 8) * pW
  const my = (y: number) => 20 + pH - y * (pH * 0.85)
  const sep = separationRatio * 3.1416
  const c1 = Array.from({ length: 120 }, (_, i) => {
    const u = -4 + (i / 119) * 8
    return `${mx(u)},${my(sinc2(u * 2.5 + sep * 0.5))}`
  }).join(' ')
  const c2 = Array.from({ length: 120 }, (_, i) => {
    const u = -4 + (i / 119) * 8
    return `${mx(u)},${my(sinc2(u * 2.5 - sep * 0.5))}`
  }).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Profil intensitas difraksi Airy dua sumber">
      <rect x={padL} y="20" width={pW} height={pH} fill="none" stroke="var(--color-faint)" strokeWidth="1.2" />
      <polyline points={c1} fill="none" stroke="var(--color-cyan)" strokeWidth="1.8" />
      <polyline points={c2} fill="none" stroke="var(--color-amber)" strokeWidth="1.8" strokeDasharray="4 3" />
      <text x={padL + pW / 2} y={H - 8} textAnchor="middle" fill="var(--color-ink)" fontSize="11.5">
        Pemisahan sudut Δθ = {formatId(separationRatio, 2)} × θ_Rayleigh
      </text>
    </svg>
  )
}

export function CmdDiagramVisual({ params }: { params: Params }) {
  const turnoffV = num(params.turnoffV, 16.5)
  const turnoffBv = num(params.turnoffBv, 0.45)
  const W = 460
  const H = 240
  const padL = 52
  const pW = W - padL - 20
  const pH = H - 62
  const mx = (bv: number) => padL + ((bv + 0.3) / 1.9) * pW
  const my = (v: number) => 20 + ((v - 11) / 11) * pH
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Diagram Warna-Magnitudo gugus bintang">
      <rect x={padL} y="20" width={pW} height={pH} fill="none" stroke="var(--color-faint)" strokeWidth="1.2" />
      <path
        d={`M ${mx(turnoffBv + 0.55)} ${my(turnoffV + 4.5)} L ${mx(turnoffBv)} ${my(turnoffV)} Q ${mx(turnoffBv + 0.45)} ${my(turnoffV - 1.2)} ${mx(turnoffBv + 0.8)} ${my(turnoffV - 3.5)}`}
        fill="none"
        stroke="var(--color-ungu)"
        strokeWidth="2.2"
      />
      <circle cx={mx(turnoffBv)} cy={my(turnoffV)} r="5" fill="var(--color-amber)" />
      <text x={mx(turnoffBv) - 8} y={my(turnoffV) - 10} textAnchor="end" fill="var(--color-amber)" fontSize="10.5">
        Turnoff (B−V={formatId(turnoffBv, 2)}, V={formatId(turnoffV, 1)})
      </text>
      <text x={padL + pW / 2} y={H - 8} textAnchor="middle" fill="var(--color-ink)" fontSize="11.5">B − V (mag)</text>
      <text x={18} y={20 + pH / 2} textAnchor="middle" transform={`rotate(-90 18 ${20 + pH / 2})`} fill="var(--color-ink)" fontSize="11.5">V (mag)</text>
    </svg>
  )
}

export function EnergyLevelVisual({ params }: { params: Params }) {
  const Z = num(params.Z, 1)
  const maxN = Math.max(3, Math.min(6, num(params.maxN, 4)))
  const levels = Array.from({ length: maxN }, (_, i) => {
    const n = i + 1
    return { n, e: (-13.6 * Z * Z) / (n * n) }
  })
  const eMin = levels[0].e
  const W = 440
  const H = 230
  const my = (e: number) => 28 + ((-e) / Math.abs(eMin)) * 175
  const fromN = num(params.fromN, 3)
  const toN = num(params.toN, 2)
  const yFrom = my((-13.6 * Z * Z) / (fromN * fromN))
  const yTo = my((-13.6 * Z * Z) / (toN * toN))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[460px]" role="img" aria-label="Diagram tingkat energi atom">
      {levels.map((lv) => (
        <g key={lv.n}>
          <line x1="56" y1={my(lv.e)} x2="310" y2={my(lv.e)} stroke="var(--color-cyan)" strokeWidth="1.5" />
          <text x="322" y={my(lv.e) + 4} fill="var(--color-muted)" fontSize="11" className="tabular-nums">
            n={lv.n} ({formatId(lv.e, 2)} eV)
          </text>
        </g>
      ))}
      <line x1="180" y1={yFrom} x2="180" y2={yTo} stroke="var(--color-amber)" strokeWidth="2.2" />
      <text x="190" y={(yFrom + yTo) / 2} fill="var(--color-amber)" fontSize="11">
        n={fromN} → n={toN}
      </text>
    </svg>
  )
}
