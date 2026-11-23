// Manifest murni (tanpa React/DOM) — diimpor validator konten.
export const GAMBAR_IDS = [
  'skala-log',
  'kepler-loglog',
  'orbit-lingkaran-rasio',
  'pola-airy',
  'tingkat-energi-hidrogen',
  'lingkaran-satuan',
  'segitiga-vektor',
  'paralaks-tahunan',
  'bola-langit',
  'segitiga-bola',
  'fase-bulan',
  'gerhana-geometri',
  'elips-orbit',
  'transfer-hohmann',
  'warna-suhu',
  'kurva-benda-hitam',
  'spektrum-absorpsi',
  'spektrum-emisi',
  'tangga-magnitudo',
  'modulus-jarak-grafik',
  'kurva-transit',
  'skala-tata-surya',
  'refraktor',
  'hr-skematis',
  'hr-iso-radius',
  'hr-evolusi',
  'kurva-gerhana',
  'kurva-kecepatan-radial',
  'kurva-rotasi',
  'lensa-gravitasi',
  'ekspansi-redshift',
  'hubble-diagram',
  'kurva-transit-data',
  'kurva-cahaya-variabel',
  'doppler-geser',
] as const

export type GambarId = (typeof GAMBAR_IDS)[number]

export const GAMBAR_SET = new Set<string>(GAMBAR_IDS)

export interface MetaGambar {
  judul: string
  caption: string
  label: string
}

export const META_GAMBAR: Record<GambarId, MetaGambar> = {
  'skala-log': {
    judul: 'Skala linear vs logaritmik',
    label: 'Perbandingan skala linear dan logaritmik',
    caption:
      'Pada skala linear, 10 dan 100 berimpit di ujung kanan. Pada skala log, jarak 1→10 sama dengan 10→100 dan 100→1000 — setiap faktor sepuluh mendapat ruang yang sama.',
  },
  'kepler-loglog': {
    judul: 'Hukum Kepler ketiga pada skala log–log',
    label: 'Grafik log T terhadap log a dengan garis lurus kemiringan 1,5',
    caption:
      'Untuk T² ∝ a³, grafik log T terhadap log a berupa garis lurus dengan kemiringan 3/2. Kemiringan inilah yang dibaca dari grafik, bukan dari bentuk kurva aslinya.',
  },
  'orbit-lingkaran-rasio': {
    judul: 'Dua orbit lingkaran: radius empat kali, kecepatan setengah',
    label: 'Dua orbit lingkaran dengan radius berbeda',
    caption:
      'Kecepatan orbit berkurang sebagai 1/√r, sedangkan periode bertambah sebagai r^(3/2). Satelit pada radius 4R bergerak dua kali lebih lambat dan menyelesaikan satu putaran delapan kali lebih lama.',
  },
  'pola-airy': {
    judul: 'Pola difraksi dari bukaan melingkar',
    label: 'Pola Airy: cakram terang dengan cincin konsentris',
    caption:
      'Gambar sebuah bintang titik bukan titik sempurna, melainkan cakram terang dengan cincin di sekelilingnya. Lebar pola menentukan daya pisah teleskop; ukurannya mengecil bila diameter bukaan membesar.',
  },
  'tingkat-energi-hidrogen': {
    judul: 'Tingkat energi hidrogen dan transisi',
    label: 'Diagram tingkat energi hidrogen n=1 sampai n=4 dengan transisi',
    caption:
      'Selisih antar tingkat menentukan warna garis. Lompatan dari n = 2 ke n = 1 paling besar, sehingga fotonnya paling energetik dan panjang gelombangnya paling pendek.',
  },
  'lingkaran-satuan': {
    judul: 'Lingkaran satuan: sinus dan kosinus',
    label: 'Lingkaran satuan dengan sudut, proyeksi sinus dan kosinus',
    caption:
      'Titik pada lingkaran satuan berjarak 1 dari pusat. Proyeksi vertikalnya adalah sin θ dan horizontalnya cos θ. Astronomi bola memakai hubungan ini untuk mengurai posisi bintang.',
  },
  'segitiga-vektor': {
    judul: 'Penjumlahan vektor dengan komponen',
    label: 'Dua vektor dijumlahkan menjadi resultan dengan komponen x dan y',
    caption:
      'Vektor diurai menjadi komponen x dan y, dijumlahkan per komponen, lalu disusun kembali menjadi resultan. Metode ini dipakai untuk kecepatan, gaya, dan momentum.',
  },
  'paralaks-tahunan': {
    judul: 'Paralaks tahunan',
    label: 'Diagram paralaks tahunan bintang dekat terhadap latar bintang jauh',
    caption:
      'Bumi mengorbit Matahari; bintang dekat bergeser terhadap latar bintang jauh. Semakin besar geseran p, semakin dekat bintang itu. Definisi 1 parsec berasal dari p = 1 detik busur.',
  },
  'bola-langit': {
    judul: 'Bola langit untuk pengamat di lintang utara',
    label: 'Diagram bola langit dengan horizon, zenith, meridian, dan kutub langit',
    caption:
      'Horizon membatasi langit yang terlihat. Meridian menghubungkan utara, zenith, dan selatan. Ekuator langit miring terhadap horizon sebesar 90° − |φ|, dan kutub langit berada pada altitude |φ|.',
  },
  'segitiga-bola': {
    judul: 'Segitiga bola P–Z–S',
    label: 'Segitiga bola dengan titik kutub, zenith, dan bintang',
    caption:
      'Kutub langit P, zenith Z, dan bintang S. Sisi PZ bergantung pada lintang, sisi PS pada deklinasi, dan sudut di P adalah sudut jam. Aturan kosinus bola menghubungkan ketiganya dengan jarak zenith.',
  },
  'fase-bulan': {
    judul: 'Delapan posisi Bulan mengelilingi Bumi',
    label: 'Delapan fase Bulan mengelilingi Bumi dengan arah sinar Matahari dari kiri',
    caption:
      'Separuh Bulan selalu disinari Matahari; yang berubah adalah bagian yang menghadap Bumi. Fase baru terjadi saat Bulan berada di antara Matahari dan Bumi, fase purnama saat Bumi berada di antara keduanya.',
  },
  'gerhana-geometri': {
    judul: 'Geometri gerhana: umbra dan penumbra',
    label: 'Kerucut umbra dan penumbra saat Bulan menutupi Matahari',
    caption:
      'Bulan membentuk kerucut umbra (gelap total) dan penumbra (sebagian). Pengamat di umbra melihat gerhana total; di penumbra melihat gerhana sebagian. Panjang kerucut menentukan jenis gerhana.',
  },
  'elips-orbit': {
    judul: 'Elips orbit dan dua fokus',
    label: 'Elips orbit dengan Matahari di salah satu fokus, perihelion dan aphelion',
    caption:
      'Matahari berada di salah satu fokus, bukan di pusat elips. Jarak terdekat r_p = a(1 − e) dan terjauh r_a = a(1 + e); jumlah keduanya selalu 2a.',
  },
  'transfer-hohmann': {
    judul: 'Transfer Hohmann Bumi–Mars',
    label: 'Diagram transfer Hohmann dari orbit Bumi ke orbit Mars',
    caption:
      'Kendaraan menambah kecepatan di perihelion (dekat Bumi), mengikuti setengah elips, lalu menyesuaikan kecepatan di aphelion (dekat Mars). Seluruh perjalanan memakan setengah periode elips transfer.',
  },
  'warna-suhu': {
    judul: 'Garis warna–suhu',
    label: 'Deret warna bintang dari biru panas ke merah dingin dengan suhu perkiraan',
    caption:
      'Warna bukan label sembarang: ia mengurutkan suhu permukaan. Debu dapat membuat bintang tampak lebih merah daripada warna intrinsiknya, sehingga astronom mengoreksi pemredihan sebelum menaksir suhu.',
  },
  'kurva-benda-hitam': {
    judul: 'Kurva benda hitam pada tiga suhu',
    label: 'Tiga kurva Planck: puncak bergeser ke biru dan naik saat suhu bertambah',
    caption:
      'Setiap suhu memberi kurva Planck tersendiri. Wien: puncak bergeser ke panjang gelombang lebih pendek saat T naik. Stefan–Boltzmann: luas di bawah kurva (daya total) tumbuh sebagai T⁴.',
  },
  'spektrum-absorpsi': {
    judul: 'Spektrum absorpsi bintang',
    label: 'Pita spektrum kontinu dengan garis gelap absorpsi pada panjang gelombang tertentu',
    caption:
      'Cahaya kontinu dari fotosfer melewati atmosfer bintang yang lebih dingin; atom menyerap panjang gelombang tertentu dan meninggalkan garis gelap. Pola garis adalah sidik jari unsur.',
  },
  'spektrum-emisi': {
    judul: 'Spektrum emisi gas tipis',
    label: 'Garis terang emisi pada panjang gelombang diskret di latar gelap',
    caption:
      'Gas tipis yang tereksitasi memancarkan foton hanya pada panjang gelombang diskret — kebalikan dari spektrum absorpsi. Deret Balmer hidrogen muncul sebagai garis terang di daerah tampak.',
  },
  'tangga-magnitudo': {
    judul: 'Tangga magnitudo: lebih kecil = lebih terang',
    label: 'Skala magnitudo terbalik dengan fluks relatif tiap selisih 5 magnitudo',
    caption:
      'Magnitudo bersifat logaritmik dan terbalik: selisih 5 magnitudo tepat 100× fluks, sehingga satu magnitudo ≈ 2,512×. Bintang magnitudo 1 jauh lebih terang daripada magnitudo 6.',
  },
  'modulus-jarak-grafik': {
    judul: 'Modulus jarak terhadap jarak (log)',
    label: 'Grafik m − M naik linear terhadap log d dengan kemiringan 5',
    caption:
      'm − M = 5 log(d/10 pc). Pada sumbu log d, hubungan ini garis lurus bergradien 5. Membaca modulus dari grafik memberi jarak; ekstingsi Aᵥ menggeser seluruh garis ke atas.',
  },
  'kurva-transit': {
    judul: 'Kurva cahaya transit',
    label: 'Kurva cahaya transit dengan penurunan fluks dan label kedalaman',
    caption:
      'Fluks sedikit turun saat planet melintas di depan bintang, lalu pulih. Kedalaman kurva menentukan rasio radius planet–bintang; jarak antara dua lembah menentukan periode orbit.',
  },
  'skala-tata-surya': {
    judul: 'Skala jarak planet dari Matahari',
    label: 'Posisi relatif delapan planet pada sumbu jarak logaritmik',
    caption:
      'Jarak planet membentang dari 0,39 AU (Merkurius) sampai 30 AU (Neptunus). Pada skala log, planet dalam terpisah jelas sementara planet luar menempati rentang yang sama besar.',
  },
  refraktor: {
    judul: 'Berkas cahaya pada refraktor',
    label: 'Diagram refraktor: lensa objektif, bidang fokus, okuler, dan mata pengamat',
    caption:
      'Lensa objektif mengumpulkan cahaya dan memfokuskannya pada jarak f_obj. Lensa okuler kemudian memperbesar bayangan itu. Perbesaran hanya rasio dua panjang fokus, sedangkan jumlah cahaya ditentukan diameter objektif.',
  },
  'hr-skematis': {
    judul: 'Diagram HR skematis',
    label: 'Diagram Hertzsprung-Russell skematis dengan deret utama, raksasa, dan katai putih',
    caption:
      'Suhu meningkat ke kiri. Deret utama membentang diagonal; raksasa berada di kanan atas, katai putih di kiri bawah. Posisi sebuah bintang memberi suhu dan luminositasnya sekaligus, sehingga radius dapat ditaksir.',
  },
  'hr-iso-radius': {
    judul: 'Garis iso-radius pada diagram HR',
    label: 'Diagram HR dengan garis diagonal radius tetap 0,1 / 1 / 10 / 100 R☉',
    caption:
      'Dari L = 4πR²σT⁴, garis radius tetap muncul sebagai diagonal pada HR. Bintang di atas garis R☉ lebih besar dari Matahari pada suhu yang sama; di bawahnya lebih kecil.',
  },
  'hr-evolusi': {
    judul: 'Jejak evolusi di HR diagram',
    label: 'Jejak evolusi bintang dari deret utama ke raksasa, lalu katai putih',
    caption:
      'Bintang deret utama bergerak ke kanan atas saat menjadi raksasa merah, lalu ke kiri (suhu naik) selama pembakaran helium, lalu turun tajam menjadi katai putih. Posisi di HR diagram memberi tahap evolusinya.',
  },
  'kurva-gerhana': {
    judul: 'Kurva cahaya bintang gerhana',
    label: 'Kurva cahaya bintang gerhana dengan dua minimum berbeda kedalaman',
    caption:
      'Di luar gerhana fluks konstan. Minimum primer (dalam) terjadi saat bintang lebih panas tertutup; minimum sekunder (lebih dangkal) saat bintang lebih dingin tertutup. Selisih kedalaman memberi petunjuk suhu relatif.',
  },
  'kurva-kecepatan-radial': {
    judul: 'Kurva kecepatan radial bintang ganda',
    label: 'Kurva kecepatan radial sinusoidal dengan semi-amplitudo K dan periode P',
    caption:
      'Bintang yang mengorbit pusat massa memperlihatkan kecepatan radial naik-turun secara periodik. Semi-amplitudo K dan periode P memberi fungsi massa — jalan menuju massa bintang tak terlihat.',
  },
  'kurva-rotasi': {
    judul: 'Kurva rotasi galaksi',
    label: 'Kurva rotasi galaksi: datar dibandingkan prediksi Kepler yang menurun',
    caption:
      'Kurva teramati naik lalu mendatar, sedangkan prediksi dari massa cahaya saja (garis putus) menurun seperti orbit Kepler. Selisihnya dijelaskan oleh halo materi gelap yang masif tetapi tidak memancarkan cahaya.',
  },
  'lensa-gravitasi': {
    judul: 'Lensa gravitasi oleh gugus galaksi',
    label: 'Cahaya galaksi latar dibelokkan massa gugus menjadi busur dan citra ganda',
    caption:
      'Massa gugus melengkungkan ruang sehingga cahaya galaksi latar berbelok, membentuk busur atau citra ganda. Pembelokan ini mengukur massa total — termasuk materi gelap yang tak terlihat.',
  },
  'ekspansi-redshift': {
    judul: 'Ekspansi dan peregangan panjang gelombang',
    label: 'Tiga panel ekspansi alam semesta memperlihatkan grid yang membesar dan panjang gelombang yang meregang',
    caption:
      'Grid ruang mengembang dari kiri (masa lalu, faktor skala kecil) ke kanan (sekarang). Jarak antargalaksi bertambah, dan panjang gelombang foton yang merambat ikut teregang dengan faktor yang sama.',
  },
  'hubble-diagram': {
    judul: 'Diagram Hubble: kecepatan vs jarak',
    label: 'Sebaran galaksi dengan garis lurus v = H₀ d kemiringan 70 km/s/Mpc',
    caption:
      'Kecepatan resesi galaksi sebanding dengan jaraknya: v = H₀ d. Kemiringan garis adalah konstanta Hubble; sebaran titik di sekitarnya mencerminkan gerak peculiar dan galat pengukuran.',
  },
  'kurva-transit-data': {
    judul: 'Kurva cahaya transit dengan data terukur',
    label: 'Kurva cahaya transit dengan titik data dan model kotak membulat',
    caption:
      'Titik adalah pengukuran, garis adalah model. Kedalaman memberi rasio radius; lebar penurunan memberi durasi; jarak antarpusat penurunan memberi periode. Perhatikan sebaran titik di luar transit: itu galat acak yang harus dilaporkan.',
  },
  'kurva-cahaya-variabel': {
    judul: 'Kurva cahaya bintang variabel',
    label: 'Kurva cahaya periodik dengan magnitudo naik-turun terhadap fase',
    caption:
      'Bintang variabel berubah terang secara periodik. Sumbu magnitudo terbalik (puncak = paling terang). Periode dan amplitudo adalah kunci klasifikasi, misalnya Cepheid untuk tangga jarak.',
  },
  'doppler-geser': {
    judul: 'Geseran Doppler garis spektrum',
    label: 'Garis spektrum diam dibanding garis tergeser merah dan biru',
    caption:
      'Sumber yang menjauh menggeser garis ke merah (λ lebih panjang); yang mendekat ke biru. Besar geseran Δλ/λ = v/c memberi kecepatan radial — dasar deteksi eksoplanet dan ekspansi alam semesta.',
  },
}