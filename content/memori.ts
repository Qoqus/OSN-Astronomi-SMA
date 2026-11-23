import type { KartuMemori } from '@/types'

export const KATEGORI_MEMORI = [
  'Konstanta & Satuan',
  'Rumus Inti',
  'Spektrum & Bintang',
  'Astronomi Bola & Waktu',
  'Tata Surya & Eksoplanet',
  'Galaksi, Kosmologi & Instrumen',
] as const

export const KARTU_MEMORI_BAWAAN: KartuMemori[] = [
  // 1. Konstanta & Satuan
  {
    id: 'm-konst-au',
    kategori: 'Konstanta & Satuan',
    depan: 'Berapa nilai $1\\text{ AU}$ (Satuan Astronomi) dalam meter dan kilometer?',
    belakang: '$1\\text{ AU} \\approx 1{,}496 \\times 10^{11}\\text{ m} = 1{,}496 \\times 10^8\\text{ km}$. Waktu tempuh cahaya $1\\text{ AU} \\approx 499\\text{ detik} \\approx 8{,}3\\text{ menit}$.',
    petunjuk: 'Jarak rata-rata Bumi–Matahari',
    babId: 'a1',
  },
  {
    id: 'm-konst-pc',
    kategori: 'Konstanta & Satuan',
    depan: 'Konversikan $1\\text{ parsek (pc)}$ ke dalam tahun cahaya, AU, dan meter!',
    belakang: '$1\\text{ pc} \\approx 3{,}26\\text{ ly} \\approx 206.265\\text{ AU} \\approx 3{,}086 \\times 10^{16}\\text{ m}$.',
    petunjuk: '206.265 adalah jumlah detik busur dalam 1 radian',
    babId: 'a1',
  },
  {
    id: 'm-konst-ly',
    kategori: 'Konstanta & Satuan',
    depan: 'Berapa nilai $1\\text{ tahun cahaya (ly)}$ dalam meter?',
    belakang: '$1\\text{ ly} = c \\times 1\\text{ tahun Julian} \\approx 9{,}461 \\times 10^{15}\\text{ m} \\approx 63.241\\text{ AU}$.',
    babId: 'a1',
  },
  {
    id: 'm-konst-rad',
    kategori: 'Konstanta & Satuan',
    depan: 'Berapa detik busur dalam $1\\text{ radian}$?',
    belakang: '$1\\text{ rad} = \\frac{180}{\\pi} \\times 3600\\text{\'\'} \\approx 206.265\\text{\'\'}$.',
    petunjuk: 'Muncul langsung dalam rumus sudut kecil dan definisi parsek',
    babId: 'f2',
  },
  {
    id: 'm-konst-matahari',
    kategori: 'Konstanta & Satuan',
    depan: 'Sebutkan $M_\\odot$, $R_\\odot$, $L_\\odot$, dan $T_{\\text{eff},\\odot}$ Matahari!',
    belakang: '$M_\\odot \\approx 1{,}989 \\times 10^{30}\\text{ kg}$, $R_\\odot \\approx 6{,}96 \\times 10^8\\text{ m}$, $L_\\odot \\approx 3{,}828 \\times 10^{26}\\text{ W}$, $T_{\\text{eff},\\odot} \\approx 5778\\text{ K}$.',
    babId: 'a5',
  },
  {
    id: 'm-konst-mag-matahari',
    kategori: 'Konstanta & Satuan',
    depan: 'Berapa magnitudo mutlak visual/bolometrik dan magnitudo semu Matahari?',
    belakang: 'Magnitudo semu $m_V \\approx -26{,}74$; magnitudo mutlak $M_V \\approx +4{,}83$ ($M_{\\text{bol}} \\approx +4{,}74$).',
    petunjuk: 'Di jarak 10 pc, Matahari hanya tampak secerah bintang redup +4,83',
    babId: 'a5',
  },
  {
    id: 'm-konst-wien',
    kategori: 'Konstanta & Satuan',
    depan: 'Berapa konstanta pergeseran Wien $b$ dalam $\\lambda_{\\max} T = b$?',
    belakang: '$b \\approx 2{,}898 \\times 10^{-3}\\text{ m}\\cdot\\text{K} \\approx 2{,}9 \\times 10^6\\text{ nm}\\cdot\\text{K}$.',
    babId: 'a5',
  },
  {
    id: 'm-konst-sb',
    kategori: 'Konstanta & Satuan',
    depan: 'Berapa nilai konstanta Stefan–Boltzmann $\\sigma$ dan konstanta gravitasi $G$?',
    belakang: '$\\sigma \\approx 5{,}67 \\times 10^{-8}\\text{ W m}^{-2}\\text{ K}^{-4}$; $G \\approx 6{,}674 \\times 10^{-11}\\text{ m}^3\\text{ kg}^{-1}\\text{ s}^{-2}$.',
    babId: 'f4',
  },
  {
    id: 'm-konst-chandrasekhar',
    kategori: 'Konstanta & Satuan',
    depan: 'Berapa nilai Batas Chandrasekhar untuk massa maksimum katai putih?',
    belakang: '$M_{\\text{Ch}} \\approx 1{,}44\\,M_\\odot$. Di atas batas ini tekanan degenerasi elektron tidak mampu menahan gravitasi.',
    babId: 'l2',
  },

  // 2. Rumus Inti
  {
    id: 'm-rumus-pogson',
    kategori: 'Rumus Inti',
    depan: 'Tuliskan Hukum Pogson yang menghubungkan selisih magnitudo dan rasio fluks!',
    belakang: '$m_1 - m_2 = -2{,}5 \\log_{10}\\left(\\frac{F_1}{F_2}\\right)$ atau $\\frac{F_1}{F_2} = 10^{-0{,}4(m_1 - m_2)} \\approx 2{,}512^{(m_2 - m_1)}$.',
    petunjuk: 'Selisih 5 magnitudo = faktor fluks tepat 100',
    babId: 'a1',
  },
  {
    id: 'm-rumus-modulus',
    kategori: 'Rumus Inti',
    depan: 'Tuliskan rumus Modulus Jarak termasuk koreksi ekstingsi debu antarbintang $A$!',
    belakang: '$m - M = 5\\log_{10}(d_{\\text{pc}}) - 5 + A$. Jika tanpa ekstingsi ($A=0$), jarak terukur menjadi lebih besar dari jarak sebenarnya.',
    babId: 'a5',
  },
  {
    id: 'm-rumus-ekstingsi',
    kategori: 'Rumus Inti',
    depan: 'Apa hubungan ekstingsi visual $A_V$ dengan ekses warna $E(B-V)$ di Bima Sakti?',
    belakang: '$A_V = R_V \\cdot E(B-V)$ dengan faktor rata-rata debu difus Bima Sakti $R_V \\approx 3{,}1$, dan $E(B-V) = (B-V)_{\\text{amati}} - (B-V)_0$.',
    babId: 'a5',
  },
  {
    id: 'm-rumus-visviva',
    kategori: 'Rumus Inti',
    depan: 'Tuliskan Persamaan Vis-Viva untuk laju orbit pada jarak $r$ dengan setengah sumbu panjang $a$!',
    belakang: '$v^2 = G(M + m)\\left(\\frac{2}{r} - \\frac{1}{a}\\right)$. Untuk orbit lingkaran ($r=a$): $v_c = \\sqrt{GM/r}$; lepas ($a\\to\\infty$): $v_{\\text{esc}} = \\sqrt{2GM/r}$.',
    babId: 'a4',
  },
  {
    id: 'm-rumus-kepler3',
    kategori: 'Rumus Inti',
    depan: 'Tuliskan Hukum III Kepler versi lengkap (Newtonian) dan versi praktis Tata Surya!',
    belakang: '$P^2 = \\frac{4\\pi^2}{G(M_1 + M_2)} a^3$. Dalam satuan tahun, AU, dan $M_\\odot$: $P_{\\text{thn}}^2 = \\frac{a_{\\text{AU}}^3}{M_1 + M_2}$.',
    babId: 'a4',
  },
  {
    id: 'm-rumus-luminositas',
    kategori: 'Rumus Inti',
    depan: 'Tuliskan hubungan luminositas, jejari, dan suhu efektif bintang (Hukum Stefan–Boltzmann)!',
    belakang: '$L = 4\\pi R^2 \\sigma T_{\\text{eff}}^4$. Dalam rasio Matahari: $\\frac{L}{L_\\odot} = \\left(\\frac{R}{R_\\odot}\\right)^2 \\left(\\frac{T}{T_\\odot}\\right)^4$.',
    babId: 'a5',
  },
  {
    id: 'm-rumus-teq',
    kategori: 'Rumus Inti',
    depan: 'Tuliskan suhu kesetimbangan radiatif planet dengan albedo Bond $A$ pada jarak $d$ dari bintang!',
    belakang: '$T_{\\text{eq}} = T_* \\sqrt{\\frac{R_*}{2d}} (1 - A)^{1/4}$ (asumsi rotasi cepat / redistribusi panas seragam ke seluruh permukaan $4\\pi R_p^2$).',
    babId: 'a6',
  },
  {
    id: 'm-rumus-roche',
    kategori: 'Rumus Inti',
    depan: 'Tuliskan perkiraan Batas Roche untuk satelit cair terhadap planet induknya!',
    belakang: '$d_{\\text{Roche}} \\approx 2{,}44\\, R_p \\left(\\frac{\\rho_p}{\\rho_s}\\right)^{1/3}$ (untuk satelit tegar sekitar $1{,}26\\, R_p (\\rho_p/\\rho_s)^{1/3}$).',
    babId: 'a6',
  },
  {
    id: 'm-rumus-transit',
    kategori: 'Rumus Inti',
    depan: 'Berapa kedalaman kurva cahaya transit eksoplanet ($\\Delta F / F$)?',
    belakang: '$\\frac{\\Delta F}{F} \\approx \\left(\\frac{R_p}{R_*}\\right)^2$ (mengabaikan limb darkening dan cahaya planet).',
    babId: 'a6',
  },
  {
    id: 'm-rumus-doppler',
    kategori: 'Rumus Inti',
    depan: 'Tuliskan rumus pergeseran Doppler non-relativistik dan relativistik untuk $z = \\Delta\\lambda/\\lambda_0$!',
    belakang: 'Non-relativistik ($v \\ll c$): $z = \\frac{\\lambda - \\lambda_0}{\\lambda_0} \\approx \\frac{v_r}{c}$. Relativistik: $1 + z = \\sqrt{\\frac{1 + v/c}{1 - v/c}}$.',
    babId: 'l1',
  },
  {
    id: 'm-rumus-virial',
    kategori: 'Rumus Inti',
    depan: 'Apa bunyi Teorema Virial untuk sistem terikat gravitasi yang setimbang?',
    belakang: '$2\\langle K \\rangle + \\langle U \\rangle = 0$, sehingga energi total $E = \\langle K \\rangle + \\langle U \\rangle = \\frac{1}{2}\\langle U \\rangle = -\\langle K \\rangle < 0$.',
    petunjuk: 'Saat bintang mengerut, separuh energi gravitasi memanaskan bintang dan separuh dipancarkan',
    babId: 'l2',
  },

  // 3. Spektrum & Bintang
  {
    id: 'm-spek-urutan',
    kategori: 'Spektrum & Bintang',
    depan: 'Sebutkan urutan kelas spektrum bintang dari terpanas ke terdingin beserta warnanya!',
    belakang: '**O** (biru, $>30.000\\text{ K}$) – **B** (biru-putih) – **A** (putih) – **F** (kuning-putih) – **G** (kuning, $\\sim 5800\\text{ K}$) – **K** (jingga) – **M** (merah, $<3700\\text{ K}$). Jembatan keledai: *Oh Be A Fine Girl/Guy, Kiss Me*.',
    babId: 'l1',
  },
  {
    id: 'm-spek-garis',
    kategori: 'Spektrum & Bintang',
    depan: 'Garis serapan dominan apa yang mencirikan kelas spektrum O, A, G, dan M?',
    belakang: '**O**: He II terionisasi; **A**: garis Balmer Hidrogen terkuat ($\\sim 9500\\text{ K}$); **G**: Ca II H & K dan logam netral; **M**: pita molekul TiO yang kuat.',
    babId: 'l1',
  },
  {
    id: 'm-spek-yerkes',
    kategori: 'Spektrum & Bintang',
    depan: 'Apa arti kelas luminositas Yerkes Ia/Ib, II, III, IV, V, dan VII?',
    belakang: '**I** = maharaksasa (Ia terang, Ib kurang terang), **II** = raksasa terang, **III** = raksasa normal, **IV** = subraksasa, **V** = deret utama (katai), **VII** = katai putih.',
    petunjuk: 'Matahari bertipe G2V',
    babId: 'l1',
  },
  {
    id: 'm-spek-ml',
    kategori: 'Spektrum & Bintang',
    depan: 'Bagaimana hubungan Massa–Luminositas dan estimasi umur deret utama bintang?',
    belakang: 'Untuk bintang mirip Matahari: $L \\propto M^{3{,}5}$, sehingga waktu hidup deret utama $\\tau_{\\text{MS}} \\propto \\frac{M}{L} \\propto M^{-2{,}5} \\approx 10^{10}\\text{ thn}\\left(\\frac{M}{M_\\odot}\\right)^{-2{,}5}$.',
    babId: 'l1',
  },
  {
    id: 'm-spek-akhir',
    kategori: 'Spektrum & Bintang',
    depan: 'Apa sisa evolusi akhir bintang berdasarkan massa awalnya ($M_{\\text{awal}}$)?',
    belakang: '$<8\\,M_\\odot$ → nebula planet + **katai putih** ($<1{,}44\\,M_\\odot$); $8\\text{–}20\\,M_\\odot$ → supernova tipe II + **bintang neutron** ($\\lesssim 2\\text{–}3\\,M_\\odot$); $>20\\text{–}25\\,M_\\odot$ → **lubang hitam**.',
    babId: 'l2',
  },
  {
    id: 'm-spek-bv',
    kategori: 'Spektrum & Bintang',
    depan: 'Apa tanda indeks warna $(B - V)$ untuk bintang panas vs bintang dingin?',
    belakang: 'Bintang **panas** memancarkan lebih banyak di biru ($B < V$), sehingga $B - V$ **kecil/negatif** ($\\approx -0{,}3$). Bintang **dingin** memancarkan lebih banyak di $V$, sehingga $B - V$ **besar/positif** ($\\approx +1{,}5$). Matahari $B-V \\approx +0{,}65$.',
    babId: 'a5',
  },

  // 4. Astronomi Bola & Waktu
  {
    id: 'm-bola-lst',
    kategori: 'Astronomi Bola & Waktu',
    depan: 'Apa hubungan antara Waktu Sideris Lokal ($LST$), Sudut Jam ($HA$), dan Asensio Rekta ($\\alpha$)?',
    belakang: '$LST = HA + \\alpha$. Saat bintang berkulminasi atas di meridian pengamat, $HA = 0^\\text{h}$ sehingga $LST = \\alpha$.',
    babId: 'a2',
  },
  {
    id: 'm-bola-kulminasi',
    kategori: 'Astronomi Bola & Waktu',
    depan: 'Berapa ketinggian maksimum ($h_{\\max}$) bintang berdeklinasi $\\delta$ untuk pengamat di lintang $\\phi$?',
    belakang: '$h_{\\max} = 90^\\circ - |\\phi - \\delta|$ (di meridian atas). Jika $\\delta > \\phi$ (belahan bumi sama), bintang melintas di utara zenit; jika $\\delta < \\phi$, di selatan zenit.',
    babId: 'a2',
  },
  {
    id: 'm-bola-sirkumpolar',
    kategori: 'Astronomi Bola & Waktu',
    depan: 'Apa syarat bintang bersifat sirkumpolar (tak pernah terbenam) dan tak pernah terbit di lintang $\\phi$?',
    belakang: 'Sirkumpolar jika $\\delta \\cdot \\text{sign}(\\phi) \\ge 90^\\circ - |\\phi|$ (atau $|\\delta| \\ge 90^\\circ - |\\phi|$ sejenis dengan $\\phi$). Tak pernah terbit jika berlawanan tanda dan $|\\delta| > 90^\\circ - |\\phi|$.',
    babId: 'a2',
  },
  {
    id: 'm-bola-hari',
    kategori: 'Astronomi Bola & Waktu',
    depan: 'Berapa selisih panjang hari sideris dan hari matahari rata-rata?',
    belakang: 'Hari sideris $\\approx 23^\\text{j}\\,56^\\text{m}\\,4^\\text{d} = 86.164\\text{ s}$, lebih pendek **$3^\\text{m}\\,56^\\text{d}$** daripada hari matahari rata-rata ($24^\\text{j} = 86.400\\text{ s}$).',
    babId: 'a3',
  },
  {
    id: 'm-bola-sinodis',
    kategori: 'Astronomi Bola & Waktu',
    depan: 'Berapa periode sideris vs sinodis Bulan, dan tuliskan rumus hubungannya!',
    belakang: 'Sideris $P_{\\text{sid}} \\approx 27{,}32\\text{ hari}$; Sinodis $S \\approx 29{,}53\\text{ hari}$. Rumus: $\\frac{1}{S} = \\frac{1}{P_{\\text{sid}}} - \\frac{1}{P_{\\oplus}}$.',
    babId: 'a3',
  },
  {
    id: 'm-bola-pzs',
    kategori: 'Astronomi Bola & Waktu',
    depan: 'Tuliskan Hukum Kosinus Bola pada segitiga PZS untuk mencari jarak zenit $z = 90^\\circ - h$!',
    belakang: '$\\cos z = \\sin h = \\sin\\phi\\sin\\delta + \\cos\\phi\\cos\\delta\\cos H$, dengan $\\phi$ lintang pengamat, $\\delta$ deklinasi, dan $H$ sudut jam.',
    babId: 'a2',
  },

  // 5. Tata Surya & Eksoplanet
  {
    id: 'm-ts-sinodis-planet',
    kategori: 'Tata Surya & Eksoplanet',
    depan: 'Tuliskan hubungan periode sinodis $S$ untuk planet dalam (inferior) dan planet luar (superior)!',
    belakang: 'Inferior ($P < P_\\oplus$): $\\frac{1}{S} = \\frac{1}{P} - \\frac{1}{P_\\oplus}$. Superior ($P > P_\\oplus$): $\\frac{1}{S} = \\frac{1}{P_\\oplus} - \\frac{1}{P}$.',
    babId: 'a4',
  },
  {
    id: 'm-ts-elongasi',
    kategori: 'Tata Surya & Eksoplanet',
    depan: 'Bagaimana menghitung jarak orbit lingkaran planet inferior $a$ dari sudut elongasi maksimum $\\varepsilon_{\\max}$?',
    belakang: '$a = (1\\text{ AU}) \\cdot \\sin\\varepsilon_{\\max}$. (Contoh: Venus $\\varepsilon_{\\max} \\approx 46^\\circ \\Rightarrow a \\approx 0{,}72\\text{ AU}$).',
    babId: 'a4',
  },
  {
    id: 'm-ts-lapisan-matahari',
    kategori: 'Tata Surya & Eksoplanet',
    depan: 'Sebutkan urutan lapisan Matahari dari inti paling dalam ke atmosfer terluar!',
    belakang: 'Inti ($\\sim 1{,}5\\times 10^7\\text{ K}$) → Zona Radiatif → Zona Konvektif → Fotosfer ($\\sim 5778\\text{ K}$) → Kromosfer → Korona ($>10^6\\text{ K}$).',
    babId: 'a6',
  },
  {
    id: 'm-ts-hohmann',
    kategori: 'Tata Surya & Eksoplanet',
    depan: 'Berapa setengah sumbu panjang $a_{\\text{tr}}$ dan waktu transfer pada orbit Hohmann dari $r_1$ ke $r_2$?',
    belakang: '$a_{\\text{tr}} = \\frac{r_1 + r_2}{2}$, dan waktu tempuh satu arah adalah setengah periode elips transfer: $t_{\\text{tr}} = \\frac{1}{2} P_{\\text{tr}} = \\pi\\sqrt{\\frac{a_{\\text{tr}}^3}{GM}}$.',
    babId: 'a4',
  },
  {
    id: 'm-ts-barycenter',
    kategori: 'Tata Surya & Eksoplanet',
    depan: 'Bagaimana menentukan massa masing-masing bintang dari orbit relatif pusat massa ($a = a_1 + a_2$)?',
    belakang: '$M_1 a_1 = M_2 a_2$ sehingga $\\frac{M_1}{M_2} = \\frac{a_2}{a_1} = \\frac{v_2}{v_1}$, dan $M_1 + M_2 = \\frac{4\\pi^2 a^3}{G P^2}$.',
    babId: 'l3',
  },

  // 6. Galaksi, Kosmologi & Instrumen
  {
    id: 'm-inst-rayleigh',
    kategori: 'Galaksi, Kosmologi & Instrumen',
    depan: 'Tuliskan batas difraksi Rayleigh teleskop lingkaran dan bentuk praktisnya dalam detik busur!',
    belakang: '$\\theta = 1{,}22\\frac{\\lambda}{D}$ rad. Untuk $\\lambda = 550\\text{ nm}$ dan $D$ dalam meter: $\\theta\\text{\'\'} \\approx \\frac{0{,}138\\text{\'\'}}{D_{\\text{m}}} \\approx \\frac{11{,}6\\text{\'\'}}{D_{\\text{cm}}}$ (batas Dawes).',
    babId: 'a7',
  },
  {
    id: 'm-inst-teleskop',
    kategori: 'Galaksi, Kosmologi & Instrumen',
    depan: 'Bagaimana rumus perbesaran sudut, skala pelat (plate scale), dan gain cahaya teleskop?',
    belakang: 'Perbesaran $M = \\frac{f_{\\text{obj}}}{f_{\\text{ok}}}$; skala pelat $s = \\frac{206.265\\text{\'\'}}{f_{\\text{obj}}}$ per satuan panjang; daya kumpul cahaya $\\propto D^2$ (atau $\\Delta m_{\\text{limit}} = 5\\log_{10}(D / D_{\\text{pupil}})$).',
    babId: 'a7',
  },
  {
    id: 'm-inst-ccd',
    kategori: 'Galaksi, Kosmologi & Instrumen',
    depan: 'Tuliskan alur kalibrasi citra CCD dari citra mentah (*raw*) ke citra terkalibrasi!',
    belakang: '$I_{\\text{kal}} = \\frac{I_{\\text{raw}} - \\text{Master Bias} - \\text{Master Dark}_{t}}{\\text{Master Flat}_{\\text{norm}}}$ (Dark harus berdurasi eksposur sama atau diskalakan).',
    babId: 'l6',
  },
  {
    id: 'm-gal-kurva-rotasi',
    kategori: 'Galaksi, Kosmologi & Instrumen',
    depan: 'Mengapa kurva rotasi galaksi spiral yang datar ($v(r) \\approx \\text{konstan}$) menjadi bukti materi gelap?',
    belakang: 'Dari $v^2 = GM(r)/r$, jika $v$ konstan di luar piringan terang maka massa terkurung harus tumbuh linear $M(r) \\propto r$, jauh melebihi massa bintang/gas bercahaya.',
    babId: 'l4',
  },
  {
    id: 'm-gal-hi',
    kategori: 'Galaksi, Kosmologi & Instrumen',
    depan: 'Berapa panjang gelombang dan frekuensi garis emisi atom Hidrogen netral (H I) untuk memetakan lengan spiral Bima Sakti?',
    belakang: '$\\lambda = 21{,}1\\text{ cm}$ ($\\nu \\approx 1420{,}4\\text{ MHz}$), berasal dari transisi *hyperfine spin-flip* elektron terhadap proton.',
    babId: 'l4',
  },
  {
    id: 'm-kos-hubble',
    kategori: 'Galaksi, Kosmologi & Instrumen',
    depan: 'Tuliskan Hukum Hubble–Lemaître dan makna $t_H = 1/H_0$!',
    belakang: '$v = H_0 d$ (untuk $z \\ll 1$), dengan $H_0 \\approx 67\\text{–}73\\text{ km s}^{-1}\\text{ Mpc}^{-1}$. Waktu Hubble $1/H_0 \\approx 14\\text{ miliar tahun}$ memberi taksiran orde usia alam semesta.',
    babId: 'l5',
  },
  {
    id: 'm-kos-faktor-skala',
    kategori: 'Galaksi, Kosmologi & Instrumen',
    depan: 'Bagaimana hubungan faktor skala kosmik $a(t)$, redshift $z$, dan suhu radiasi latar CMB $T(z)$?',
    belakang: '$1 + z = \\frac{a_0}{a(t)} = \\frac{1}{a}$ (dengan $a_0 = 1$), dan suhu CMB berubah seiring ekspansi sebagai $T(z) = T_0 (1 + z)$ dengan $T_0 \\approx 2{,}725\\text{ K}$.',
    babId: 'l5',
  },
]

export interface SoalKonstanta {
  id: string
  pertanyaan: string
  jawaban: number
  satuan: string
  toleransiRel: number
  tampilBenar: string
  penjelasan: string
}

export const LATIHAN_KONSTANTA: SoalKonstanta[] = [
  {
    id: 'k-au',
    pertanyaan: '1 Satuan Astronomi ($1\\text{ AU}$) dalam satuan kilometer ($\\text{km}$) — tulis dalam notasi ilmiah mis. `1.496e8`',
    jawaban: 1.496e8,
    satuan: 'km',
    toleransiRel: 0.02,
    tampilBenar: '1,496 × 10⁸ km',
    penjelasan: '1 AU = 1,496 × 10¹¹ m = 1,496 × 10⁸ km.',
  },
  {
    id: 'k-pc-ly',
    pertanyaan: 'Berapa tahun cahaya ($\\text{ly}$) dalam $1\\text{ parsek}$?',
    jawaban: 3.26,
    satuan: 'ly',
    toleransiRel: 0.02,
    tampilBenar: '3,26 ly',
    penjelasan: '1 pc = 3,086 × 10¹⁶ m dan 1 ly = 9,461 × 10¹⁵ m, sehingga 1 pc ≈ 3,26 ly.',
  },
  {
    id: 'k-pc-au',
    pertanyaan: 'Berapa AU dalam $1\\text{ parsek}$ (atau detik busur dalam $1\\text{ radian}$)?',
    jawaban: 206265,
    satuan: 'AU',
    toleransiRel: 0.02,
    tampilBenar: '206.265 AU',
    penjelasan: 'Karena definisi parsek berasal dari sudut paralaks 1″ = 1/206265 rad, maka 1 pc ≈ 206.265 AU.',
  },
  {
    id: 'k-c',
    pertanyaan: 'Kelajuan cahaya di ruang hampa $c$ dalam $\\text{m/s}$ (mis. `3e8`)',
    jawaban: 2.998e8,
    satuan: 'm/s',
    toleransiRel: 0.02,
    tampilBenar: '2,998 × 10⁸ m/s',
    penjelasan: 'c = 2,99792 × 10⁸ m/s ≈ 3 × 10⁸ m/s.',
  },
  {
    id: 'k-tsun',
    pertanyaan: 'Suhu efektif fotosfer Matahari $T_{\\text{eff},\\odot}$ dalam Kelvin',
    jawaban: 5778,
    satuan: 'K',
    toleransiRel: 0.03,
    tampilBenar: '5.778 K (≈ 5.800 K)',
    penjelasan: 'Matahari bertipe G2V dengan suhu efektif permukaan ~5.778 K.',
  },
  {
    id: 'k-msun',
    pertanyaan: 'Massa Matahari $M_\\odot$ dalam kilogram (notasi ilmiah mis. `1.99e30`)',
    jawaban: 1.989e30,
    satuan: 'kg',
    toleransiRel: 0.03,
    tampilBenar: '1,989 × 10³⁰ kg',
    penjelasan: 'Massa Matahari sekitar 1,989 × 10³⁰ kg (~333.000 kali massa Bumi).',
  },
  {
    id: 'k-lsun',
    pertanyaan: 'Luminositas Matahari $L_\\odot$ dalam Watt (mis. `3.83e26`)',
    jawaban: 3.828e26,
    satuan: 'W',
    toleransiRel: 0.03,
    tampilBenar: '3,828 × 10²⁶ W',
    penjelasan: 'Total daya radiasi Matahari di seluruh panjang gelombang adalah 3,828 × 10²⁶ W.',
  },
  {
    id: 'k-chandra',
    pertanyaan: 'Batas massa Chandrasekhar untuk katai putih dalam satuan $M_\\odot$',
    jawaban: 1.44,
    satuan: 'M_sun',
    toleransiRel: 0.04,
    tampilBenar: '1,44 M☉',
    penjelasan: 'Batas Chandrasekhar ≈ 1,44 massa Matahari.',
  },
  {
    id: 'k-cmb',
    pertanyaan: 'Suhu radiasi latar gelombang mikro kosmik (CMB) saat ini dalam Kelvin',
    jawaban: 2.725,
    satuan: 'K',
    toleransiRel: 0.03,
    tampilBenar: '2,725 K',
    penjelasan: 'Spektrum benda hitam CMB terukur amat presisi pada T₀ = 2,725 K.',
  },
  {
    id: 'k-pogson',
    pertanyaan: 'Selisih 5 magnitudo setara dengan perbandingan fluks tepat sebesar…',
    jawaban: 100,
    satuan: '—',
    toleransiRel: 0.01,
    tampilBenar: '100',
    penjelasan: 'Skala Pogson didefinisikan agar Δm = 5 tepat berarti rasio fluks 100 (100^(1/5) ≈ 2,512 per 1 magnitudo).',
  },
  {
    id: 'k-hi',
    pertanyaan: 'Panjang gelombang garis emisi Hidrogen netral (H I) dalam sentimeter ($\\text{cm}$)',
    jawaban: 21.1,
    satuan: 'cm',
    toleransiRel: 0.02,
    tampilBenar: '21,1 cm',
    penjelasan: 'Transisi hyperfine atom Hidrogen netral memancarkan gelombang radio 21,1 cm (1420,4 MHz).',
  },
  {
    id: 'k-sinodis',
    pertanyaan: 'Periode sinodis Bulan (dari purnama ke purnama berikutnya) dalam hari',
    jawaban: 29.53,
    satuan: 'hari',
    toleransiRel: 0.02,
    tampilBenar: '29,53 hari',
    penjelasan: 'Bulan sinodis 29,53 hari lebih lama dari bulan sideris (27,32 hari) karena Bumi ikut bergerak mengelilingi Matahari.',
  },
]

export interface SoalUrutan {
  id: string
  judul: string
  kriteria: string
  itemBenar: string[]
  penjelasan: string
}

export const LATIHAN_URUTAN: SoalUrutan[] = [
  {
    id: 'u-spektrum',
    judul: 'Kelas Spektrum Bintang',
    kriteria: 'Urutkan dari suhu permukaan TERPANAS ke TERDINGIN',
    itemBenar: ['O (>30.000 K)', 'B (Biru-putih)', 'A (Putih)', 'F (Kuning-putih)', 'G (Matahari ~5800 K)', 'K (Jingga)', 'M (<3700 K)'],
    penjelasan: 'Urutan klasik Harvard: O – B – A – F – G – K – M.',
  },
  {
    id: 'u-matahari',
    judul: 'Struktur Lapisan Matahari',
    kriteria: 'Urutkan dari bagian TERDALAM ke lapisan TERLUAR',
    itemBenar: ['Inti', 'Zona Radiatif', 'Zona Konvektif', 'Fotosfer', 'Kromosfer', 'Korona'],
    penjelasan: 'Energi fusi di inti merambat secara radiatif, lalu konvektif, keluar lewat fotosfer, kromosfer, hingga korona.',
  },
  {
    id: 'u-tangga-jarak',
    judul: 'Tangga Jarak Kosmik',
    kriteria: 'Urutkan metode dari jangkauan TERDEKAT ke TERJAUH',
    itemBenar: ['Radar Tata Surya', 'Paralaks Trigonometri', 'Variabel Cepheid', 'Supernova Tipe Ia', 'Redshift Kosmologis'],
    penjelasan: 'Setiap anak tangga dikalibrasi oleh anak tangga di bawahnya hingga skala kosmologis.',
  },
  {
    id: 'u-em',
    judul: 'Spektrum Gelombang Elektromagnetik',
    kriteria: 'Urutkan dari panjang gelombang TERPENDEK (energi tertinggi) ke TERPANJANG',
    itemBenar: ['Sinar Gamma', 'Sinar-X', 'Ultraviolet (UV)', 'Cahaya Tampak', 'Inframerah (IR)', 'Gelombang Radio'],
    penjelasan: 'E = hc/λ: makin pendek panjang gelombang λ, makin tinggi energi fotonnya.',
  },
  {
    id: 'u-magnitudo',
    judul: 'Skala Terang Magnitudo Semu',
    kriteria: 'Urutkan dari objek PALING TERANG ke PALING REDUP di langit',
    itemBenar: ['Matahari (−26,7)', 'Bulan Purnama (−12,7)', 'Venus maks (−4,6)', 'Sirius (−1,46)', 'Batas Mata Telanjang (+6,0)'],
    penjelasan: 'Ingat: makin negatif nilai magnitudo, makin terang objeknya!',
  },
  {
    id: 'u-evolusi',
    judul: 'Tahap Hidup Bintang Bermassa Matahari (~1 M☉)',
    kriteria: 'Urutkan dari fase AWAL ke fase AKHIR',
    itemBenar: ['Awan Molekul / Protobintang', 'Deret Utama (Fusi H)', 'Raksasa Merah (Fusi He)', 'Nebula Planet', 'Katai Putih'],
    penjelasan: 'Bintang bermassa rendah-menengah tidak meledak menjadi supernova, melainkan melepaskan selubung menjadi nebula planet dan meninggalkan katai putih.',
  },
]

export interface ItemRumus {
  id: string
  topik: string
  nama: string
  rumus: string
  keterangan: string
  catatan?: string
}

export const LEMBAR_RUMUS: ItemRumus[] = [
  {
    id: 'r-paralaks',
    topik: 'Pengantar Astronomi',
    nama: 'Jarak Paralaks',
    rumus: 'd\\text{ (pc)} = \\frac{1}{p\\text{ (detik busur)}}',
    keterangan: 'd dalam parsek, p dalam detik busur (″). 1 pc = 3,26 ly = 206.265 AU.',
  },
  {
    id: 'r-sudut-kecil',
    topik: 'Matematika & Optik',
    nama: 'Aproksimasi Sudut Kecil',
    rumus: '\\theta\\text{ (rad)} \\approx \\frac{D}{d}, \\qquad \\theta\\text{\'\'} \\approx 206.265 \\frac{D}{d}',
    keterangan: 'D diameter linear objek, d jarak ke objek (satuan panjang sama).',
  },
  {
    id: 'r-pogson',
    topik: 'Radiasi & Magnitudo',
    nama: 'Persamaan Pogson',
    rumus: 'm_1 - m_2 = -2{,}5 \\log_{10}\\left(\\frac{F_1}{F_2}\\right)',
    keterangan: 'Selisih 5 mag = rasio fluks 100. Magnitudo kecil berarti lebih terang.',
  },
  {
    id: 'r-modulus',
    topik: 'Radiasi & Magnitudo',
    nama: 'Modulus Jarak & Ekstingsi',
    rumus: 'm - M = 5\\log_{10}(d_{\\text{pc}}) - 5 + A',
    keterangan: 'm magnitudo semu, M magnitudo mutlak (pada 10 pc), A serapan debu (mag).',
  },
  {
    id: 'r-fluks',
    topik: 'Radiasi & Magnitudo',
    nama: 'Fluks & Hukum Kuadrat Terbalik',
    rumus: 'F = \\frac{L}{4\\pi d^2}',
    keterangan: 'L luminositas (W), d jarak (m), F fluks energi yang diterima (W/m²).',
  },
  {
    id: 'r-sb',
    topik: 'Radiasi & Magnitudo',
    nama: 'Hukum Stefan–Boltzmann',
    rumus: 'L = 4\\pi R^2 \\sigma T_{\\text{eff}}^4',
    keterangan: 'R jejari bintang, σ = 5,67 × 10⁻⁸ W m⁻² K⁻⁴, T_eff suhu efektif (K).',
  },
  {
    id: 'r-wien',
    topik: 'Radiasi & Magnitudo',
    nama: 'Hukum Pergeseran Wien',
    rumus: '\\lambda_{\\max} T = b \\approx 2{,}898 \\times 10^{-3}\\text{ m}\\cdot\\text{K}',
    keterangan: 'λ_max adalah panjang gelombang puncak spektrum benda hitam.',
  },
  {
    id: 'r-lst',
    topik: 'Astronomi Bola & Waktu',
    nama: 'Waktu Sideris Lokal & Sudut Jam',
    rumus: 'LST = HA + \\alpha',
    keterangan: 'LST waktu sideris lokal, HA sudut jam, α asensio rekta (semuanya dalam jam).',
  },
  {
    id: 'r-pzs',
    topik: 'Astronomi Bola & Waktu',
    nama: 'Segitiga Bola PZS (Ketinggian Bintang)',
    rumus: '\\sin h = \\cos z = \\sin\\phi\\sin\\delta + \\cos\\phi\\cos\\delta\\cos H',
    keterangan: 'h ketinggian (altitude), z jarak zenit, φ lintang pengamat, δ deklinasi, H sudut jam.',
  },
  {
    id: 'r-azimuth',
    topik: 'Astronomi Bola & Waktu',
    nama: 'Ketinggian Kulminasi Atas',
    rumus: 'h_{\\max} = 90^\\circ - |\\phi - \\delta|',
    keterangan: 'Berlaku saat objek melintasi meridian atas (HA = 0).',
  },
  {
    id: 'r-sinodis',
    topik: 'Waktu & Orbit',
    nama: 'Periode Sinodis',
    rumus: '\\frac{1}{S} = \\left|\\frac{1}{P} - \\frac{1}{P_\\oplus}\\right|',
    keterangan: 'S periode sinodis, P periode sideris benda langit, P_⊕ = 1 tahun sideris.',
  },
  {
    id: 'r-kepler3',
    topik: 'Mekanika Langit',
    nama: 'Hukum III Kepler (Umum)',
    rumus: 'P^2 = \\frac{4\\pi^2}{G(M_1 + M_2)} a^3',
    keterangan: 'P periode orbit, a setengah sumbu panjang orbit relatif, M₁ + M₂ massa total.',
  },
  {
    id: 'r-visviva',
    topik: 'Mekanika Langit',
    nama: 'Persamaan Vis-Viva',
    rumus: 'v^2 = G(M + m)\\left(\\frac{2}{r} - \\frac{1}{a}\\right)',
    keterangan: 'v laju sesaat pada jarak r untuk orbit ber-setengah sumbu panjang a.',
  },
  {
    id: 'r-elips',
    topik: 'Mekanika Langit',
    nama: 'Geometri Orbit Elips',
    rumus: 'r_p = a(1 - e), \\quad r_a = a(1 + e), \\quad b = a\\sqrt{1 - e^2}',
    keterangan: 'r_p jarak perihelion/periastron, r_a jarak aphelion/apastron, e eksentrisitas.',
  },
  {
    id: 'r-teq',
    topik: 'Tata Surya & Eksoplanet',
    nama: 'Suhu Kesetimbangan Planet',
    rumus: 'T_{\\text{eq}} = T_* \\sqrt{\\frac{R_*}{2d}}(1 - A)^{1/4}',
    keterangan: 'A albedo Bond planet, d jarak orbit dari bintang bermodel benda hitam T_*.',
  },
  {
    id: 'r-transit',
    topik: 'Tata Surya & Eksoplanet',
    nama: 'Kedalaman Transit Eksoplanet',
    rumus: '\\frac{\\Delta F}{F} \\approx \\left(\\frac{R_p}{R_*}\\right)^2',
    keterangan: 'R_p jejari planet, R_* jejari bintang induk.',
  },
  {
    id: 'r-roche',
    topik: 'Tata Surya & Eksoplanet',
    nama: 'Batas Roche (Satelit Cair)',
    rumus: 'd_{\\text{Roche}} \\approx 2{,}44\\,R_p \\left(\\frac{\\rho_p}{\\rho_s}\\right)^{1/3}',
    keterangan: 'Jarak terdekat sebelum gaya pasang surut planet menghancurkan satelit.',
  },
  {
    id: 'r-rayleigh',
    topik: 'Instrumen & Observasi',
    nama: 'Batas Resolusi Difraksi',
    rumus: '\\theta_{\\text{rad}} = 1{,}22\\frac{\\lambda}{D}',
    keterangan: 'λ panjang gelombang pengamatan, D diameter bukaan objektif teleskop.',
  },
  {
    id: 'r-teleskop',
    topik: 'Instrumen & Observasi',
    nama: 'Perbesaran & Rasio Fokus',
    rumus: 'M = \\frac{f_{\\text{obj}}}{f_{\\text{ok}}}, \\qquad f/\\# = \\frac{f_{\\text{obj}}}{D}',
    keterangan: 'f_obj panjang fokus objektif, f_ok panjang fokus okuler, D diameter bukaan.',
  },
  {
    id: 'r-doppler',
    topik: 'Spektroskopi & Bintang',
    nama: 'Pergeseran Doppler',
    rumus: '\\frac{\\Delta \\lambda}{\\lambda_0} = z \\approx \\frac{v_r}{c}',
    keterangan: 'v_r kecepatan radial (+ menjauh / redshift, − mendekat / blueshift).',
  },
  {
    id: 'r-hubble',
    topik: 'Galaksi & Kosmologi',
    nama: 'Hukum Hubble–Lemaître',
    rumus: 'v = H_0 d, \\qquad 1 + z = \\frac{1}{a(t)}',
    keterangan: 'v kecepatan resesi (untuk z ≪ 1), d jarak, H₀ konstanta Hubble, a(t) faktor skala.',
  },
]

export interface IstilahGlosarium {
  istilah: string
  kategori: string
  definisi: string
}

export const GLOSARIUM_OSN: IstilahGlosarium[] = [
  {
    istilah: 'Asensio Rekta (α / RA)',
    kategori: 'Astronomi Bola',
    definisi: 'Koordinat timur–barat di bola langit (setara bujur di Bumi), diukur ke arah timur dari titik Vernal Equinox dalam satuan jam (0h–24h) atau derajat.',
  },
  {
    istilah: 'Deklinasi (δ / Dec)',
    kategori: 'Astronomi Bola',
    definisi: 'Jarak sudut sebuah benda langit di utara (+) atau selatan (−) ekuator langit, bernilai −90° sampai +90° (analog lintang geografis).',
  },
  {
    istilah: 'Ekliptika',
    kategori: 'Astronomi Bola',
    definisi: 'Lingkaran besar di bola langit yang merupakan lintasan semu tahunan Matahari (proyeksi bidang orbit Bumi), miring ≈ 23,44° terhadap ekuator langit.',
  },
  {
    istilah: 'Vernal Equinox (Titik Aries / ♈)',
    kategori: 'Astronomi Bola',
    definisi: 'Titik potong ekliptika dan ekuator langit ketika Matahari bergerak dari selatan ke utara sekitar 20–21 Maret; menjadi acuan α = 0h.',
  },
  {
    istilah: 'Kulminasi Atas & Bawah',
    kategori: 'Astronomi Bola',
    definisi: 'Perlintasan benda langit di meridian pengamat. Kulminasi atas (HA = 0h) memberi ketinggian tertinggi; kulminasi bawah (HA = 12h) memberi ketinggian terendah.',
  },
  {
    istilah: 'Bintang Sirkumpolar',
    kategori: 'Astronomi Bola',
    definisi: 'Bintang yang tidak pernah terbenam di bawah horizon dari lokasi lintang pengamat tertentu, karena jaraknya ke kutub langit lebih kecil daripada ketinggian kutub.',
  },
  {
    istilah: 'Paralaks Trigonometri',
    kategori: 'Pengukuran Jarak',
    definisi: 'Pergeseran sudut semu bintang dekat terhadap bintang latar jauh akibat gerak revolusi Bumi dengan basis 1 AU; d(pc) = 1/p(″).',
  },
  {
    istilah: 'Modulus Jarak',
    kategori: 'Fotometri',
    definisi: 'Selisih antara magnitudo semu dan mutlak (m − M) yang langsung menyatakan jarak bintang dalam skala logaritmik.',
  },
  {
    istilah: 'Ekstingsi & Pemredihan (Reddening)',
    kategori: 'Fotometri & ISM',
    definisi: 'Pelemahan cahaya bintang oleh debu antarbintang; panjang gelombang biru lebih banyak dihamburkan sehingga bintang tampak lebih redup dan lebih merah.',
  },
  {
    istilah: 'Diagram Hertzsprung–Russell (H–R)',
    kategori: 'Astrofisika Bintang',
    definisi: 'Plot luminositas (atau magnitudo mutlak) terhadap suhu efektif (atau kelas spektrum / B−V, dengan suhu tinggi di kiri).',
  },
  {
    istilah: 'Deret Utama (Main Sequence)',
    kategori: 'Astrofisika Bintang',
    definisi: 'Pita diagonal pada diagram H–R tempat bintang menghabiskan sebagian besar hidupnya dengan membakar Hidrogen menjadi Helium di inti.',
  },
  {
    istilah: 'Batas Chandrasekhar',
    kategori: 'Evolusi Bintang',
    definisi: 'Massa maksimum stabil (~1,44 M☉) yang dapat ditopang oleh tekanan degenerasi elektron pada katai putih.',
  },
  {
    istilah: 'Batas Roche',
    kategori: 'Mekanika Langit',
    definisi: 'Jarak minimum di mana benda yang hanya ditahan oleh gravitasinya sendiri dapat mendekati benda induk tanpa hancur akibat gaya pasang surut.',
  },
  {
    istilah: 'Titik Lagrange (L1–L5)',
    kategori: 'Mekanika Langit',
    definisi: 'Lima posisi kesetimbangan gravitasi-sentrifugal dalam masalah tiga benda terbatas; L2 sering dipakai teleskop ruang angkasa seperti JWST.',
  },
  {
    istilah: 'Albedo Bond',
    kategori: 'Tata Surya',
    definisi: 'Fraksi total daya radiasi bintang yang dipantulkan kembali ke angkasa oleh planet ke segala arah pada seluruh panjang gelombang (bernilai 0–1).',
  },
  {
    istilah: 'Garis Salju (Frost / Snow Line)',
    kategori: 'Tata Surya',
    definisi: 'Jarak di cakram protoplanet saat suhu cukup rendah (~150–170 K) agar senyawa volatil seperti air dapat membeku menjadi es.',
  },
  {
    istilah: 'Seeing Astronomi',
    kategori: 'Instrumen & Observasi',
    definisi: 'Keburaman dan kedipan citra bintang akibat turbulensi atmosfer Bumi; pada situs observasi baik bernilai ~0,5″–1,5″.',
  },
  {
    istilah: 'Signal-to-Noise Ratio (SNR)',
    kategori: 'Analisis Data',
    definisi: 'Perbandingan antara sinyal objek yang diukur dan total derau (derau foton Poisson, latar langit, arus gelap, dan readout noise CCD).',
  },
  {
    istilah: 'Bintang Variabel Cepheid',
    kategori: 'Galaksi & Jarak',
    definisi: 'Bintang raksasa berdenyut dengan hubungan Periode–Luminositas ketat (Hukum Leavitt), menjadi lilin standar untuk mengukur jarak galaksi.',
  },
  {
    istilah: 'Redshift Kosmologis',
    kategori: 'Kosmologi',
    definisi: 'Pemanjangan panjang gelombang cahaya dari galaksi jauh akibat pemekaran ruang itu sendiri (1 + z = a₀/a), bukan semata gerak lokal Doppler.',
  },
]
