import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { GLOSARIUM_OSN, LEMBAR_RUMUS } from '../../content/memori'
import { useStore } from '@/state/user-store'
import { TeksMath } from '@/components/ui/TeksMath'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'

type TabReferensi = 'rumus' | 'kalkulator' | 'glosarium'
type JenisKalkulator = 'jarak' | 'magnitudo' | 'radiasi' | 'orbit' | 'teleskop'

function formatIlmiah(n: number, digit = 3): string {
  if (!Number.isFinite(n)) return '—'
  if (n === 0) return '0'
  if (Math.abs(n) >= 1e5 || Math.abs(n) < 1e-3) {
    return n.toExponential(digit).replace('.', ',')
  }
  return Number(n.toPrecision(digit + 1))
    .toString()
    .replace('.', ',')
}

function KalkulatorAstronomi() {
  const [alat, setAlat] = useState<JenisKalkulator>('jarak')

  // 1. Jarak & Paralaks
  const [jarakPc, setJarakPc] = useState('10')

  // 2. Magnitudo
  const [deltaM, setDeltaM] = useState('5')
  const [mSemu, setMSemu] = useState('12,5')
  const [mMutlak, setMMutlak] = useState('4,83')
  const [ekstingsiA, setEkstingsiA] = useState('0,4')

  // 3. Radiasi
  const [suhuK, setSuhuK] = useState('5778')
  const [radiusRsun, setRadiusRsun] = useState('1')

  // 4. Orbit
  const [aAu, setAAu] = useState('1')
  const [mTotalMsun, setMTotalMsun] = useState('1')
  const [rSaatAu, setRSaatAu] = useState('1')

  // 5. Teleskop
  const [dCm, setDCm] = useState('20')
  const [lambdaNm, setLambdaNm] = useState('550')
  const [fObjMm, setFObjMm] = useState('2000')
  const [fOkMm, setFOkMm] = useState('25')

  const num = (s: string) => {
    const v = Number(s.trim().replace(',', '.'))
    return Number.isFinite(v) ? v : NaN
  }

  const pc = num(jarakPc)
  const dm = num(deltaM)
  const mVal = num(mSemu)
  const absMVal = num(mMutlak)
  const aVal = num(ekstingsiA)
  const T = num(suhuK)
  const R = num(radiusRsun)
  const aOrb = num(aAu)
  const mTot = num(mTotalMsun)
  const rOrb = num(rSaatAu)
  const Dcm = num(dCm)
  const lam = num(lambdaNm)
  const fObj = num(fObjMm)
  const fOk = num(fOkMm)

  const hasilJarak = useMemo(() => {
    if (!Number.isFinite(pc) || pc <= 0) return null
    return {
      ly: pc * 3.26156,
      au: pc * 206264.8,
      m: pc * 3.0857e16,
      paralaksArcsec: 1 / pc,
    }
  }, [pc])

  const hasilMag = useMemo(() => {
    const rasioFluks = Number.isFinite(dm) ? Math.pow(10, -0.4 * dm) : NaN
    const jarakModulus =
      Number.isFinite(mVal) && Number.isFinite(absMVal) && Number.isFinite(aVal)
        ? Math.pow(10, (mVal - absMVal - aVal + 5) / 5)
        : NaN
    return { rasioFluks, jarakModulus }
  }, [dm, mVal, absMVal, aVal])

  const hasilRadiasi = useMemo(() => {
    if (!Number.isFinite(T) || T <= 0) return null
    const lambdaMaxNm = 2.8978e6 / T
    const lPerLsun =
      Number.isFinite(R) && R > 0 ? Math.pow(R, 2) * Math.pow(T / 5778, 4) : NaN
    return { lambdaMaxNm, lPerLsun }
  }, [T, R])

  const hasilOrbit = useMemo(() => {
    if (!Number.isFinite(aOrb) || aOrb <= 0 || !Number.isFinite(mTot) || mTot <= 0) return null
    const periodeThn = Math.sqrt(Math.pow(aOrb, 3) / mTot)
    // v^2 = G M (2/r - 1/a); untuk 1 M_sun dan r,a dalam AU -> v_Bumi = 29.785 km/s
    const vKmS =
      Number.isFinite(rOrb) && rOrb > 0 && 2 / rOrb - 1 / aOrb >= 0
        ? 29.785 * Math.sqrt(mTot * (2 / rOrb - 1 / aOrb))
        : NaN
    return { periodeThn, periodeHari: periodeThn * 365.25, vKmS }
  }, [aOrb, mTot, rOrb])

  const hasilTeleskop = useMemo(() => {
    if (!Number.isFinite(Dcm) || Dcm <= 0) return null
    const dMeter = Dcm / 100
    const lamMeter = Number.isFinite(lam) && lam > 0 ? lam * 1e-9 : NaN
    const rayleighArcsec = Number.isFinite(lamMeter)
      ? 1.22 * (lamMeter / dMeter) * 206264.8
      : NaN
    const perbesaran =
      Number.isFinite(fObj) && fObj > 0 && Number.isFinite(fOk) && fOk > 0
        ? fObj / fOk
        : NaN
    const fRatio = Number.isFinite(fObj) && fObj > 0 ? fObj / (Dcm * 10) : NaN
    const gainMata = Math.pow((Dcm * 10) / 7, 2)
    return { rayleighArcsec, perbesaran, fRatio, gainMata }
  }, [Dcm, lam, fObj, fOk])

  const alatList: { id: JenisKalkulator; label: string }[] = [
    { id: 'jarak', label: 'Jarak & Paralaks' },
    { id: 'magnitudo', label: 'Pogson & Modulus' },
    { id: 'radiasi', label: 'Wien & Luminositas' },
    { id: 'orbit', label: 'Kepler & Vis-Viva' },
    { id: 'teleskop', label: 'Teleskop & Difraksi' },
  ]

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-1.5 rounded-[12px] border border-line bg-surface p-1.5">
        {alatList.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setAlat(a.id)}
            className={clsx(
              'whitespace-nowrap shrink-0 rounded-[9px] px-3 py-2 text-[13px] font-medium transition',
              alat === a.id
                ? 'bg-ungu text-white'
                : 'text-muted hover:bg-sunken hover:text-ink',
            )}
          >
            {a.label}
          </button>
        ))}
      </div>

      {alat === 'jarak' && (
        <section className="kartu p-5 space-y-4">
          <div>
            <h2 className="text-[1.15rem]">Konverter Jarak &amp; Paralaks</h2>
            <p className="mt-1 text-[13.5px] text-muted">
              Masukkan jarak dalam parsek untuk menghitung tahun cahaya, AU, meter, dan sudut paralaks tahunan.
            </p>
          </div>
          <label className="block max-w-xs">
            <span className="text-[13px] font-medium text-muted">Jarak (parsek / pc)</span>
            <input
              value={jarakPc}
              onChange={(e) => setJarakPc(e.target.value)}
              inputMode="decimal"
              className="mt-1.5 w-full rounded-[10px] border border-line bg-sunken px-3.5 py-2.5 font-mono text-[15px] outline-none focus:border-ungu/60"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-[12px] border border-line bg-sunken/70 p-3.5">
              <p className="text-[12px] text-faint">Tahun cahaya (ly)</p>
              <p className="mt-1 font-mono text-[1.2rem] font-semibold tabular-nums text-cyan">
                {hasilJarak ? formatIlmiah(hasilJarak.ly, 4) : '—'}
              </p>
            </div>
            <div className="rounded-[12px] border border-line bg-sunken/70 p-3.5">
              <p className="text-[12px] text-faint">Satuan Astronomi (AU)</p>
              <p className="mt-1 font-mono text-[1.2rem] font-semibold tabular-nums">
                {hasilJarak ? formatIlmiah(hasilJarak.au, 4) : '—'}
              </p>
            </div>
            <div className="rounded-[12px] border border-line bg-sunken/70 p-3.5">
              <p className="text-[12px] text-faint">Meter (m)</p>
              <p className="mt-1 font-mono text-[1.2rem] font-semibold tabular-nums">
                {hasilJarak ? formatIlmiah(hasilJarak.m, 3) : '—'}
              </p>
            </div>
            <div className="rounded-[12px] border border-line bg-sunken/70 p-3.5">
              <p className="text-[12px] text-faint">Sudut paralaks p (″)</p>
              <p className="mt-1 font-mono text-[1.2rem] font-semibold tabular-nums text-amber">
                {hasilJarak ? `${formatIlmiah(hasilJarak.paralaksArcsec, 4)}″` : '—'}
              </p>
            </div>
          </div>
        </section>
      )}

      {alat === 'magnitudo' && (
        <section className="kartu p-5 space-y-5">
          <div>
            <h2 className="text-[1.15rem]">Fotometri Pogson &amp; Modulus Jarak</h2>
            <p className="mt-1 text-[13.5px] text-muted">
              Hitung perbandingan fluks dari selisih magnitudo serta jarak bintang termasuk ekstingsi debu.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[12px] border border-line bg-sunken/50 p-4 space-y-3">
              <label className="block">
                <span className="text-[13px] font-medium text-muted">Selisih magnitudo (m₁ − m₂)</span>
                <input
                  value={deltaM}
                  onChange={(e) => setDeltaM(e.target.value)}
                  className="mt-1.5 w-full rounded-[10px] border border-line bg-surface px-3.5 py-2 font-mono text-[15px] outline-none focus:border-ungu/60"
                />
              </label>
              <div>
                <p className="text-[12px] text-faint">Rasio fluks F₁ / F₂</p>
                <p className="mt-0.5 font-mono text-[1.25rem] font-semibold tabular-nums text-cyan">
                  {formatIlmiah(hasilMag.rasioFluks, 4)}
                </p>
              </div>
            </div>

            <div className="rounded-[12px] border border-line bg-sunken/50 p-4 space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <label className="block">
                  <span className="text-[12px] text-muted">m semu</span>
                  <input
                    value={mSemu}
                    onChange={(e) => setMSemu(e.target.value)}
                    className="mt-1 w-full rounded-[8px] border border-line bg-surface px-2.5 py-2 font-mono text-[14px] outline-none focus:border-ungu/60"
                  />
                </label>
                <label className="block">
                  <span className="text-[12px] text-muted">M mutlak</span>
                  <input
                    value={mMutlak}
                    onChange={(e) => setMMutlak(e.target.value)}
                    className="mt-1 w-full rounded-[8px] border border-line bg-surface px-2.5 py-2 font-mono text-[14px] outline-none focus:border-ungu/60"
                  />
                </label>
                <label className="block">
                  <span className="text-[12px] text-muted">Ekstingsi A</span>
                  <input
                    value={ekstingsiA}
                    onChange={(e) => setEkstingsiA(e.target.value)}
                    className="mt-1 w-full rounded-[8px] border border-line bg-surface px-2.5 py-2 font-mono text-[14px] outline-none focus:border-ungu/60"
                  />
                </label>
              </div>
              <div>
                <p className="text-[12px] text-faint">Jarak terkoreksi d (parsek)</p>
                <p className="mt-0.5 font-mono text-[1.25rem] font-semibold tabular-nums text-amber">
                  {formatIlmiah(hasilMag.jarakModulus, 4)} pc
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {alat === 'radiasi' && (
        <section className="kartu p-5 space-y-4">
          <div>
            <h2 className="text-[1.15rem]">Benda Hitam: Wien &amp; Stefan–Boltzmann</h2>
            <p className="mt-1 text-[13.5px] text-muted">
              Hitung panjang gelombang puncak emisi dan luminositas bintang relatif terhadap Matahari.
            </p>
          </div>
          <div className="grid max-w-lg gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-[13px] font-medium text-muted">Suhu efektif T (K)</span>
              <input
                value={suhuK}
                onChange={(e) => setSuhuK(e.target.value)}
                className="mt-1.5 w-full rounded-[10px] border border-line bg-sunken px-3.5 py-2.5 font-mono text-[15px] outline-none focus:border-ungu/60"
              />
            </label>
            <label className="block">
              <span className="text-[13px] font-medium text-muted">Jejari bintang (R / R☉)</span>
              <input
                value={radiusRsun}
                onChange={(e) => setRadiusRsun(e.target.value)}
                className="mt-1.5 w-full rounded-[10px] border border-line bg-sunken px-3.5 py-2.5 font-mono text-[15px] outline-none focus:border-ungu/60"
              />
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[12px] border border-line bg-sunken/70 p-3.5">
              <p className="text-[12px] text-faint">Puncak spektrum λ_max (Wien)</p>
              <p className="mt-1 font-mono text-[1.25rem] font-semibold tabular-nums text-cyan">
                {hasilRadiasi ? `${formatIlmiah(hasilRadiasi.lambdaMaxNm, 4)} nm` : '—'}
              </p>
            </div>
            <div className="rounded-[12px] border border-line bg-sunken/70 p-3.5">
              <p className="text-[12px] text-faint">Luminositas relatif (L / L☉)</p>
              <p className="mt-1 font-mono text-[1.25rem] font-semibold tabular-nums text-amber">
                {hasilRadiasi ? `${formatIlmiah(hasilRadiasi.lPerLsun, 4)} L☉` : '—'}
              </p>
            </div>
          </div>
        </section>
      )}

      {alat === 'orbit' && (
        <section className="kartu p-5 space-y-4">
          <div>
            <h2 className="text-[1.15rem]">Orbit Keplerian &amp; Laju Vis-Viva</h2>
            <p className="mt-1 text-[13.5px] text-muted">
              Gunakan satuan praktis AU, tahun, dan massa Matahari (M☉).
            </p>
          </div>
          <div className="grid max-w-2xl gap-3 sm:grid-cols-3">
            <label className="block">
              <span className="text-[13px] font-medium text-muted">Setengah sumbu a (AU)</span>
              <input
                value={aAu}
                onChange={(e) => setAAu(e.target.value)}
                className="mt-1.5 w-full rounded-[10px] border border-line bg-sunken px-3.5 py-2.5 font-mono text-[15px] outline-none focus:border-ungu/60"
              />
            </label>
            <label className="block">
              <span className="text-[13px] font-medium text-muted">Massa total M₁+M₂ (M☉)</span>
              <input
                value={mTotalMsun}
                onChange={(e) => setMTotalMsun(e.target.value)}
                className="mt-1.5 w-full rounded-[10px] border border-line bg-sunken px-3.5 py-2.5 font-mono text-[15px] outline-none focus:border-ungu/60"
              />
            </label>
            <label className="block">
              <span className="text-[13px] font-medium text-muted">Jarak sesaat r (AU)</span>
              <input
                value={rSaatAu}
                onChange={(e) => setRSaatAu(e.target.value)}
                className="mt-1.5 w-full rounded-[10px] border border-line bg-sunken px-3.5 py-2.5 font-mono text-[15px] outline-none focus:border-ungu/60"
              />
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[12px] border border-line bg-sunken/70 p-3.5">
              <p className="text-[12px] text-faint">Periode orbit P (tahun)</p>
              <p className="mt-1 font-mono text-[1.2rem] font-semibold tabular-nums text-cyan">
                {hasilOrbit ? `${formatIlmiah(hasilOrbit.periodeThn, 4)} thn` : '—'}
              </p>
            </div>
            <div className="rounded-[12px] border border-line bg-sunken/70 p-3.5">
              <p className="text-[12px] text-faint">Periode orbit P (hari)</p>
              <p className="mt-1 font-mono text-[1.2rem] font-semibold tabular-nums">
                {hasilOrbit ? `${formatIlmiah(hasilOrbit.periodeHari, 4)} hr` : '—'}
              </p>
            </div>
            <div className="rounded-[12px] border border-line bg-sunken/70 p-3.5">
              <p className="text-[12px] text-faint">Kelajuan orbit v (km/s)</p>
              <p className="mt-1 font-mono text-[1.2rem] font-semibold tabular-nums text-amber">
                {hasilOrbit && Number.isFinite(hasilOrbit.vKmS)
                  ? `${formatIlmiah(hasilOrbit.vKmS, 4)} km/s`
                  : 'r harus ≤ 2a'}
              </p>
            </div>
          </div>
        </section>
      )}

      {alat === 'teleskop' && (
        <section className="kartu p-5 space-y-4">
          <div>
            <h2 className="text-[1.15rem]">Optik Teleskop &amp; Batas Difraksi</h2>
            <p className="mt-1 text-[13.5px] text-muted">
              Hitung batas Rayleigh, perbesaran sudut, rasio fokus, dan daya kumpul cahaya terhadap mata (pupil 7 mm).
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            <label className="block">
              <span className="text-[12.5px] font-medium text-muted">Diameter D (cm)</span>
              <input
                value={dCm}
                onChange={(e) => setDCm(e.target.value)}
                className="mt-1 w-full rounded-[10px] border border-line bg-sunken px-3 py-2 font-mono text-[14.5px] outline-none focus:border-ungu/60"
              />
            </label>
            <label className="block">
              <span className="text-[12.5px] font-medium text-muted">Panjang gel. λ (nm)</span>
              <input
                value={lambdaNm}
                onChange={(e) => setLambdaNm(e.target.value)}
                className="mt-1 w-full rounded-[10px] border border-line bg-sunken px-3 py-2 font-mono text-[14.5px] outline-none focus:border-ungu/60"
              />
            </label>
            <label className="block">
              <span className="text-[12.5px] font-medium text-muted">f objektif (mm)</span>
              <input
                value={fObjMm}
                onChange={(e) => setFObjMm(e.target.value)}
                className="mt-1 w-full rounded-[10px] border border-line bg-sunken px-3 py-2 font-mono text-[14.5px] outline-none focus:border-ungu/60"
              />
            </label>
            <label className="block">
              <span className="text-[12.5px] font-medium text-muted">f okuler (mm)</span>
              <input
                value={fOkMm}
                onChange={(e) => setFOkMm(e.target.value)}
                className="mt-1 w-full rounded-[10px] border border-line bg-sunken px-3 py-2 font-mono text-[14.5px] outline-none focus:border-ungu/60"
              />
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-[12px] border border-line bg-sunken/70 p-3.5">
              <p className="text-[12px] text-faint">Resolusi Rayleigh θ</p>
              <p className="mt-1 font-mono text-[1.15rem] font-semibold tabular-nums text-cyan">
                {hasilTeleskop ? `${formatIlmiah(hasilTeleskop.rayleighArcsec, 3)}″` : '—'}
              </p>
            </div>
            <div className="rounded-[12px] border border-line bg-sunken/70 p-3.5">
              <p className="text-[12px] text-faint">Perbesaran M</p>
              <p className="mt-1 font-mono text-[1.15rem] font-semibold tabular-nums">
                {hasilTeleskop ? `${formatIlmiah(hasilTeleskop.perbesaran, 3)}×` : '—'}
              </p>
            </div>
            <div className="rounded-[12px] border border-line bg-sunken/70 p-3.5">
              <p className="text-[12px] text-faint">Rasio fokus</p>
              <p className="mt-1 font-mono text-[1.15rem] font-semibold tabular-nums">
                {hasilTeleskop ? `f/${formatIlmiah(hasilTeleskop.fRatio, 2)}` : '—'}
              </p>
            </div>
            <div className="rounded-[12px] border border-line bg-sunken/70 p-3.5">
              <p className="text-[12px] text-faint">Gain cahaya vs mata</p>
              <p className="mt-1 font-mono text-[1.15rem] font-semibold tabular-nums text-amber">
                {hasilTeleskop ? `${formatIlmiah(hasilTeleskop.gainMata, 3)}×` : '—'}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export function Referensi() {
  const [tab, setTab] = useState<TabReferensi>('rumus')
  const [cari, setCari] = useState('')
  const [topikDipilih, setTopikDipilih] = useState('Semua')
  const [terSimpanId, setTersimpanId] = useState<string | null>(null)
  const tambahKartuKustom = useStore((s) => s.tambahKartuKustom)
  const navigate = useNavigate()

  const topikRumus = useMemo(
    () => ['Semua', ...new Set(LEMBAR_RUMUS.map((r) => r.topik))],
    [],
  )

  const rumusTersaring = useMemo(() => {
    const q = cari.trim().toLowerCase()
    return LEMBAR_RUMUS.filter((r) => {
      if (topikDipilih !== 'Semua' && r.topik !== topikDipilih) return false
      if (!q) return true
      return (
        r.nama.toLowerCase().includes(q) ||
        r.topik.toLowerCase().includes(q) ||
        r.keterangan.toLowerCase().includes(q)
      )
    })
  }, [cari, topikDipilih])

  const glosariumTersaring = useMemo(() => {
    const q = cari.trim().toLowerCase()
    if (!q) return GLOSARIUM_OSN
    return GLOSARIUM_OSN.filter(
      (g) =>
        g.istilah.toLowerCase().includes(q) ||
        g.kategori.toLowerCase().includes(q) ||
        g.definisi.toLowerCase().includes(q),
    )
  }, [cari])

  function simpanRumusKeMemori(r: (typeof LEMBAR_RUMUS)[number]) {
    tambahKartuKustom({
      kategori: 'Rumus Inti',
      depan: `Tuliskan rumus **${r.nama}** (${r.topik}) beserta arti variabelnya!`,
      belakang: `$$${r.rumus}$$\n\n${r.keterangan}`,
    })
    setTersimpanId(r.id)
    window.setTimeout(() => setTersimpanId(null), 2000)
  }

  return (
    <div className="anim-masuk space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[1.9rem] leading-tight">Referensi &amp; Kalkulator</h1>
          <p className="mt-1.5 max-w-[58ch] text-[15px] leading-relaxed text-muted">
            Lembar rumus inti OSN, kalkulator astronomi siap pakai, dan glosarium istilah penting.
          </p>
        </div>
        <Button variasi="garis" onClick={() => navigate('/memori')}>
          <Icon nama="memori" ukuran={16} />
          Buka pusat memori
        </Button>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-[12px] border border-line bg-surface p-1" role="tablist">
          {(
            [
              { id: 'rumus', label: 'Lembar Rumus' },
              { id: 'kalkulator', label: 'Kalkulator Astronomi' },
              { id: 'glosarium', label: 'Glosarium OSN' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={clsx(
                'whitespace-nowrap shrink-0 rounded-[9px] px-3.5 py-2 text-[13.5px] font-medium transition',
                tab === t.id ? 'bg-ungu text-white' : 'text-muted hover:text-ink',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab !== 'kalkulator' && (
          <input
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder={tab === 'rumus' ? 'Cari rumus atau topik…' : 'Cari istilah astronomi…'}
            aria-label="Cari referensi"
            className="min-w-[220px] flex-1 rounded-[10px] border border-line bg-surface px-3.5 py-2 text-[14.5px] outline-none transition focus:border-ungu/60"
          />
        )}
      </div>

      {tab === 'rumus' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {topikRumus.map((tp) => (
              <button
                key={tp}
                type="button"
                onClick={() => setTopikDipilih(tp)}
                className={clsx(
                  'whitespace-nowrap shrink-0 rounded-[8px] border px-3 py-1.5 text-[12.5px] transition',
                  topikDipilih === tp
                    ? 'border-cyan/60 bg-cyan-soft text-cyan'
                    : 'border-line bg-surface text-muted hover:text-ink',
                )}
              >
                {tp}
              </button>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {rumusTersaring.map((r) => (
              <article key={r.id} className="kartu flex flex-col justify-between p-5">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[12px] text-faint">{r.topik}</p>
                      <h2 className="mt-0.5 text-[1.08rem]">{r.nama}</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => simpanRumusKeMemori(r)}
                      className="whitespace-nowrap shrink-0 rounded-[8px] border border-line bg-sunken px-2.5 py-1.5 text-[12px] text-muted transition hover:border-ungu/50 hover:text-ink"
                    >
                      {terSimpanId === r.id ? 'Tersimpan!' : '+ Kartu Memori'}
                    </button>
                  </div>

                  <div className="my-3 overflow-x-auto rounded-[10px] border border-line bg-sunken/80 px-4 py-2.5">
                    <TeksMath teks={`$$${r.rumus}$$`} />
                  </div>
                </div>
                <p className="text-[13.5px] leading-relaxed text-muted">{r.keterangan}</p>
              </article>
            ))}
          </div>

          {rumusTersaring.length === 0 && (
            <div className="kartu p-6 text-center text-[14.5px] text-muted">
              Tidak ada rumus yang cocok dengan pencarianmu.
            </div>
          )}
        </div>
      )}

      {tab === 'kalkulator' && <KalkulatorAstronomi />}

      {tab === 'glosarium' && (
        <div className="kartu overflow-hidden">
          {glosariumTersaring.map((g) => (
            <div key={g.istilah} className="border-t border-line px-5 py-4 first:border-t-0">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-[1.05rem]">{g.istilah}</h2>
                <span className="text-[12px] text-faint">{g.kategori}</span>
              </div>
              <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">{g.definisi}</p>
            </div>
          ))}
          {glosariumTersaring.length === 0 && (
            <div className="p-6 text-center text-[14.5px] text-muted">
              Istilah belum ditemukan di glosarium.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
