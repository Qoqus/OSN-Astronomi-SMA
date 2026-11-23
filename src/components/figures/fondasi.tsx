export function SkalaLog() {
  return (
    <svg viewBox="0 0 560 132" className="w-full" role="img" aria-label="Perbandingan skala linear dan logaritmik">
      <title>Perbandingan skala linear dan logaritmik</title>
      <text x="0" y="18" fill="var(--color-muted)" fontSize="12">Linear</text>
      <line x1="0" y1="36" x2="540" y2="36" stroke="var(--color-faint)" strokeWidth="1.2" />
      <g fill="var(--color-muted)" fontSize="11" textAnchor="middle">
        <text x="4" y="54">0</text>
        <text x="139" y="54">250</text>
        <text x="274" y="54">500</text>
        <text x="409" y="54">750</text>
        <text x="538" y="54">1000</text>
      </g>
      <g stroke="var(--color-faint)" strokeWidth="1.2">
        <line x1="0" y1="30" x2="0" y2="42" />
        <line x1="135" y1="30" x2="135" y2="42" />
        <line x1="270" y1="30" x2="270" y2="42" />
        <line x1="405" y1="30" x2="405" y2="42" />
        <line x1="540" y1="30" x2="540" y2="42" />
      </g>
      <text x="0" y="86" fill="var(--color-muted)" fontSize="12">Logaritmik</text>
      <line x1="0" y1="104" x2="540" y2="104" stroke="var(--color-hijau)" strokeWidth="1.4" />
      <g fill="var(--color-hijau)" fontSize="11" textAnchor="middle">
        <text x="2" y="122">1</text>
        <text x="180" y="122">10</text>
        <text x="360" y="122">100</text>
        <text x="538" y="122">1000</text>
      </g>
      <g stroke="var(--color-hijau)" strokeWidth="1.4">
        <line x1="0" y1="98" x2="0" y2="110" />
        <line x1="180" y1="98" x2="180" y2="110" />
        <line x1="360" y1="98" x2="360" y2="110" />
        <line x1="540" y1="98" x2="540" y2="110" />
      </g>
    </svg>
  )
}

export function KeplerLogLog() {
  return (
    <svg viewBox="0 0 380 230" className="w-full" role="img" aria-label="Grafik log T terhadap log a dengan garis lurus kemiringan 1,5">
      <title>Grafik log T terhadap log a dengan garis lurus kemiringan 1,5</title>
      <line x1="45" y1="190" x2="360" y2="190" stroke="var(--color-faint)" strokeWidth="1.2" />
      <line x1="45" y1="190" x2="45" y2="20" stroke="var(--color-faint)" strokeWidth="1.2" />
      <line x1="45" y1="190" x2="345" y2="40" stroke="var(--color-hijau)" strokeWidth="1.8" />
      <circle cx="105" cy="163" r="3.5" fill="var(--color-hijau)" />
      <circle cx="165" cy="136" r="3.5" fill="var(--color-hijau)" />
      <circle cx="225" cy="109" r="3.5" fill="var(--color-hijau)" />
      <circle cx="285" cy="82" r="3.5" fill="var(--color-hijau)" />
      <circle cx="345" cy="55" r="3.5" fill="var(--color-hijau)" />
      <text x="320" y="212" fill="var(--color-muted)" fontSize="11">log a</text>
      <text x="12" y="30" fill="var(--color-muted)" fontSize="11">log T</text>
      <text x="238" y="78" fill="var(--color-hijau)" fontSize="12">kemiringan 3/2</text>
    </svg>
  )
}

export function OrbitLingkaranRasio() {
  return (
    <svg viewBox="0 0 420 240" className="w-full" role="img" aria-label="Dua orbit lingkaran dengan radius berbeda">
      <title>Dua orbit lingkaran dengan radius berbeda</title>
      <circle cx="210" cy="120" r="100" fill="none" stroke="var(--color-line)" strokeWidth="1.2" strokeDasharray="4 4" />
      <circle cx="210" cy="120" r="50" fill="none" stroke="var(--color-hijau)" strokeWidth="1.6" />
      <circle cx="210" cy="120" r="5" fill="var(--color-korall)" />
      <text x="210" y="138" fill="var(--color-muted)" fontSize="11" textAnchor="middle">pusat</text>
      <line x1="210" y1="120" x2="260" y2="120" stroke="var(--color-hijau)" strokeWidth="1.4" />
      <text x="232" y="112" fill="var(--color-hijau)" fontSize="11" textAnchor="middle">R</text>
      <line x1="210" y1="120" x2="310" y2="120" stroke="var(--color-faint)" strokeWidth="1.2" />
      <text x="262" y="106" fill="var(--color-faint)" fontSize="11">4R</text>
      <circle cx="260" cy="120" r="4" fill="var(--color-hijau)" />
      <circle cx="310" cy="120" r="4" fill="var(--color-faint)" />
      <text x="260" y="146" fill="var(--color-hijau)" fontSize="11" textAnchor="middle">v</text>
      <text x="318" y="146" fill="var(--color-faint)" fontSize="11" textAnchor="middle">v/2</text>
    </svg>
  )
}

export function PolaAiry() {
  return (
    <svg viewBox="0 0 300 200" className="w-full max-w-[320px]" role="img" aria-label="Pola Airy: cakram terang dengan cincin konsentris">
      <title>Pola Airy: cakram terang dengan cincin konsentris</title>
      <circle cx="150" cy="100" r="46" fill="none" stroke="var(--color-line)" strokeWidth="1" />
      <circle cx="150" cy="100" r="38" fill="none" stroke="var(--color-hijau)" strokeWidth="1.2" opacity="0.35" />
      <circle cx="150" cy="100" r="16" fill="var(--color-hijau)" opacity="0.85" />
      <circle cx="150" cy="100" r="5" fill="var(--color-ink)" />
      <text x="150" y="178" fill="var(--color-muted)" fontSize="11" textAnchor="middle">θ ≈ 1,22 λ/D</text>
    </svg>
  )
}

export function TingkatEnergiHidrogen() {
  return (
    <svg viewBox="0 0 360 240" className="w-full max-w-[420px]" role="img" aria-label="Diagram tingkat energi hidrogen n=1 sampai n=4 dengan transisi">
      <title>Diagram tingkat energi hidrogen n=1 sampai n=4 dengan transisi</title>
      <line x1="40" y1="200" x2="320" y2="200" stroke="var(--color-hijau)" strokeWidth="1.6" />
      <line x1="40" y1="128" x2="320" y2="128" stroke="var(--color-faint)" strokeWidth="1.2" />
      <line x1="40" y1="92" x2="320" y2="92" stroke="var(--color-faint)" strokeWidth="1.2" />
      <line x1="40" y1="70" x2="320" y2="70" stroke="var(--color-faint)" strokeWidth="1.2" />
      <text x="340" y="204" textAnchor="end" fill="var(--color-muted)" fontSize="12">n=1 (−13,6 eV)</text>
      <text x="340" y="132" textAnchor="end" fill="var(--color-faint)" fontSize="12">n=2 (−3,4)</text>
      <text x="340" y="96" textAnchor="end" fill="var(--color-faint)" fontSize="12">n=3 (−1,5)</text>
      <text x="340" y="74" textAnchor="end" fill="var(--color-faint)" fontSize="12">n=4 (−0,85)</text>
      <line x1="300" y1="92" x2="300" y2="128" stroke="var(--color-korall)" strokeWidth="1.6" markerEnd="url(#panahF6Clay)" />
      <text x="222" y="86" fill="var(--color-korall)" fontSize="11">n=3→2: 656 nm</text>
      <line x1="180" y1="128" x2="180" y2="200" stroke="var(--color-info)" strokeWidth="1.6" markerEnd="url(#panahF6Info)" />
      <text x="108" y="122" fill="var(--color-info)" fontSize="11">n=2→1: 122 nm</text>
      <line x1="120" y1="70" x2="120" y2="200" stroke="var(--color-hijau)" strokeWidth="1.4" strokeDasharray="4 3" markerEnd="url(#panahF6Olive)" />
      <text x="30" y="60" fill="var(--color-hijau)" fontSize="11">n=4→1</text>
      <defs>
        <marker id="panahF6Clay" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0 0 L7 3.5 L0 7 Z" fill="var(--color-korall)" />
        </marker>
        <marker id="panahF6Info" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0 0 L7 3.5 L0 7 Z" fill="var(--color-info)" />
        </marker>
        <marker id="panahF6Olive" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0 0 L7 3.5 L0 7 Z" fill="var(--color-hijau)" />
        </marker>
      </defs>
    </svg>
  )
}

export function LingkaranSatuan() {
  return (
    <svg viewBox="0 0 300 260" className="w-full max-w-[320px]" role="img" aria-label="Lingkaran satuan dengan sudut, proyeksi sinus dan kosinus">
      <title>Lingkaran satuan dengan sudut, proyeksi sinus dan kosinus</title>
      <line x1="30" y1="140" x2="270" y2="140" stroke="var(--color-faint)" strokeWidth="1.2" />
      <line x1="140" y1="20" x2="140" y2="240" stroke="var(--color-faint)" strokeWidth="1.2" />
      <circle cx="140" cy="140" r="95" fill="none" stroke="var(--color-line)" strokeWidth="1.4" />
      <line x1="140" y1="140" x2="207" y2="73" stroke="var(--color-ungu)" strokeWidth="2" />
      <line x1="207" y1="73" x2="207" y2="140" stroke="var(--color-korall)" strokeWidth="1.6" strokeDasharray="4 3" />
      <line x1="207" y1="73" x2="140" y2="73" stroke="var(--color-cyan)" strokeWidth="1.6" strokeDasharray="4 3" />
      <circle cx="207" cy="73" r="5" fill="var(--color-amber)" />
      <path d="M170 140 A 30 30 0 0 0 161 119" fill="none" stroke="var(--color-amber)" strokeWidth="1.4" />
      <text x="176" y="130" fill="var(--color-amber)" fontSize="12">θ</text>
      <text x="214" y="112" fill="var(--color-korall)" fontSize="12">sin θ</text>
      <text x="150" y="64" fill="var(--color-cyan)" fontSize="12">cos θ</text>
      <text x="180" y="106" fill="var(--color-ungu)" fontSize="11">1</text>
      <text x="252" y="156" fill="var(--color-muted)" fontSize="11">x</text>
      <text x="146" y="30" fill="var(--color-muted)" fontSize="11">y</text>
    </svg>
  )
}

export function SegitigaVektor() {
  return (
    <svg viewBox="0 0 360 240" className="w-full max-w-[400px]" role="img" aria-label="Dua vektor dijumlahkan menjadi resultan dengan komponen x dan y">
      <title>Dua vektor dijumlahkan menjadi resultan dengan komponen x dan y</title>
      <line x1="40" y1="200" x2="330" y2="200" stroke="var(--color-faint)" strokeWidth="1.2" />
      <line x1="40" y1="200" x2="40" y2="20" stroke="var(--color-faint)" strokeWidth="1.2" />
      <line x1="40" y1="200" x2="160" y2="120" stroke="var(--color-cyan)" strokeWidth="2" markerEnd="url(#panahVecA)" />
      <line x1="160" y1="120" x2="280" y2="60" stroke="var(--color-magenta)" strokeWidth="2" markerEnd="url(#panahVecB)" />
      <line x1="40" y1="200" x2="280" y2="60" stroke="var(--color-amber)" strokeWidth="2.2" markerEnd="url(#panahVecR)" />
      <line x1="280" y1="60" x2="280" y2="200" stroke="var(--color-line)" strokeWidth="1" strokeDasharray="4 3" />
      <line x1="40" y1="60" x2="280" y2="60" stroke="var(--color-line)" strokeWidth="1" strokeDasharray="4 3" />
      <text x="92" y="146" fill="var(--color-cyan)" fontSize="12">A</text>
      <text x="222" y="80" fill="var(--color-magenta)" fontSize="12">B</text>
      <text x="140" y="112" fill="var(--color-amber)" fontSize="12">R = A + B</text>
      <text x="286" y="140" fill="var(--color-muted)" fontSize="11">Ry</text>
      <text x="150" y="216" fill="var(--color-muted)" fontSize="11">Rx</text>
      <defs>
        <marker id="panahVecA" markerWidth="8" markerHeight="8" refX="6" refY="3.5" orient="auto">
          <path d="M0 0 L7 3.5 L0 7 Z" fill="var(--color-cyan)" />
        </marker>
        <marker id="panahVecB" markerWidth="8" markerHeight="8" refX="6" refY="3.5" orient="auto">
          <path d="M0 0 L7 3.5 L0 7 Z" fill="var(--color-magenta)" />
        </marker>
        <marker id="panahVecR" markerWidth="8" markerHeight="8" refX="6" refY="3.5" orient="auto">
          <path d="M0 0 L7 3.5 L0 7 Z" fill="var(--color-amber)" />
        </marker>
      </defs>
    </svg>
  )
}