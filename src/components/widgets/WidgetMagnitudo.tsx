import { useState } from 'react'
import {
  fluks, magnitudoAbsolutDariL, magnitudoSemu, modulusJarak,
} from '@/lib/fisika'
import { TeksMath } from '@/components/ui/TeksMath'
import { PanelKontrol, Slider, Toggle, TombolReset, Nilai, Preset } from './kontrol'

const PRESET = [
  { nama: 'Matahari @10pc', d: 10, L: 1, Av: 0 },
  { nama: 'Sirius', d: 2.64, L: 25.4, Av: 0 },
  { nama: 'Betelgeuse', d: 200, L: 126000, Av: 0.5 },
  { nama: 'Bintang jauh', d: 1000, L: 100, Av: 1.5 },
]

function fmtF(F: number) {
  return F.toExponential(2).replace('e-', 'e−').replace('e+', 'e')
}

export function WidgetMagnitudo() {
  const [d, setD] = useState(10)
  const [L, setL] = useState(1)
  const [Av, setAv] = useState(0)
  const [pembanding, setPembanding] = useState(true)
  const [skala, setSkala] = useState(true)

  const M = magnitudoAbsolutDariL(L)
  const mod = modulusJarak(d)
  const m = magnitudoSemu(M, d, Av)
  const F = fluks(L, d)

  const terang = Math.min(1, Math.max(0.06, (13 - m) / 16))
  const glowR = 12 + terang * 40
  const presetAktif = PRESET.find((p) => Math.abs(p.d - d) < 0.5 && Math.abs(p.L - L) / p.L < 0.02 && Math.abs(p.Av - Av) < 0.05)

  const mPembanding = magnitudoSemu(magnitudoAbsolutDariL(1), 10, 0)
  const terangBanding = Math.min(1, Math.max(0.06, (13 - mPembanding) / 16))

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div className="rounded-[14px] border border-line bg-sunken/50 p-2">
        <svg viewBox="0 0 440 280" className="w-full" role="img"
          aria-label={`Playground magnitudo: jarak ${d.toFixed(0)} pc, magnitudo semu ${m.toFixed(2)}, magnitudo absolut ${M.toFixed(2)}`}>
          <defs>
            <radialGradient id="glowMag">
              <stop offset="0%" stopColor="var(--color-amber)" stopOpacity="0.9" />
              <stop offset="45%" stopColor="var(--color-amber)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--color-amber)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx="120" cy="110" r={glowR} fill="url(#glowMag)" />
          <circle cx="120" cy="110" r={5 + terang * 7} fill="var(--color-ink)" />
          <text x="120" y={110 + glowR + 16} textAnchor="middle" fill="var(--color-amber)" fontSize="10">
            m = {m.toFixed(2)}
          </text>
          <text x="120" y="40" textAnchor="middle" fill="var(--color-muted)" fontSize="9">
            L = {L >= 1000 ? L.toExponential(1) : L.toFixed(2)} L☉ · Aᵥ = {Av.toFixed(1)}
          </text>

          {pembanding && (
            <g>
              <circle cx="330" cy="110" r={12 + terangBanding * 40} fill="url(#glowMag)" opacity="0.6" />
              <circle cx="330" cy="110" r={5 + terangBanding * 7} fill="var(--color-muted)" />
              <text x="330" y={110 + 12 + terangBanding * 40 + 16} textAnchor="middle" fill="var(--color-faint)" fontSize="9">
                pembanding m = {mPembanding.toFixed(1)}
              </text>
              <text x="330" y="40" textAnchor="middle" fill="var(--color-faint)" fontSize="9">Matahari @ 10 pc</text>
            </g>
          )}

          <line x1="60" y1="210" x2="380" y2="210" stroke="var(--color-faint)" strokeWidth="1.2" />
          <line x1="120" y1="204" x2="120" y2="216" stroke="var(--color-cyan)" strokeWidth="1.4" />
          <text x="120" y="232" textAnchor="middle" fill="var(--color-cyan)" fontSize="9">bintang</text>
          <text x="380" y="232" textAnchor="end" fill="var(--color-muted)" fontSize="9">pengamat</text>
          <circle cx="380" cy="210" r="4" fill="var(--color-info)" />
          <text x="250" y="204" textAnchor="middle" fill="var(--color-muted)" fontSize="10">
            d = {d >= 100 ? d.toFixed(0) : d.toFixed(1)} pc
          </text>

          {skala && (
            <g>
              <text x="60" y="258" fill="var(--color-faint)" fontSize="8">terang</text>
              <rect x="95" y="250" width="250" height="7" rx="3.5" fill="var(--color-line)" />
              <rect x="95" y="250" width={Math.min(250, Math.max(4, terang * 250))} height="7" rx="3.5" fill="var(--color-amber)" />
              <text x="352" y="258" fill="var(--color-faint)" fontSize="8">redup</text>
            </g>
          )}
        </svg>
      </div>

      <PanelKontrol className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {PRESET.map((p) => (
            <Preset key={p.nama} label={p.nama} aktif={presetAktif?.nama === p.nama}
              onClick={() => { setD(p.d); setL(p.L); setAv(p.Av) }} />
          ))}
        </div>
        <Slider label="Jarak" value={Math.log10(d)} min={0} max={3} step={0.01} accent="var(--color-cyan)"
          format={() => `${d >= 100 ? d.toFixed(0) : d.toFixed(1)} pc`} onChange={(v) => setD(10 ** v)} />
        <Slider label="Luminositas" value={Math.log10(L)} min={-2} max={4} step={0.02} accent="var(--color-amber)"
          format={() => `${L >= 1000 ? L.toExponential(1) : L.toFixed(2)} L☉`} onChange={(v) => setL(10 ** v)} />
        <Slider label="Ekstingsi Aᵥ" value={Av} min={0} max={3} step={0.05} accent="var(--color-korall)"
          format={(n) => `${n.toFixed(2)} mag`} onChange={setAv} />
        <div className="space-y-0.5 border-t border-line pt-2">
          <Toggle label="Bintang pembanding" checked={pembanding} onChange={setPembanding} />
          <Toggle label="Skala terang" checked={skala} accent="var(--color-amber)" onChange={setSkala} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Nilai label="Magnitudo semu m" nilai={m.toFixed(2)} accent="var(--color-amber)" />
          <Nilai label="Magnitudo absolut M" nilai={M.toFixed(2)} accent="var(--color-cyan)" />
          <Nilai label="Modulus m−M" nilai={mod.toFixed(2)} accent="var(--color-magenta)" />
          <Nilai label="Fluks" nilai={fmtF(F)} satuan="W/m²" accent="var(--color-hijau)" />
        </div>
        <p className="rounded-[10px] border border-line bg-surface px-3 py-2 text-[13px] text-muted">
          <TeksMath teks={`$m = M + 5\\log_{10}(d/10) + A_v$ = ${m.toFixed(2)}`} />
        </p>
        <TombolReset onClick={() => { setD(10); setL(1); setAv(0); setPembanding(true); setSkala(true) }} />
      </PanelKontrol>
    </div>
  )
}