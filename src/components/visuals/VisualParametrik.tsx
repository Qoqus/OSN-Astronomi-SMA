import type { MediaParametrik, TipeVisual } from '@/schemas/visual'
import { TeksMath } from '@/components/ui/TeksMath'
import {
  DataTableParametrik,
  LinearizationPlot,
  LogScaleBar,
  PzsTriangleVisual,
  SchematicVisual,
} from './VisualFondasi'
import {
  AiryDiskVisual,
  BlackbodyCurveVisual,
  CmdDiagramVisual,
  ColorColorDiagramVisual,
  EnergyLevelVisual,
  FilterCurvesVisual,
  HrDiagramVisual,
  HubbleDiagramVisual,
  LightCurveVisual,
  OrbitDiagramVisual,
  PhaseFoldVisual,
  RotCurveVisual,
  RvCurveVisual,
  SkyMapVisual,
  SpectrumVisual,
} from './VisualAstrofisika'

const LABEL_TIPE: Record<TipeVisual, string> = {
  hr_diagram: 'Diagram H–R',
  light_curve: 'Kurva cahaya',
  rv_curve: 'Kurva kecepatan radial',
  spectrum: 'Spektrum',
  blackbody_curve: 'Kurva benda hitam',
  color_color_diagram: 'Diagram dua warna',
  orbit_diagram: 'Diagram orbit',
  pzs_triangle: 'Segitiga bola P–Z–S',
  sky_map: 'Peta langit',
  phase_fold: 'Pelipatan fase',
  data_table: 'Tabel data pengamatan',
  log_scale_bar: 'Skala logaritmik',
  linearization_plot: 'Plot linearisasi & galat',
  rot_curve: 'Kurva rotasi galaksi',
  hubble_diagram: 'Diagram Hubble',
  filter_curves: 'Kurva filter fotometri',
  airy_disk: 'Pola difraksi Airy',
  cmd_diagram: 'Diagram warna–magnitudo',
  energy_level: 'Tingkat energi atom',
  schematic: 'Skema geometris',
}

function renderVisual(type: TipeVisual, params: Record<string, unknown>, interactive: boolean) {
  switch (type) {
    case 'log_scale_bar':
      return <LogScaleBar params={params} interactive={interactive} />
    case 'data_table':
      return <DataTableParametrik params={params} />
    case 'linearization_plot':
      return <LinearizationPlot params={params} interactive={interactive} />
    case 'pzs_triangle':
      return <PzsTriangleVisual params={params} interactive={interactive} />
    case 'schematic':
      return <SchematicVisual params={params} interactive={interactive} />
    case 'hr_diagram':
      return <HrDiagramVisual params={params} />
    case 'light_curve':
      return <LightCurveVisual params={params} />
    case 'rv_curve':
      return <RvCurveVisual params={params} />
    case 'spectrum':
      return <SpectrumVisual params={params} />
    case 'blackbody_curve':
      return <BlackbodyCurveVisual params={params} />
    case 'color_color_diagram':
      return <ColorColorDiagramVisual params={params} />
    case 'orbit_diagram':
      return <OrbitDiagramVisual params={params} />
    case 'sky_map':
      return <SkyMapVisual params={params} />
    case 'phase_fold':
      return <PhaseFoldVisual params={params} />
    case 'rot_curve':
      return <RotCurveVisual params={params} />
    case 'hubble_diagram':
      return <HubbleDiagramVisual params={params} />
    case 'filter_curves':
      return <FilterCurvesVisual params={params} />
    case 'airy_disk':
      return <AiryDiskVisual params={params} />
    case 'cmd_diagram':
      return <CmdDiagramVisual params={params} />
    case 'energy_level':
      return <EnergyLevelVisual params={params} />
  }
}

export interface PropsVisualParametrik {
  media?: MediaParametrik
  type?: TipeVisual
  params?: Record<string, unknown>
  judul?: string
  caption?: string
  mode?: 'materi' | 'kuis'
}

export function VisualParametrik({
  media,
  type,
  params,
  judul,
  caption,
  mode = 'materi',
}: PropsVisualParametrik) {
  const tipeAktif = media?.type ?? type
  const paramsAktif = media?.params ?? params
  if (!tipeAktif || !paramsAktif) return null

  const judulTampil =
    judul ?? (typeof paramsAktif.title === 'string' ? paramsAktif.title : LABEL_TIPE[tipeAktif])
  const captionTampil = caption ?? media?.caption
  const interaktif = mode === 'materi'

  return (
    <figure className="not-prose my-5 rounded-[14px] border border-line bg-sunken/45 p-4">
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[12px] font-semibold tracking-[0.04em] text-faint">
          {judulTampil}
        </p>
        <span className="text-[11px] font-medium text-cyan/80">
          {LABEL_TIPE[tipeAktif]}
        </span>
      </div>
      <div className="w-full">{renderVisual(tipeAktif, paramsAktif, interaktif)}</div>
      {captionTampil && (
        <figcaption className="mt-3 border-t border-line/60 pt-2.5 text-[13px] leading-relaxed text-muted">
          <span className="font-semibold text-ink/90">Apa yang harus dilihat: </span>
          <TeksMath teks={captionTampil} />
        </figcaption>
      )}
    </figure>
  )
}
