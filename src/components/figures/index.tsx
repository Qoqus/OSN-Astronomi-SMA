import type { ComponentType } from 'react'
import type { MediaParametrik } from '@/schemas/visual'
import { VisualParametrik } from '@/components/visuals'
import { GAMBAR_SET, META_GAMBAR, type GambarId } from './daftar'
import {
  SkalaLog, KeplerLogLog, OrbitLingkaranRasio, PolaAiry, TingkatEnergiHidrogen,
  LingkaranSatuan, SegitigaVektor,
} from './fondasi'
import {
  ParalaksTahunan, BolaLangit, SegitigaBola, FaseBulan, GerhanaGeometri, ElipsOrbit,
  TransferHohmann, WarnaSuhu, KurvaBendaHitam, SpektrumAbsorpsi, SpektrumEmisi,
  TanggaMagnitudo, ModulusJarakGrafik, KurvaTransit, SkalaTataSurya, Refraktor,
} from './inti'
import {
  HrSkematis, HrIsoRadius, HrEvolusi, KurvaGerhana, KurvaKecepatanRadial, KurvaRotasi,
  LensaGravitasi, EkspansiRedshift, HubbleDiagram, KurvaTransitData, KurvaCahayaVariabel,
  DopplerGeser,
} from './lanjutan'

export const petaGambar: Record<GambarId, ComponentType> = {
  'skala-log': SkalaLog,
  'kepler-loglog': KeplerLogLog,
  'orbit-lingkaran-rasio': OrbitLingkaranRasio,
  'pola-airy': PolaAiry,
  'tingkat-energi-hidrogen': TingkatEnergiHidrogen,
  'lingkaran-satuan': LingkaranSatuan,
  'segitiga-vektor': SegitigaVektor,
  'paralaks-tahunan': ParalaksTahunan,
  'bola-langit': BolaLangit,
  'segitiga-bola': SegitigaBola,
  'fase-bulan': FaseBulan,
  'gerhana-geometri': GerhanaGeometri,
  'elips-orbit': ElipsOrbit,
  'transfer-hohmann': TransferHohmann,
  'warna-suhu': WarnaSuhu,
  'kurva-benda-hitam': KurvaBendaHitam,
  'spektrum-absorpsi': SpektrumAbsorpsi,
  'spektrum-emisi': SpektrumEmisi,
  'tangga-magnitudo': TanggaMagnitudo,
  'modulus-jarak-grafik': ModulusJarakGrafik,
  'kurva-transit': KurvaTransit,
  'skala-tata-surya': SkalaTataSurya,
  refraktor: Refraktor,
  'hr-skematis': HrSkematis,
  'hr-iso-radius': HrIsoRadius,
  'hr-evolusi': HrEvolusi,
  'kurva-gerhana': KurvaGerhana,
  'kurva-kecepatan-radial': KurvaKecepatanRadial,
  'kurva-rotasi': KurvaRotasi,
  'lensa-gravitasi': LensaGravitasi,
  'ekspansi-redshift': EkspansiRedshift,
  'hubble-diagram': HubbleDiagram,
  'kurva-transit-data': KurvaTransitData,
  'kurva-cahaya-variabel': KurvaCahayaVariabel,
  'doppler-geser': DopplerGeser,
}

export function adalahGambarId(id: string): id is GambarId {
  return GAMBAR_SET.has(id)
}

export function Gambar({
  id,
  judul,
  caption,
}: {
  id: string
  judul?: string
  caption?: string
}) {
  if (!adalahGambarId(id)) return null
  const Komponen = petaGambar[id]
  const meta = META_GAMBAR[id]
  return (
    <figure className="not-prose my-6 rounded-[14px] border border-line bg-sunken/40 p-4">
      <p className="mb-2 text-[12px] font-medium text-faint">{judul ?? meta.judul}</p>
      <div className="flex justify-center">
        <Komponen />
      </div>
      {(caption ?? meta.caption) && (
        <figcaption className="mt-2 text-[13px] leading-relaxed text-muted">
          {caption ?? meta.caption}
        </figcaption>
      )}
    </figure>
  )
}

export function FigureSoal({
  id,
  media,
  caption,
}: {
  id?: string
  media?: MediaParametrik
  caption?: string
}) {
  if (media) {
    return <VisualParametrik media={media} caption={caption ?? media.caption} mode="kuis" />
  }
  if (!id || !adalahGambarId(id)) return null
  const Komponen = petaGambar[id]
  const meta = META_GAMBAR[id]
  return (
    <figure className="my-4 rounded-[14px] border border-line bg-sunken/50 p-3.5">
      <div className="flex justify-center">
        <Komponen />
      </div>
      <figcaption className="mt-2 text-center text-[12.5px] leading-relaxed text-faint">
        {caption ?? meta.judul}
      </figcaption>
    </figure>
  )
}