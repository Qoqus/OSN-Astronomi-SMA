export function ParalaksTahunan() {
  return (
    <svg viewBox="0 0 380 240" className="w-full max-w-[440px]" role="img" aria-label="Diagram paralaks tahunan bintang dekat terhadap latar bintang jauh">
      <title>Diagram paralaks tahunan bintang dekat terhadap latar bintang jauh</title>
      <ellipse cx="120" cy="160" rx="70" ry="26" fill="none" stroke="var(--color-line)" strokeWidth="1.2" />
      <circle cx="120" cy="160" r="7" fill="var(--color-korall)" />
      <text x="120" y="190" textAnchor="middle" fill="var(--color-muted)" fontSize="11">Matahari</text>
      <circle cx="50" cy="160" r="3.5" fill="var(--color-info)" />
      <text x="50" y="150" textAnchor="middle" fill="var(--color-info)" fontSize="10">Bumi (Jan)</text>
      <circle cx="190" cy="160" r="3.5" fill="var(--color-info)" />
      <text x="190" y="150" textAnchor="middle" fill="var(--color-info)" fontSize="10">Bumi (Jul)</text>
      <circle cx="300" cy="120" r="5" fill="var(--color-hijau)" />
      <text x="300" y="108" textAnchor="middle" fill="var(--color-hijau)" fontSize="11">Bintang dekat</text>
      <line x1="50" y1="160" x2="300" y2="120" stroke="var(--color-faint)" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="190" y1="160" x2="300" y2="120" stroke="var(--color-faint)" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="300" y1="120" x2="380" y2="34" stroke="var(--color-line)" strokeWidth="1" />
      <line x1="300" y1="120" x2="380" y2="206" stroke="var(--color-line)" strokeWidth="1" />
      <circle cx="380" cy="34" r="1.6" fill="var(--color-faint)" />
      <circle cx="380" cy="206" r="1.6" fill="var(--color-faint)" />
      <text x="330" y="30" fill="var(--color-faint)" fontSize="10">latar jauh</text>
      <text x="252" y="210" fill="var(--color-hijau)" fontSize="11">d = 1/p pc</text>
    </svg>
  )
}

export function BolaLangit() {
  return (
    <svg viewBox="0 0 420 260" className="w-full" role="img" aria-label="Diagram bola langit dengan horizon, zenith, meridian, dan kutub langit">
      <title>Diagram bola langit dengan horizon, zenith, meridian, dan kutub langit</title>
      <ellipse cx="210" cy="190" rx="170" ry="42" fill="none" stroke="var(--color-faint)" strokeWidth="1.2" />
      <text x="40" y="196" fill="var(--color-faint)" fontSize="11">U</text>
      <text x="386" y="196" fill="var(--color-faint)" fontSize="11">S</text>
      <text x="204" y="240" fill="var(--color-faint)" fontSize="11">horizon</text>
      <line x1="210" y1="190" x2="210" y2="36" stroke="var(--color-line)" strokeWidth="1.2" strokeDasharray="4 4" />
      <circle cx="210" cy="36" r="4" fill="var(--color-korall)" />
      <text x="218" y="40" fill="var(--color-korall)" fontSize="11">zenith</text>
      <path d="M 60 150 A 170 170 0 0 1 360 150" fill="none" stroke="var(--color-hijau)" strokeWidth="1.4" />
      <text x="66" y="136" fill="var(--color-hijau)" fontSize="11">meridian</text>
      <line x1="95" y1="205" x2="325" y2="143" stroke="var(--color-info)" strokeWidth="1.4" />
      <text x="330" y="138" fill="var(--color-info)" fontSize="11">ekuator langit</text>
      <line x1="210" y1="190" x2="330" y2="120" stroke="var(--color-muted)" strokeWidth="1.2" />
      <text x="336" y="116" fill="var(--color-muted)" fontSize="11">kutub langit</text>
      <text x="240" y="172" fill="var(--color-muted)" fontSize="11">|φ|</text>
    </svg>
  )
}

export function SegitigaBola() {
  return (
    <svg viewBox="0 0 380 250" className="w-full" role="img" aria-label="Segitiga bola dengan titik kutub, zenith, dan bintang">
      <title>Segitiga bola dengan titik kutub, zenith, dan bintang</title>
      <circle cx="190" cy="120" r="100" fill="none" stroke="var(--color-line)" strokeWidth="1.2" />
      <path d="M 190 20 A 100 100 0 0 1 276 190" fill="none" stroke="var(--color-hijau)" strokeWidth="1.4" />
      <path d="M 190 20 L 120 158" fill="none" stroke="var(--color-hijau)" strokeWidth="1.4" />
      <path d="M 120 158 A 100 100 0 0 1 276 190" fill="none" stroke="var(--color-hijau)" strokeWidth="1.4" />
      <circle cx="190" cy="20" r="4" fill="var(--color-korall)" />
      <circle cx="120" cy="158" r="4" fill="var(--color-info)" />
      <circle cx="276" cy="190" r="4" fill="var(--color-muted)" />
      <text x="196" y="16" fill="var(--color-korall)" fontSize="12">P</text>
      <text x="98" y="168" fill="var(--color-info)" fontSize="12">Z</text>
      <text x="284" y="198" fill="var(--color-muted)" fontSize="12">S</text>
      <text x="158" y="88" fill="var(--color-hijau)" fontSize="11">90° − |φ|</text>
      <text x="130" y="118" fill="var(--color-hijau)" fontSize="11">90° − δ</text>
      <text x="220" y="184" fill="var(--color-hijau)" fontSize="11">z</text>
      <text x="193" y="42" fill="var(--color-muted)" fontSize="11">H</text>
    </svg>
  )
}

export function FaseBulan() {
  return (
    <svg viewBox="0 0 400 240" className="w-full max-w-[440px]" role="img" aria-label="Delapan fase Bulan mengelilingi Bumi dengan arah sinar Matahari dari kiri">
      <title>Delapan fase Bulan mengelilingi Bumi dengan arah sinar Matahari dari kiri</title>
      <circle cx="200" cy="120" r="88" fill="none" stroke="var(--color-line)" strokeWidth="1" strokeDasharray="4 4" />
      <circle cx="200" cy="120" r="8" fill="var(--color-info)" />
      <text x="200" y="140" textAnchor="middle" fill="var(--color-info)" fontSize="9">Bumi</text>
      <line x1="20" y1="20" x2="20" y2="220" stroke="var(--color-amber)" strokeWidth="1.5" />
      <text x="26" y="34" fill="var(--color-korall)" fontSize="10">sinar Matahari →</text>
      <circle cx="112" cy="120" r="9" fill="var(--color-faint)" />
      <circle cx="138" cy="58" r="9" fill="var(--color-muted)" />
      <circle cx="200" cy="32" r="9" fill="var(--color-muted)" />
      <circle cx="262" cy="58" r="9" fill="var(--color-ink)" stroke="var(--color-faint)" strokeWidth="1.2" />
      <circle cx="288" cy="120" r="9" fill="var(--color-muted)" />
      <circle cx="262" cy="182" r="9" fill="var(--color-muted)" />
      <circle cx="200" cy="208" r="9" fill="var(--color-ink)" stroke="var(--color-faint)" strokeWidth="1.2" />
      <circle cx="138" cy="182" r="9" fill="var(--color-muted)" />
      <text x="112" y="106" textAnchor="middle" fill="var(--color-muted)" fontSize="9">baru</text>
      <text x="286" y="112" fill="var(--color-muted)" fontSize="9">purnama</text>
      <text x="196" y="52" textAnchor="middle" fill="var(--color-muted)" fontSize="9">kuartal I</text>
      <text x="196" y="192" textAnchor="middle" fill="var(--color-muted)" fontSize="9">kuartal III</text>
    </svg>
  )
}

export function GerhanaGeometri() {
  return (
    <svg viewBox="0 0 420 200" className="w-full max-w-[460px]" role="img" aria-label="Kerucut umbra dan penumbra saat Bulan menutupi Matahari">
      <title>Kerucut umbra dan penumbra saat Bulan menutupi Matahari</title>
      <circle cx="50" cy="100" r="34" fill="var(--color-amber)" opacity="0.9" />
      <text x="50" y="150" textAnchor="middle" fill="var(--color-amber)" fontSize="10">Matahari</text>
      <circle cx="180" cy="100" r="12" fill="var(--color-muted)" />
      <text x="180" y="132" textAnchor="middle" fill="var(--color-muted)" fontSize="10">Bulan</text>
      <path d="M50 66 L180 88 L300 100 L180 112 L50 134 Z" fill="var(--color-sunken)" stroke="var(--color-line)" strokeWidth="1" opacity="0.9" />
      <path d="M180 88 L300 100 L180 112 Z" fill="var(--color-ink)" opacity="0.18" />
      <line x1="50" y1="66" x2="392" y2="40" stroke="var(--color-faint)" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="50" y1="134" x2="392" y2="160" stroke="var(--color-faint)" strokeWidth="1" strokeDasharray="3 3" />
      <circle cx="300" cy="100" r="4" fill="var(--color-korall)" />
      <text x="300" y="88" textAnchor="middle" fill="var(--color-korall)" fontSize="10">umbra (total)</text>
      <circle cx="360" cy="52" r="3.5" fill="var(--color-info)" />
      <text x="356" y="42" textAnchor="middle" fill="var(--color-info)" fontSize="10">penumbra</text>
      <text x="210" y="186" textAnchor="middle" fill="var(--color-faint)" fontSize="10">pengamat di Bumi →</text>
    </svg>
  )
}

export function ElipsOrbit() {
  return (
    <svg viewBox="0 0 420 240" className="w-full max-w-[460px]" role="img" aria-label="Elips orbit dengan Matahari di salah satu fokus, perihelion dan aphelion">
      <title>Elips orbit dengan Matahari di salah satu fokus, perihelion dan aphelion</title>
      <ellipse cx="210" cy="120" rx="150" ry="92" fill="none" stroke="var(--color-line)" strokeWidth="1.2" />
      <line x1="60" y1="120" x2="360" y2="120" stroke="var(--color-line)" strokeWidth="1" strokeDasharray="4 4" />
      <circle cx="60" cy="120" r="4" fill="var(--color-hijau)" />
      <circle cx="360" cy="120" r="4" fill="var(--color-hijau)" />
      <circle cx="130" cy="120" r="7" fill="var(--color-korall)" />
      <text x="130" y="102" textAnchor="middle" fill="var(--color-korall)" fontSize="11">Matahari (fokus)</text>
      <text x="52" y="142" textAnchor="middle" fill="var(--color-hijau)" fontSize="11">perihelion</text>
      <text x="372" y="142" textAnchor="middle" fill="var(--color-hijau)" fontSize="11">aphelion</text>
      <path d="M 210 120 L 60 120" stroke="var(--color-faint)" strokeWidth="1" />
      <text x="135" y="114" fill="var(--color-faint)" fontSize="10">a</text>
      <path d="M130 120 L 210 28 A 150 92 0 0 1 340 92" fill="none" stroke="var(--color-info)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      <path d="M130 120 L 210 120 A 92 92 0 0 0 130 24" fill="none" stroke="var(--color-info)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      <text x="210" y="226" textAnchor="middle" fill="var(--color-muted)" fontSize="11">r_p = a(1 − e), r_a = a(1 + e)</text>
    </svg>
  )
}

export function TransferHohmann() {
  return (
    <svg viewBox="0 0 400 260" className="w-full max-w-[440px]" role="img" aria-label="Diagram transfer Hohmann dari orbit Bumi ke orbit Mars">
      <title>Diagram transfer Hohmann dari orbit Bumi ke orbit Mars</title>
      <circle cx="200" cy="130" r="60" fill="none" stroke="var(--color-info)" strokeWidth="1.2" />
      <circle cx="200" cy="130" r="90" fill="none" stroke="var(--color-korall)" strokeWidth="1.2" />
      <circle cx="200" cy="130" r="8" fill="var(--color-hijau)" />
      <text x="200" y="118" textAnchor="middle" fill="var(--color-hijau)" fontSize="10">Matahari</text>
      <path d="M 140 130 A 75 73.5 0 0 1 290 130" fill="none" stroke="var(--color-hijau)" strokeWidth="1.8" strokeDasharray="5 4" />
      <circle cx="140" cy="130" r="5" fill="var(--color-info)" />
      <circle cx="290" cy="130" r="5" fill="var(--color-korall)" />
      <text x="122" y="152" fill="var(--color-info)" fontSize="10">burn 1</text>
      <text x="282" y="152" fill="var(--color-korall)" fontSize="10">burn 2</text>
      <text x="200" y="52" textAnchor="middle" fill="var(--color-info)" fontSize="10">orbit Bumi</text>
      <text x="200" y="30" textAnchor="middle" fill="var(--color-korall)" fontSize="10">orbit Mars</text>
      <text x="248" y="78" fill="var(--color-hijau)" fontSize="10">elips transfer</text>
    </svg>
  )
}

export function WarnaSuhu() {
  return (
    <svg viewBox="0 0 420 140" className="w-full max-w-[460px]" role="img" aria-label="Deret warna bintang dari biru panas ke merah dingin dengan suhu perkiraan">
      <title>Deret warna bintang dari biru panas ke merah dingin dengan suhu perkiraan</title>
      <defs>
        <linearGradient id="gradWarnaSuhu" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-info)" />
          <stop offset="30%" stopColor="var(--color-cyan)" />
          <stop offset="55%" stopColor="var(--color-ink)" />
          <stop offset="75%" stopColor="var(--color-amber)" />
          <stop offset="100%" stopColor="var(--color-korall)" />
        </linearGradient>
      </defs>
      <rect x="20" y="40" width="380" height="26" rx="13" fill="url(#gradWarnaSuhu)" stroke="var(--color-line)" strokeWidth="1" />
      <text x="20" y="92" fill="var(--color-muted)" fontSize="10">30.000 K</text>
      <text x="120" y="92" fill="var(--color-muted)" fontSize="10">10.000 K</text>
      <text x="215" y="92" fill="var(--color-muted)" fontSize="10">6.000 K</text>
      <text x="320" y="92" fill="var(--color-muted)" fontSize="10">3.000 K</text>
      <text x="20" y="28" fill="var(--color-muted)" fontSize="11">biru (O/B)</text>
      <text x="320" y="28" fill="var(--color-muted)" fontSize="11">merah (K/M)</text>
      <text x="20" y="120" fill="var(--color-faint)" fontSize="10">B−V negatif ←  warna intrinsik  → B−V besar</text>
    </svg>
  )
}

export function KurvaBendaHitam() {
  return (
    <svg viewBox="0 0 400 240" className="w-full max-w-[440px]" role="img" aria-label="Tiga kurva Planck: puncak bergeser ke biru dan naik saat suhu bertambah">
      <title>Tiga kurva Planck: puncak bergeser ke biru dan naik saat suhu bertambah</title>
      <line x1="50" y1="200" x2="380" y2="200" stroke="var(--color-faint)" strokeWidth="1.2" />
      <line x1="50" y1="200" x2="50" y2="20" stroke="var(--color-faint)" strokeWidth="1.2" />
      <text x="330" y="220" fill="var(--color-muted)" fontSize="11">λ (nm)</text>
      <text x="14" y="30" fill="var(--color-muted)" fontSize="11">intensitas</text>
      <path d="M50 200 Q120 196 150 150 Q175 96 200 150 Q240 196 380 199" fill="none" stroke="var(--color-korall)" strokeWidth="1.8" />
      <path d="M50 200 Q100 190 125 110 Q145 44 168 110 Q205 188 380 198" fill="none" stroke="var(--color-amber)" strokeWidth="1.8" />
      <path d="M50 199 Q85 176 100 70 Q112 22 126 70 Q160 176 380 197" fill="none" stroke="var(--color-info)" strokeWidth="1.8" />
      <line x1="150" y1="150" x2="150" y2="200" stroke="var(--color-korall)" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="125" y1="110" x2="125" y2="200" stroke="var(--color-amber)" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="100" y1="70" x2="100" y2="200" stroke="var(--color-info)" strokeWidth="1" strokeDasharray="3 3" />
      <text x="250" y="150" fill="var(--color-korall)" fontSize="10">3.000 K</text>
      <text x="230" y="100" fill="var(--color-amber)" fontSize="10">5.800 K</text>
      <text x="200" y="56" fill="var(--color-info)" fontSize="10">10.000 K</text>
      <text x="60" y="216" fill="var(--color-faint)" fontSize="9">λ_max ↑ saat T ↓ (Wien)</text>
    </svg>
  )
}

export function SpektrumAbsorpsi() {
  return (
    <svg viewBox="0 0 420 150" className="w-full max-w-[460px]" role="img" aria-label="Pita spektrum kontinu dengan garis gelap absorpsi pada panjang gelombang tertentu">
      <title>Pita spektrum kontinu dengan garis gelap absorpsi</title>
      <defs>
        <linearGradient id="gradSpektrum" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-ungu)" />
          <stop offset="22%" stopColor="var(--color-info)" />
          <stop offset="45%" stopColor="var(--color-cyan)" />
          <stop offset="62%" stopColor="var(--color-hijau)" />
          <stop offset="78%" stopColor="var(--color-amber)" />
          <stop offset="100%" stopColor="var(--color-korall)" />
        </linearGradient>
      </defs>
      <rect x="20" y="40" width="380" height="46" fill="url(#gradSpektrum)" stroke="var(--color-line)" strokeWidth="1" />
      <g fill="var(--color-canvas)">
        <rect x="78" y="40" width="3" height="46" />
        <rect x="150" y="40" width="2.5" height="46" />
        <rect x="206" y="40" width="4" height="46" />
        <rect x="262" y="40" width="2.5" height="46" />
        <rect x="318" y="40" width="3.5" height="46" />
      </g>
      <text x="206" y="106" textAnchor="middle" fill="var(--color-muted)" fontSize="10">Hα 656 nm</text>
      <text x="20" y="128" fill="var(--color-faint)" fontSize="10">400 nm</text>
      <text x="368" y="128" fill="var(--color-faint)" fontSize="10">700 nm</text>
      <text x="20" y="28" fill="var(--color-muted)" fontSize="11">garis gelap = absorpsi oleh atmosfer bintang</text>
    </svg>
  )
}

export function SpektrumEmisi() {
  return (
    <svg viewBox="0 0 420 150" className="w-full max-w-[460px]" role="img" aria-label="Garis terang emisi pada panjang gelombang diskret di latar gelap">
      <title>Garis terang emisi pada panjang gelombang diskret</title>
      <rect x="20" y="40" width="380" height="46" fill="var(--color-sunken)" stroke="var(--color-line)" strokeWidth="1" />
      <rect x="92" y="40" width="3" height="46" fill="var(--color-ungu)" />
      <rect x="150" y="40" width="3" height="46" fill="var(--color-info)" />
      <rect x="206" y="40" width="4" height="46" fill="var(--color-korall)" />
      <rect x="288" y="40" width="3" height="46" fill="var(--color-cyan)" />
      <text x="206" y="106" textAnchor="middle" fill="var(--color-korall)" fontSize="10">Hα</text>
      <text x="150" y="106" textAnchor="middle" fill="var(--color-info)" fontSize="10">Hβ</text>
      <text x="92" y="106" textAnchor="middle" fill="var(--color-ungu)" fontSize="10">Hγ</text>
      <text x="20" y="128" fill="var(--color-faint)" fontSize="10">deret Balmer hidrogen — gas tipis tereksitasi</text>
      <text x="20" y="28" fill="var(--color-muted)" fontSize="11">garis terang = emisi pada λ diskret</text>
    </svg>
  )
}

export function TanggaMagnitudo() {
  return (
    <svg viewBox="0 0 420 180" className="w-full max-w-[460px]" role="img" aria-label="Skala magnitudo terbalik dengan fluks relatif tiap selisih 5 magnitudo">
      <title>Skala magnitudo terbalik dengan fluks relatif</title>
      <line x1="40" y1="60" x2="390" y2="60" stroke="var(--color-faint)" strokeWidth="1.2" />
      {[1, 2, 3, 4, 5, 6].map((m, i) => {
        const x = 40 + i * 70
        const r = 16 - i * 2.2
        return (
          <g key={m}>
            <circle cx={x} cy="60" r={r} fill="var(--color-amber)" opacity={1 - i * 0.13} />
            <text x={x} y="98" textAnchor="middle" fill="var(--color-muted)" fontSize="11">m={m}</text>
            <text x={x} y="116" textAnchor="middle" fill="var(--color-faint)" fontSize="9">{(100 ** ((1 - m) / 5)).toPrecision(2)}×</text>
          </g>
        )
      })}
      <text x="40" y="34" fill="var(--color-amber)" fontSize="11">lebih terang ←</text>
      <text x="300" y="34" fill="var(--color-faint)" fontSize="11">→ lebih redup</text>
      <text x="40" y="150" fill="var(--color-muted)" fontSize="10">Δm = 5 ⇔ fluks 100× ;  Δm = 1 ⇔ 2,512×</text>
    </svg>
  )
}

export function ModulusJarakGrafik() {
  return (
    <svg viewBox="0 0 380 240" className="w-full max-w-[420px]" role="img" aria-label="Grafik m − M naik linear terhadap log d dengan kemiringan 5">
      <title>Grafik modulus jarak terhadap log d</title>
      <line x1="50" y1="200" x2="360" y2="200" stroke="var(--color-faint)" strokeWidth="1.2" />
      <line x1="50" y1="200" x2="50" y2="20" stroke="var(--color-faint)" strokeWidth="1.2" />
      <line x1="50" y1="200" x2="350" y2="40" stroke="var(--color-hijau)" strokeWidth="2" />
      <line x1="50" y1="170" x2="350" y2="10" stroke="var(--color-korall)" strokeWidth="1.4" strokeDasharray="5 4" />
      <text x="300" y="220" fill="var(--color-muted)" fontSize="11">log d (pc)</text>
      <text x="10" y="30" fill="var(--color-muted)" fontSize="11">m − M</text>
      <text x="210" y="120" fill="var(--color-hijau)" fontSize="11">gradien 5</text>
      <text x="150" y="60" fill="var(--color-korall)" fontSize="10">+ ekstingsi Aᵥ</text>
      <text x="56" y="216" fill="var(--color-faint)" fontSize="9">10 pc → m−M=0</text>
    </svg>
  )
}

export function KurvaTransit() {
  return (
    <svg viewBox="0 0 400 200" className="w-full max-w-[460px]" role="img" aria-label="Kurva cahaya transit dengan penurunan fluks dan label kedalaman">
      <title>Kurva cahaya transit dengan penurunan fluks dan label kedalaman</title>
      <line x1="40" y1="60" x2="370" y2="60" stroke="var(--color-hijau)" strokeWidth="1.4" />
      <path d="M40 60 L120 60 L140 116 L250 116 L270 60 L370 60" fill="none" stroke="var(--color-korall)" strokeWidth="2" />
      <line x1="40" y1="150" x2="370" y2="150" stroke="var(--color-line)" strokeWidth="1" />
      <line x1="40" y1="40" x2="40" y2="160" stroke="var(--color-line)" strokeWidth="1" />
      <text x="20" y="64" fill="var(--color-muted)" fontSize="10">1,000</text>
      <text x="20" y="120" fill="var(--color-muted)" fontSize="10">0,990</text>
      <text x="140" y="136" textAnchor="middle" fill="var(--color-korall)" fontSize="10">kedalaman δ</text>
      <text x="196" y="172" textAnchor="middle" fill="var(--color-faint)" fontSize="10">waktu</text>
      <text x="330" y="52" fill="var(--color-hijau)" fontSize="10">keluar transit</text>
      <text x="52" y="52" fill="var(--color-hijau)" fontSize="10">di luar transit</text>
      <text x="196" y="100" textAnchor="middle" fill="var(--color-korall)" fontSize="10">durasi t</text>
    </svg>
  )
}

export function SkalaTataSurya() {
  const planet = [
    { n: 'Me', a: 0.39 }, { n: 'V', a: 0.72 }, { n: 'B', a: 1 }, { n: 'Ma', a: 1.52 },
    { n: 'J', a: 5.2 }, { n: 'S', a: 9.58 }, { n: 'U', a: 19.2 }, { n: 'N', a: 30.1 },
  ]
  const x = (a: number) => 40 + (Math.log10(a) - Math.log10(0.3)) / (Math.log10(40) - Math.log10(0.3)) * 340
  return (
    <svg viewBox="0 0 420 150" className="w-full max-w-[460px]" role="img" aria-label="Posisi relatif delapan planet pada sumbu jarak logaritmik">
      <title>Posisi relatif delapan planet pada sumbu jarak logaritmik</title>
      <circle cx="26" cy="70" r="12" fill="var(--color-amber)" />
      <text x="26" y="100" textAnchor="middle" fill="var(--color-amber)" fontSize="9">Matahari</text>
      <line x1="40" y1="70" x2="392" y2="70" stroke="var(--color-faint)" strokeWidth="1.2" />
      {planet.map((p, i) => (
        <g key={p.n}>
          <circle cx={x(p.a)} cy="70" r={i < 4 ? 4 : 6} fill={i < 4 ? 'var(--color-cyan)' : 'var(--color-ungu)'} />
          <text x={x(p.a)} y={i % 2 ? 52 : 94} textAnchor="middle" fill="var(--color-muted)" fontSize="9">{p.n}</text>
          <text x={x(p.a)} y={i % 2 ? 40 : 106} textAnchor="middle" fill="var(--color-faint)" fontSize="8">{p.a}</text>
        </g>
      ))}
      <text x="200" y="132" textAnchor="middle" fill="var(--color-faint)" fontSize="10">jarak (AU), skala logaritmik</text>
    </svg>
  )
}

export function Refraktor() {
  return (
    <svg viewBox="0 0 420 170" className="w-full max-w-[460px]" role="img" aria-label="Diagram refraktor: lensa objektif, bidang fokus, okuler, dan mata pengamat">
      <title>Diagram refraktor: lensa objektif, bidang fokus, okuler, dan mata pengamat</title>
      <line x1="40" y1="85" x2="380" y2="85" stroke="var(--color-line)" strokeWidth="1" strokeDasharray="4 4" />
      <ellipse cx="80" cy="85" rx="6" ry="42" fill="none" stroke="var(--color-info)" strokeWidth="2" />
      <line x1="80" y1="43" x2="270" y2="85" stroke="var(--color-faint)" strokeWidth="1" />
      <line x1="80" y1="127" x2="270" y2="85" stroke="var(--color-faint)" strokeWidth="1" />
      <line x1="270" y1="43" x2="330" y2="85" stroke="var(--color-line)" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="270" y1="127" x2="330" y2="85" stroke="var(--color-line)" strokeWidth="1" strokeDasharray="3 3" />
      <ellipse cx="330" cy="85" rx="4" ry="18" fill="none" stroke="var(--color-hijau)" strokeWidth="2" />
      <circle cx="270" cy="85" r="2.5" fill="var(--color-korall)" />
      <text x="76" y="18" textAnchor="middle" fill="var(--color-info)" fontSize="10">objektif (D)</text>
      <text x="176" y="103" textAnchor="middle" fill="var(--color-faint)" fontSize="10">f_obj</text>
      <text x="302" y="120" textAnchor="middle" fill="var(--color-hijau)" fontSize="10">okuler</text>
      <text x="270" y="135" textAnchor="middle" fill="var(--color-korall)" fontSize="10">fokus</text>
      <text x="392" y="89" fill="var(--color-muted)" fontSize="10">mata</text>
    </svg>
  )
}