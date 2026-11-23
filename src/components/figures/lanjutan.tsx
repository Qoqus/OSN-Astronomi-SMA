export function HrSkematis() {
  return (
    <svg viewBox="0 0 420 250" className="w-full max-w-[480px]" role="img" aria-label="Diagram Hertzsprung-Russell skematis dengan deret utama, raksasa, dan katai putih">
      <title>Diagram Hertzsprung-Russell skematis</title>
      <line x1="50" y1="210" x2="390" y2="210" stroke="var(--color-faint)" strokeWidth="1.2" />
      <line x1="50" y1="210" x2="50" y2="30" stroke="var(--color-faint)" strokeWidth="1.2" />
      <text x="46" y="26" fill="var(--color-muted)" fontSize="10">L/L☉</text>
      <text x="386" y="226" textAnchor="end" fill="var(--color-muted)" fontSize="10">T (menurun →)</text>
      <text x="56" y="42" fill="var(--color-faint)" fontSize="9">10⁶</text>
      <text x="56" y="92" fill="var(--color-faint)" fontSize="9">10²</text>
      <text x="56" y="142" fill="var(--color-faint)" fontSize="9">1</text>
      <text x="56" y="192" fill="var(--color-faint)" fontSize="9">10⁻²</text>
      <text x="70" y="224" fill="var(--color-faint)" fontSize="9">30k</text>
      <text x="150" y="224" fill="var(--color-faint)" fontSize="9">10k</text>
      <text x="240" y="224" fill="var(--color-faint)" fontSize="9">6k</text>
      <text x="330" y="224" fill="var(--color-faint)" fontSize="9">3k</text>
      <path d="M85 60 Q 160 120 220 155 T 360 200" fill="none" stroke="var(--color-hijau)" strokeWidth="2" />
      <text x="150" y="110" fill="var(--color-hijau)" fontSize="10">deret utama</text>
      <ellipse cx="300" cy="70" rx="42" ry="20" fill="none" stroke="var(--color-korall)" strokeWidth="1.4" strokeDasharray="4 3" />
      <text x="300" y="52" textAnchor="middle" fill="var(--color-korall)" fontSize="10">raksasa</text>
      <ellipse cx="120" cy="182" rx="34" ry="13" fill="none" stroke="var(--color-info)" strokeWidth="1.4" strokeDasharray="4 3" />
      <text x="120" y="202" textAnchor="middle" fill="var(--color-info)" fontSize="10">katai putih</text>
      <circle cx="246" cy="147" r="4" fill="var(--color-hijau)" />
      <text x="254" y="143" fill="var(--color-muted)" fontSize="9">Matahari</text>
    </svg>
  )
}

export function HrIsoRadius() {
  return (
    <svg viewBox="0 0 420 250" className="w-full max-w-[480px]" role="img" aria-label="Diagram HR dengan garis diagonal radius tetap 0,1 / 1 / 10 / 100 R☉">
      <title>Diagram HR dengan garis iso-radius</title>
      <line x1="50" y1="210" x2="390" y2="210" stroke="var(--color-faint)" strokeWidth="1.2" />
      <line x1="50" y1="210" x2="50" y2="30" stroke="var(--color-faint)" strokeWidth="1.2" />
      <text x="46" y="26" fill="var(--color-muted)" fontSize="10">L/L☉</text>
      <text x="386" y="226" textAnchor="end" fill="var(--color-muted)" fontSize="10">T (menurun →)</text>
      <path d="M85 60 Q 160 120 220 155 T 360 200" fill="none" stroke="var(--color-hijau)" strokeWidth="2" />
      <g stroke="var(--color-line)" strokeWidth="1" strokeDasharray="4 3">
        <line x1="60" y1="40" x2="200" y2="205" />
        <line x1="120" y1="35" x2="270" y2="205" />
        <line x1="190" y1="35" x2="335" y2="200" />
        <line x1="265" y1="35" x2="385" y2="170" />
      </g>
      <text x="70" y="52" fill="var(--color-faint)" fontSize="9">100 R☉</text>
      <text x="140" y="48" fill="var(--color-faint)" fontSize="9">10 R☉</text>
      <text x="212" y="48" fill="var(--color-faint)" fontSize="9">1 R☉</text>
      <text x="290" y="48" fill="var(--color-faint)" fontSize="9">0,1 R☉</text>
      <circle cx="246" cy="147" r="4" fill="var(--color-amber)" />
      <text x="254" y="143" fill="var(--color-muted)" fontSize="9">Matahari</text>
      <text x="120" y="232" fill="var(--color-muted)" fontSize="9">L ∝ R²T⁴ → garis R tetap = diagonal</text>
    </svg>
  )
}

export function HrEvolusi() {
  return (
    <svg viewBox="0 0 400 250" className="w-full max-w-[460px]" role="img" aria-label="Jejak evolusi bintang dari deret utama ke raksasa, lalu katai putih">
      <title>Jejak evolusi bintang dari deret utama ke raksasa, lalu katai putih</title>
      <line x1="55" y1="210" x2="380" y2="210" stroke="var(--color-faint)" strokeWidth="1.2" />
      <line x1="55" y1="210" x2="55" y2="25" stroke="var(--color-faint)" strokeWidth="1.2" />
      <text x="50" y="20" fill="var(--color-muted)" fontSize="10">L/L☉</text>
      <text x="374" y="226" textAnchor="end" fill="var(--color-muted)" fontSize="10">T (menurun →)</text>
      <text x="60" y="45" fill="var(--color-faint)" fontSize="9">10⁴</text>
      <text x="60" y="105" fill="var(--color-faint)" fontSize="9">10²</text>
      <text x="60" y="150" fill="var(--color-faint)" fontSize="9">1</text>
      <text x="60" y="195" fill="var(--color-faint)" fontSize="9">10⁻²</text>
      <text x="80" y="224" fill="var(--color-faint)" fontSize="9">30k</text>
      <text x="175" y="224" fill="var(--color-faint)" fontSize="9">10k</text>
      <text x="265" y="224" fill="var(--color-faint)" fontSize="9">6k</text>
      <text x="340" y="224" fill="var(--color-faint)" fontSize="9">3k</text>
      <path d="M90 70 Q 170 140 255 155 T 355 190" fill="none" stroke="var(--color-line)" strokeWidth="1.2" />
      <circle cx="245" cy="150" r="4" fill="var(--color-hijau)" />
      <path d="M245 150 Q 300 120 320 95" fill="none" stroke="var(--color-hijau)" strokeWidth="1.6" markerEnd="url(#panahL2A)" />
      <path d="M320 95 Q 275 100 235 108" fill="none" stroke="var(--color-hijau)" strokeWidth="1.6" markerEnd="url(#panahL2B)" />
      <path d="M235 108 Q 190 145 135 180" fill="none" stroke="var(--color-hijau)" strokeWidth="1.6" markerEnd="url(#panahL2C)" />
      <text x="300" y="82" fill="var(--color-muted)" fontSize="9">raksasa</text>
      <text x="222" y="100" fill="var(--color-muted)" fontSize="9">helium core</text>
      <text x="110" y="196" fill="var(--color-info)" fontSize="9">katai putih</text>
      <text x="238" y="140" fill="var(--color-hijau)" fontSize="9">Matahari</text>
      <defs>
        <marker id="panahL2A" markerWidth="8" markerHeight="8" refX="6" refY="3.5" orient="auto">
          <path d="M0 0 L7 3.5 L0 7 Z" fill="var(--color-hijau)" />
        </marker>
        <marker id="panahL2B" markerWidth="8" markerHeight="8" refX="6" refY="3.5" orient="auto">
          <path d="M0 0 L7 3.5 L0 7 Z" fill="var(--color-hijau)" />
        </marker>
        <marker id="panahL2C" markerWidth="8" markerHeight="8" refX="6" refY="3.5" orient="auto">
          <path d="M0 0 L7 3.5 L0 7 Z" fill="var(--color-hijau)" />
        </marker>
      </defs>
    </svg>
  )
}

export function KurvaGerhana() {
  return (
    <svg viewBox="0 0 380 200" className="w-full max-w-[440px]" role="img" aria-label="Kurva cahaya bintang gerhana dengan dua minimum berbeda kedalaman">
      <title>Kurva cahaya bintang gerhana dengan dua minimum berbeda kedalaman</title>
      <line x1="45" y1="165" x2="350" y2="165" stroke="var(--color-faint)" strokeWidth="1.2" />
      <line x1="45" y1="165" x2="45" y2="25" stroke="var(--color-faint)" strokeWidth="1.2" />
      <text x="40" y="20" fill="var(--color-muted)" fontSize="10">fluks</text>
      <text x="342" y="180" textAnchor="end" fill="var(--color-muted)" fontSize="10">fase</text>
      <text x="48" y="184" fill="var(--color-faint)" fontSize="9">0</text>
      <text x="190" y="184" fill="var(--color-faint)" fontSize="9">0,5</text>
      <text x="330" y="184" fill="var(--color-faint)" fontSize="9">1,0</text>
      <path d="M45 55 L120 55 Q130 55 135 75 Q140 105 150 105 Q160 105 165 75 Q170 55 185 55 L250 55 Q260 55 265 68 Q270 88 280 88 Q290 88 295 68 Q300 55 315 55 L350 55" fill="none" stroke="var(--color-hijau)" strokeWidth="2" />
      <text x="150" y="124" textAnchor="middle" fill="var(--color-muted)" fontSize="9">minimum primer</text>
      <text x="280" y="108" textAnchor="middle" fill="var(--color-muted)" fontSize="9">sekunder</text>
    </svg>
  )
}

export function KurvaKecepatanRadial() {
  const pts = Array.from({ length: 61 }, (_, i) => {
    const x = 50 + (i / 60) * 310
    const y = 110 - Math.sin((i / 60) * Math.PI * 4) * 62
    return `${x.toFixed(1)} ${y.toFixed(1)}`
  }).join(' L')
  return (
    <svg viewBox="0 0 400 220" className="w-full max-w-[440px]" role="img" aria-label="Kurva kecepatan radial sinusoidal dengan semi-amplitudo K dan periode P">
      <title>Kurva kecepatan radial sinusoidal</title>
      <line x1="50" y1="180" x2="370" y2="180" stroke="var(--color-faint)" strokeWidth="1.2" />
      <line x1="50" y1="180" x2="50" y2="20" stroke="var(--color-faint)" strokeWidth="1.2" />
      <line x1="50" y1="110" x2="370" y2="110" stroke="var(--color-line)" strokeWidth="1" strokeDasharray="4 3" />
      <path d={`M${pts}`} fill="none" stroke="var(--color-cyan)" strokeWidth="2" />
      <line x1="360" y1="48" x2="360" y2="110" stroke="var(--color-amber)" strokeWidth="1.4" />
      <text x="330" y="80" fill="var(--color-amber)" fontSize="10">K</text>
      <text x="40" y="20" fill="var(--color-muted)" fontSize="10">v_r (km/s)</text>
      <text x="330" y="198" fill="var(--color-muted)" fontSize="10">fase</text>
      <text x="120" y="198" fill="var(--color-faint)" fontSize="9">satu periode P</text>
      <line x1="50" y1="186" x2="205" y2="186" stroke="var(--color-faint)" strokeWidth="1" />
      <text x="128" y="176" textAnchor="middle" fill="var(--color-faint)" fontSize="9">P</text>
    </svg>
  )
}

export function KurvaRotasi() {
  return (
    <svg viewBox="0 0 360 230" className="w-full max-w-[420px]" role="img" aria-label="Kurva rotasi galaksi: datar dibandingkan prediksi Kepler yang menurun">
      <title>Kurva rotasi galaksi: datar dibandingkan prediksi Kepler yang menurun</title>
      <line x1="45" y1="195" x2="340" y2="195" stroke="var(--color-faint)" strokeWidth="1.2" />
      <line x1="45" y1="195" x2="45" y2="25" stroke="var(--color-faint)" strokeWidth="1.2" />
      <text x="40" y="20" fill="var(--color-muted)" fontSize="10">v</text>
      <text x="332" y="210" textAnchor="end" fill="var(--color-muted)" fontSize="10">r</text>
      <path d="M45 195 Q 75 95 115 78 T 335 72" fill="none" stroke="var(--color-hijau)" strokeWidth="2.2" />
      <path d="M45 195 Q 80 110 120 96 Q 200 112 335 168" fill="none" stroke="var(--color-faint)" strokeWidth="1.6" strokeDasharray="5 4" />
      <text x="255" y="62" fill="var(--color-hijau)" fontSize="10">teramati (datar)</text>
      <text x="235" y="185" fill="var(--color-faint)" fontSize="10">prediksi massa cahaya</text>
    </svg>
  )
}

export function LensaGravitasi() {
  return (
    <svg viewBox="0 0 400 220" className="w-full max-w-[440px]" role="img" aria-label="Cahaya galaksi latar dibelokkan massa gugus menjadi busur dan citra ganda">
      <title>Lensa gravitasi oleh gugus galaksi</title>
      <circle cx="200" cy="110" r="30" fill="var(--color-ungu)" opacity="0.25" />
      <circle cx="200" cy="110" r="14" fill="var(--color-ungu)" opacity="0.5" />
      <text x="200" y="156" textAnchor="middle" fill="var(--color-ungu)" fontSize="10">gugus (massa)</text>
      <circle cx="200" cy="30" r="6" fill="var(--color-cyan)" />
      <text x="214" y="28" fill="var(--color-cyan)" fontSize="10">galaksi latar</text>
      <path d="M200 36 Q150 70 120 110 Q150 150 200 184" fill="none" stroke="var(--color-amber)" strokeWidth="1.6" />
      <path d="M200 36 Q250 70 280 110 Q250 150 200 184" fill="none" stroke="var(--color-amber)" strokeWidth="1.6" />
      <path d="M120 110 A 80 80 0 0 0 280 110" fill="none" stroke="var(--color-korall)" strokeWidth="2" opacity="0.7" />
      <circle cx="200" cy="190" r="5" fill="var(--color-muted)" />
      <text x="214" y="196" fill="var(--color-muted)" fontSize="10">pengamat</text>
      <text x="96" y="106" textAnchor="end" fill="var(--color-korall)" fontSize="9">busur</text>
    </svg>
  )
}

export function EkspansiRedshift() {
  return (
    <svg viewBox="0 0 380 170" className="w-full max-w-[440px]" role="img" aria-label="Tiga panel ekspansi alam semesta memperlihatkan grid yang membesar dan panjang gelombang yang meregang">
      <title>Tiga panel ekspansi alam semesta</title>
      <rect x="18" y="30" width="86" height="86" fill="none" stroke="var(--color-line)" />
      <line x1="18" y1="58" x2="104" y2="58" stroke="var(--color-line)" />
      <line x1="18" y1="87" x2="104" y2="87" stroke="var(--color-line)" />
      <line x1="47" y1="30" x2="47" y2="116" stroke="var(--color-line)" />
      <line x1="76" y1="30" x2="76" y2="116" stroke="var(--color-line)" />
      <circle cx="47" cy="58" r="3" fill="var(--color-hijau)" />
      <circle cx="76" cy="87" r="3" fill="var(--color-hijau)" />
      <text x="61" y="134" textAnchor="middle" fill="var(--color-muted)" fontSize="9">a = 1/4</text>
      <rect x="140" y="18" width="112" height="112" fill="none" stroke="var(--color-line)" />
      <line x1="140" y1="55" x2="252" y2="55" stroke="var(--color-line)" />
      <line x1="140" y1="93" x2="252" y2="93" stroke="var(--color-line)" />
      <line x1="178" y1="18" x2="178" y2="130" stroke="var(--color-line)" />
      <line x1="215" y1="18" x2="215" y2="130" stroke="var(--color-line)" />
      <circle cx="178" cy="55" r="3" fill="var(--color-hijau)" />
      <circle cx="215" cy="93" r="3" fill="var(--color-hijau)" />
      <text x="196" y="148" textAnchor="middle" fill="var(--color-muted)" fontSize="9">a = 1/2</text>
      <rect x="284" y="6" width="80" height="80" fill="none" stroke="var(--color-line)" />
      <circle cx="324" cy="46" r="3" fill="var(--color-hijau)" />
      <text x="324" y="102" textAnchor="middle" fill="var(--color-muted)" fontSize="9">a = 1</text>
      <path d="M120 74 L136 74" stroke="var(--color-korall)" strokeWidth="1.2" />
      <path d="M260 74 L280 74" stroke="var(--color-korall)" strokeWidth="1.2" />
      <text x="190" y="162" textAnchor="middle" fill="var(--color-faint)" fontSize="9">waktu →</text>
    </svg>
  )
}

export function HubbleDiagram() {
  const titik = [
    [70, 178], [100, 160], [130, 150], [160, 128], [190, 122], [220, 100],
    [250, 92], [280, 70], [310, 64], [340, 44], [150, 140], [240, 84],
  ]
  return (
    <svg viewBox="0 0 400 230" className="w-full max-w-[440px]" role="img" aria-label="Sebaran galaksi dengan garis lurus v = H₀ d kemiringan 70 km/s/Mpc">
      <title>Diagram Hubble: kecepatan vs jarak</title>
      <line x1="50" y1="195" x2="370" y2="195" stroke="var(--color-faint)" strokeWidth="1.2" />
      <line x1="50" y1="195" x2="50" y2="20" stroke="var(--color-faint)" strokeWidth="1.2" />
      <line x1="50" y1="195" x2="355" y2="38" stroke="var(--color-hijau)" strokeWidth="2" />
      {titik.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.2" fill="var(--color-cyan)" />
      ))}
      <text x="300" y="214" fill="var(--color-muted)" fontSize="11">d (Mpc)</text>
      <text x="8" y="30" fill="var(--color-muted)" fontSize="11">v (km/s)</text>
      <text x="200" y="70" fill="var(--color-hijau)" fontSize="11">v = H₀ d</text>
      <text x="120" y="214" fill="var(--color-faint)" fontSize="9">H₀ ≈ 70 km/s/Mpc</text>
    </svg>
  )
}

export function KurvaTransitData() {
  return (
    <svg viewBox="0 0 400 210" className="w-full max-w-[460px]" role="img" aria-label="Kurva cahaya transit dengan titik data dan model kotak membulat">
      <title>Kurva cahaya transit dengan titik data dan model</title>
      <line x1="45" y1="175" x2="370" y2="175" stroke="var(--color-faint)" strokeWidth="1.2" />
      <line x1="45" y1="175" x2="45" y2="25" stroke="var(--color-faint)" strokeWidth="1.2" />
      <text x="40" y="20" fill="var(--color-muted)" fontSize="10">fluks</text>
      <text x="362" y="190" textAnchor="end" fill="var(--color-muted)" fontSize="10">waktu</text>
      <text x="30" y="60" textAnchor="end" fill="var(--color-faint)" fontSize="9">1,00</text>
      <text x="30" y="110" textAnchor="end" fill="var(--color-faint)" fontSize="9">0,97</text>
      <line x1="45" y1="55" x2="370" y2="55" stroke="var(--color-sunken)" strokeWidth="1" />
      <path d="M45 55 L170 55 Q180 55 186 78 Q192 112 206 112 Q220 112 226 78 Q232 55 242 55 L370 55" fill="none" stroke="var(--color-hijau)" strokeWidth="2" />
      <g fill="var(--color-muted)">
        <circle cx="60" cy="52" r="1.8" /><circle cx="85" cy="58" r="1.8" /><circle cx="110" cy="53" r="1.8" />
        <circle cx="135" cy="57" r="1.8" /><circle cx="160" cy="54" r="1.8" /><circle cx="188" cy="88" r="1.8" />
        <circle cx="200" cy="110" r="1.8" /><circle cx="212" cy="106" r="1.8" /><circle cx="224" cy="82" r="1.8" />
        <circle cx="250" cy="56" r="1.8" /><circle cx="275" cy="52" r="1.8" /><circle cx="300" cy="58" r="1.8" />
        <circle cx="325" cy="54" r="1.8" />
      </g>
      <text x="206" y="130" textAnchor="middle" fill="var(--color-muted)" fontSize="9">kedalaman δ</text>
    </svg>
  )
}

export function KurvaCahayaVariabel() {
  const pts = Array.from({ length: 81 }, (_, i) => {
    const x = 50 + (i / 80) * 310
    const fase = (i / 80) * 2
    const m = 0.6 * Math.exp(-((fase % 1) * 4)) - 0.25 * (fase % 1)
    const y = 120 - m * 90
    return `${x.toFixed(1)} ${y.toFixed(1)}`
  }).join(' L')
  return (
    <svg viewBox="0 0 400 220" className="w-full max-w-[440px]" role="img" aria-label="Kurva cahaya periodik dengan magnitudo naik-turun terhadap fase">
      <title>Kurva cahaya bintang variabel</title>
      <line x1="50" y1="185" x2="370" y2="185" stroke="var(--color-faint)" strokeWidth="1.2" />
      <line x1="50" y1="185" x2="50" y2="20" stroke="var(--color-faint)" strokeWidth="1.2" />
      <path d={`M${pts}`} fill="none" stroke="var(--color-magenta)" strokeWidth="2" />
      <text x="10" y="30" fill="var(--color-muted)" fontSize="10">m</text>
      <text x="14" y="46" fill="var(--color-faint)" fontSize="8">(terbalik)</text>
      <text x="330" y="204" fill="var(--color-muted)" fontSize="10">fase</text>
      <text x="120" y="60" fill="var(--color-magenta)" fontSize="10">puncak = paling terang</text>
      <text x="200" y="204" fill="var(--color-faint)" fontSize="9">periode P → tangga jarak (Cepheid)</text>
    </svg>
  )
}

export function DopplerGeser() {
  return (
    <svg viewBox="0 0 400 200" className="w-full max-w-[440px]" role="img" aria-label="Garis spektrum diam dibanding garis tergeser merah dan biru">
      <title>Geseran Doppler garis spektrum</title>
      <text x="20" y="34" fill="var(--color-muted)" fontSize="10">diam (laboratorium)</text>
      <rect x="20" y="42" width="360" height="20" fill="var(--color-sunken)" stroke="var(--color-line)" strokeWidth="1" />
      <rect x="180" y="42" width="4" height="20" fill="var(--color-ink)" />
      <text x="20" y="92" fill="var(--color-korall)" fontSize="10">menjauh → merah</text>
      <rect x="20" y="100" width="360" height="20" fill="var(--color-sunken)" stroke="var(--color-line)" strokeWidth="1" />
      <rect x="220" y="100" width="4" height="20" fill="var(--color-korall)" />
      <line x1="182" y1="124" x2="222" y2="124" stroke="var(--color-korall)" strokeWidth="1.2" markerEnd="url(#panahDop)" />
      <text x="20" y="152" fill="var(--color-info)" fontSize="10">mendekat → biru</text>
      <rect x="20" y="160" width="360" height="20" fill="var(--color-sunken)" stroke="var(--color-line)" strokeWidth="1" />
      <rect x="140" y="160" width="4" height="20" fill="var(--color-info)" />
      <line x1="182" y1="156" x2="142" y2="156" stroke="var(--color-info)" strokeWidth="1.2" markerEnd="url(#panahDopB)" />
      <text x="250" y="196" fill="var(--color-muted)" fontSize="10">Δλ/λ = v/c</text>
      <defs>
        <marker id="panahDop" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0 0 L7 3.5 L0 7 Z" fill="var(--color-korall)" />
        </marker>
        <marker id="panahDopB" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0 0 L7 3.5 L0 7 Z" fill="var(--color-info)" />
        </marker>
      </defs>
    </svg>
  )
}