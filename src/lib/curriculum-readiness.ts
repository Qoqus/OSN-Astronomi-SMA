import type { LearningState } from '@/types'
import type { Bab } from '../../content/index'
import { rincianPenguasaanBab } from './chapter-status'

export type TipeGerbangChecklist = 'derivasi' | 'logika' | 'fermi' | 'observasi' | 'konsep'

export interface ItemChecklist {
  id: string
  gerbang: TipeGerbangChecklist
  teks: string
}

export const CHECKLIST_REGISTRY: Record<string, ItemChecklist[]> = {
  f1: [
    {
      id: 'f1-m1',
      gerbang: 'observasi',
      teks: 'Membedakan nilai definisi eksak IAU (1 au, c, M_bol=0) vs konstanta empiris (G) beserta aturan angka penting logaritma (mantisa).',
    },
    {
      id: 'f1-m2',
      gerbang: 'derivasi',
      teks: 'Menggunakan analisis dimensional untuk menguji persamaan baru dan menurunkan bentuk hukum skala (seperti t_ff ∝ (Gρ)^(-1/2)).',
    },
    {
      id: 'f1-m3',
      gerbang: 'derivasi',
      teks: 'Mengonversi hukum pangkat ke grafik log–log dan eksponensial ke semi-log serta memaknai gradien dan intersepnya.',
    },
    {
      id: 'f1-m4',
      gerbang: 'fermi',
      teks: 'Menghitung estimasi Fermi orde besar (atom bintang, laju foton, t_KH vs t_nuk) tanpa kalkulator.',
    },
    {
      id: 'f1-m5',
      gerbang: 'logika',
      teks: 'Menjelaskan mengapa magnitudo tidak boleh dijumlahkan langsung dan kapan aproksimasi sudut kecil & d = 1/p gagal.',
    },
  ],
  f2: [
    {
      id: 'f2-m1',
      gerbang: 'logika',
      teks: 'Menjelaskan arti geometris lingkaran besar pada bola langit dan perbedaan sifat jarak datar vs sferis.',
    },
    {
      id: 'f2-m2',
      gerbang: 'derivasi',
      teks: 'Menurunkan hukum kosinus sisi dan sudut bola menggunakan aljabar vektor dot-product 3D.',
    },
    {
      id: 'f2-m3',
      gerbang: 'derivasi',
      teks: 'Menurunkan hukum sinus bola dari produk silang (cross product) vektor posisi unit.',
    },
    {
      id: 'f2-m4',
      gerbang: 'derivasi',
      teks: 'Menghitung galat pemotongan Taylor pada aproksimasi sudut kecil sin θ ≈ θ dan cos θ ≈ 1 - θ²/2.',
    },
    {
      id: 'f2-m5',
      gerbang: 'observasi',
      teks: 'Menggunakan formula Haversine untuk jarak sudut kecil tanpa mengalami pembatalan bencana (loss of significance).',
    },
  ],
  f3: [
    {
      id: 'f3-m1',
      gerbang: 'derivasi',
      teks: 'Menurunkan aturan diferensiasi rantai dan parsial untuk laju perubahan fluks dan magnitudo dm/dt.',
    },
    {
      id: 'f3-m2',
      gerbang: 'derivasi',
      teks: 'Menghitung integral luas dan fluks energi bolometrik F = ∫ I_ν dν dΩ pada geometri terpusat.',
    },
    {
      id: 'f3-m3',
      gerbang: 'derivasi',
      teks: 'Mengembangkan deret Taylor hingga orde kedua dan mengevaluasi suku sisa Lagrange pada aproksimasi fisika.',
    },
    {
      id: 'f3-m4',
      gerbang: 'observasi',
      teks: 'Menghitung propagasi galat kuadratur acak multivariabel menggunakan turunan parsial kuadratik.',
    },
    {
      id: 'f3-m5',
      gerbang: 'derivasi',
      teks: 'Menurunkan rumus regresi linier metode kuadrat terkecil (least squares) terbobot w_i = 1/σ_i².',
    },
  ],
  f4: [
    {
      id: 'f4-m1',
      gerbang: 'derivasi',
      teks: 'Menurunkan persamaan gerak koordinat polar (r̈ - rθ̇², rθ̈ + 2ṙθ̇) dan kekekalan momentum sudut L.',
    },
    {
      id: 'f4-m2',
      gerbang: 'derivasi',
      teks: 'Membuktikan Teorema Kulit Newton (Shell Theorem) untuk medan gravitasi di dalam dan luar bola pejal homogen.',
    },
    {
      id: 'f4-m3',
      gerbang: 'derivasi',
      teks: 'Menurunkan persamaan energi potensial efektif U_eff(r) = L²/(2μr²) - GMμ/r dan orbit irisan kerucut.',
    },
    {
      id: 'f4-m4',
      gerbang: 'derivasi',
      teks: 'Menurunkan hubungan momen inersia I dan persamaan gerak rotasi torsi τ = dL/dt pada benda tegar astronomis.',
    },
    {
      id: 'f4-m5',
      gerbang: 'logika',
      teks: 'Membedakan gaya inersial fiktif (Coriolis, Sentrifugal) dari gaya interaksi sejati dalam kerangka berotasi.',
    },
  ],
  f5: [
    {
      id: 'f5-m1',
      gerbang: 'derivasi',
      teks: 'Menurunkan persamaan gelombang klasik 1D dan efek Doppler gelombang elektromagnetik non-relativistik.',
    },
    {
      id: 'f5-m2',
      gerbang: 'observasi',
      teks: 'Menghitung pola difraksi Fraunhofer celah melingkar dan menurunkan sudut piringan Airy θ = 1,22 λ/D.',
    },
    {
      id: 'f5-m3',
      gerbang: 'derivasi',
      teks: 'Menurunkan Hukum Wien dan Hukum Stefan–Boltzmann dari integrasi fungsi radiasi Planck B_λ(T).',
    },
    {
      id: 'f5-m4',
      gerbang: 'fermi',
      teks: 'Mengestimasi kecepatan termal partikel gas Maxwell–Boltzmann v_rms dan membandingkannya dengan laju lepas atmosfer.',
    },
    {
      id: 'f5-m5',
      gerbang: 'logika',
      teks: 'Menjelaskan batas berlakunya optik geometris vs optik gelombang fisis pada instrumen teleskop.',
    },
  ],
  f6: [
    {
      id: 'f6-m1',
      gerbang: 'derivasi',
      teks: 'Menurunkan vektor Poynting S = (E × B)/μ₀ dan rumus tekanan radiasi foton P_rad = F/c pada permukaan pemantul/penyerap.',
    },
    {
      id: 'f6-m2',
      gerbang: 'derivasi',
      teks: 'Menurunkan energi tingkat kuantum model Bohr E_n = -13,6 eV/n² dan formula Rydberg panjang gelombang foton.',
    },
    {
      id: 'f6-m3',
      gerbang: 'derivasi',
      teks: 'Menghitung panjang gelombang Compton λ_C dan pergeseran hamburan Compton foton energi tinggi.',
    },
    {
      id: 'f6-m4',
      gerbang: 'derivasi',
      teks: 'Menghitung defek massa Δm, energi ikat per nukleon B/A, dan nilai Q reaksi fusi p–p chain.',
    },
    {
      id: 'f6-m5',
      gerbang: 'logika',
      teks: 'Menjelaskan peran terobosan terowongan kuantum (Gamow peak) mengapa fusi terjadi di bawah energi Coulomb klasik.',
    },
  ],
  a1: [
    {
      id: 'a1-m1',
      gerbang: 'derivasi',
      teks: 'Menurunkan hubungan d(pc) = 1/p(″) dari geometri paralaks tahunan dan batas sudut kecil.',
    },
    {
      id: 'a1-m2',
      gerbang: 'derivasi',
      teks: 'Menurunkan rumus skala Pogson m₁ - m₂ = -2,5 log(F₁/F₂) dari batas ambang persepsi Weber–Fechner.',
    },
    {
      id: 'a1-m3',
      gerbang: 'fermi',
      teks: 'Mengestimasi jumlah foton optik yang masuk ke pupil mata pada limit deteksi magnitudo m = 6.',
    },
    {
      id: 'a1-m4',
      gerbang: 'logika',
      teks: 'Menjelaskan bias astrometri Lutz–Kelker ketika ketidakpastian paralaks σ_p/p melampaui 15%.',
    },
    {
      id: 'a1-m5',
      gerbang: 'observasi',
      teks: 'Menghubungkan gerak diri μ, kecepatan radial v_r, dan paralaks p untuk mendapatkan vektor kecepatan ruang 3D v.',
    },
  ],
  a2: [
    {
      id: 'a2-m1',
      gerbang: 'derivasi',
      teks: 'Menurunkan konversi koordinat Horizon (a, A) ke Ekuatorial (α, δ) menggunakan segitiga bola P–Z–S.',
    },
    {
      id: 'a2-m2',
      gerbang: 'derivasi',
      teks: 'Menghitung kondisi terbit-terbenam cos H₀ = -tan φ tan δ dan panjang siang hari sebagai fungsi lintang & deklinasi.',
    },
    {
      id: 'a2-m3',
      gerbang: 'observasi',
      teks: 'Menentukan zona bintang sirkumpolar dan zona bintang tak pernah terbit untuk sebarang lintang pengamat.',
    },
    {
      id: 'a2-m4',
      gerbang: 'logika',
      teks: 'Menjelaskan efek refraksi atmosfer pada horizon (R ≈ 34′) dan pergeseran waktu terbit sejati vs geometris.',
    },
  ],
  a3: [
    {
      id: 'a3-m1',
      gerbang: 'derivasi',
      teks: 'Menurunkan relasi waktu sideris LST = α + H dan perbedaan panjang hari surya sejati vs surya rata-rata.',
    },
    {
      id: 'a3-m2',
      gerbang: 'logika',
      teks: 'Menjelaskan dua komponen fisis Perata Waktu (Equation of Time): eksentrisitas orbit dan kemiringan ekliptika.',
    },
    {
      id: 'a3-m3',
      gerbang: 'observasi',
      teks: 'Menghitung konversi tanggal kalender Gregorius ke Julian Date (JD) dan Modified Julian Date (MJD).',
    },
    {
      id: 'a3-m4',
      gerbang: 'derivasi',
      teks: 'Menurunkan periode sinodis 1/S = 1/P_Bumi - 1/P_planet dan siklus fase Bulan.',
    },
    {
      id: 'a3-m5',
      gerbang: 'fermi',
      teks: 'Menghitung batas limit gerhana Matahari dan Bulan menggunakan kerucut bayangan umbra dan penumbra Bumi-Bulan.',
    },
  ],
  a4: [
    {
      id: 'a4-m1',
      gerbang: 'derivasi',
      teks: 'Menurunkan persamaan Vis-Viva v² = GM(2/r - 1/a) dari kekekalan energi mekanik spesifik dan momentum sudut.',
    },
    {
      id: 'a4-m2',
      gerbang: 'derivasi',
      teks: 'Menurunkan Hukum Kepler III berbobot massa tereduksi a³/P² = G(M₁ + M₂)/(4π²).',
    },
    {
      id: 'a4-m3',
      gerbang: 'observasi',
      teks: 'Menghitung manuver transfer orbit elips Hohmann (Δv₁, Δv₂, dan waktu tempuh transfer).',
    },
    {
      id: 'a4-m4',
      gerbang: 'logika',
      teks: 'Menganalisis stabilitas 5 titik Lagrange (L₁–L₅) dan menurunkan batas Roche benda tegar vs fluida.',
    },
  ],
  a5: [
    {
      id: 'a5-m1',
      gerbang: 'derivasi',
      teks: 'Menurunkan rumus modulus jarak m - M = 5 log d - 5 + A_V dengan koreksi serapan antarbintang.',
    },
    {
      id: 'a5-m2',
      gerbang: 'derivasi',
      teks: 'Menurunkan persamaan transfer radiatif 1D untuk atenuasi I = I₀ e^(-τ), A_λ = 1,0857 τ_λ, dan limb darkening Eddington–Barbier.',
    },
    {
      id: 'a5-m3',
      gerbang: 'logika',
      teks: 'Membuktikan invariansi kecerahan permukaan sumber terurai dan membedakan puncak B_λ vs B_ν.',
    },
    {
      id: 'a5-m4',
      gerbang: 'observasi',
      teks: 'Menghitung jarak sejati bebas bias menggunakan indeks Q = (U-B) - 0,72(B-V), E(B-V), A_V, dan koreksi bolometrik BC.',
    },
  ],
  a6: [
    {
      id: 'a6-m1',
      gerbang: 'derivasi',
      teks: 'Menurunkan gradien suhu cakram protoplanet T(r) ∝ r^(-1/2), kesetimbangan planet T_eq, dan model rumah kaca satu-lapisan T_s = 2^(1/4) T_eq.',
    },
    {
      id: 'a6-m2',
      gerbang: 'derivasi',
      teks: 'Menurunkan kerapatan bintang induk ρ_* dan parameter impak b langsung dari kedalaman dan durasi (T_14, T_23) kurva cahaya transit.',
    },
    {
      id: 'a6-m3',
      gerbang: 'fermi',
      teks: 'Mengestimasi waktu difusi foton random-walk Matahari (~10⁵ yr), probabilitas transit (~0,47%), dan medan magnet sunspot dari keseimbangan tekanan.',
    },
    {
      id: 'a6-m4',
      gerbang: 'logika',
      teks: 'Menjelaskan mengapa K hanya memberi M_p sin i, bagaimana flux dilution memperbesar R_p sejati, dan mengapa korona jutaan K tidak memanaskan Bumi.',
    },
  ],
  a7: [
    {
      id: 'a7-m1',
      gerbang: 'derivasi',
      teks: 'Menurunkan persamaan SNR CCD lengkap beserta perilaku t^(1/2) (background/photon-limited) vs t^1 (read-noise limited) dan penskalaan SNR ∝ F* √t.',
    },
    {
      id: 'a7-m2',
      gerbang: 'derivasi',
      teks: 'Menurunkan dispersi sudut kisi dβ/dλ dan daya pisah batas celah spektrograf R ∝ W / (D φ_slit).',
    },
    {
      id: 'a7-m3',
      gerbang: 'observasi',
      teks: 'Menghitung plate scale, pixel scale, kriteria Nyquist (≥2 px/FWHM), batas Rayleigh, dan parameter Fried r_0 ∝ λ^(6/5).',
    },
    {
      id: 'a7-m4',
      gerbang: 'fermi',
      teks: 'Mengonversi fluks Jansky menjadi suhu kecerahan Rayleigh-Jeans T_B pada observasi radio/VLBI serta mengestimasi daya masuk antena.',
    },
  ],
  l1: [
    {
      id: 'l1-m1',
      gerbang: 'konsep',
      teks: 'Menjelaskan urutan spektrum OBAFGKM beserta mengapa Balmer memuncak di A0 lewat penggabungan persamaan Boltzmann dan Saha.',
    },
    {
      id: 'l1-m2',
      gerbang: 'derivasi',
      teks: 'Menurunkan persamaan garis iso-radius log L = 2 log R + 4 log T pada Diagram H–R serta membedakan kelas luminositas Ia–V–wd.',
    },
    {
      id: 'l1-m3',
      gerbang: 'derivasi',
      teks: 'Menurunkan masa hidup deret utama τ_MS ∝ M^-2,5 dari relasi M–L dan membedakannya dari skala waktu Kelvin–Helmholtz.',
    },
    {
      id: 'l1-m4',
      gerbang: 'logika',
      teks: 'Membedakan pelebaran garis Doppler termal, tekanan/Stark (log g), rotasi (v sin i), dan Zeeman serta arti kekekalan lebar ekuivalen W_λ.',
    },
    {
      id: 'l1-m5',
      gerbang: 'observasi',
      teks: 'Menghitung (d, M_V, M_bol, L, R, M, ρ̄, v_r) secara terpadu dari paralaks, magnitudo, koreksi bolometrik, T_eff, log g, dan pergeseran garis.',
    },
  ],
  l2: [
    {
      id: 'l2-m1',
      gerbang: 'derivasi',
      teks: 'Menuliskan 4 PDB struktur bintang beserta syarat konveksi Schwarzschild dan batas bawah tekanan pusat P_c > GM²/(8πR⁴).',
    },
    {
      id: 'l2-m2',
      gerbang: 'derivasi',
      teks: 'Membuktikan Teorema Virial 2K + U = 0 dari persamaan hidrostatik dan menjelaskan kapasitas panas negatif & Massa Jeans.',
    },
    {
      id: 'l2-m3',
      gerbang: 'konsep',
      teks: 'Membandingkan kepekaan suhu pp-chain, siklus CNO (inti konvektif > 1,3 M☉), triple-alpha, dan emisi neutrino tahap akhir.',
    },
    {
      id: 'l2-m4',
      gerbang: 'derivasi',
      teks: 'Menurunkan R ∝ M^-1/3 untuk katai putih non-relativistik serta munculnya Batas Chandrasekhar (1,44 M☉) pada limit relativistik.',
    },
    {
      id: 'l2-m5',
      gerbang: 'logika',
      teks: 'Melacak jalur lengkap evolusi di Diagram H–R (Hayashi, ZAMS, RGB, Helium Flash, AGB, Nebula Planet vs Supernova II/Ia).',
    },
  ],
  l3: [
    {
      id: 'l3-m1',
      gerbang: 'derivasi',
      teks: 'Menghitung massa M₁, M₂ dari biner visual/astrometri serta membedakan informasi SB1 vs SB2 (rasio K₂/K₁).',
    },
    {
      id: 'l3-m2',
      gerbang: 'derivasi',
      teks: 'Menurunkan fungsi massa biner f(m) = P K₁³(1-e²)^(3/2)/(2πG) dan memakainya sebagai batas bawah absolut massa objek gelap.',
    },
    {
      id: 'l3-m3',
      gerbang: 'derivasi',
      teks: 'Mengekstraksi radius R_s, R_l dari titik kontak t₁–t₄ dan rasio temperatur T_h/T_c dari kedalaman minimum gerhana total.',
    },
    {
      id: 'l3-m4',
      gerbang: 'konsep',
      teks: 'Menjelaskan transfer massa lobus Roche (Paradoks Algol), penentuan usia gugus via MSTO, dan beda gugus terbuka vs bola.',
    },
    {
      id: 'l3-m5',
      gerbang: 'observasi',
      teks: 'Menghitung kerapatan rata-rata eksoplanet ρ_p dari sinergi fotometri transit (R_p/R_*) dan kecepatan radial (M_p sin i).',
    },
  ],
  l4: [
    {
      id: 'l4-m1',
      gerbang: 'derivasi',
      teks: 'Menurunkan Radius Strömgren daerah H II R_S ∝ (N_LyC / (n_H² α_B))^(1/3) serta menjelaskan garis 21 cm H I menembus debu.',
    },
    {
      id: 'l4-m2',
      gerbang: 'observasi',
      teks: 'Membedakan tipe Hubble (E, S0, Sa–Sc, Irr), struktur Bima Sakti (cakram, bulge, halo), dan menghitung massa Sgr A* dari orbit S2.',
    },
    {
      id: 'l4-m3',
      gerbang: 'derivasi',
      teks: 'Menurunkan Konstanta Oort A dan B untuk rotasi diferensial serta memakai kurva rotasi datar v = konst → ρ_DM ∝ r^-2.',
    },
    {
      id: 'l4-m4',
      gerbang: 'konsep',
      teks: 'Menerapkan Tully–Fisher (L ∝ v^4), Faber–Jackson, Teorema Virial Zwicky pada gugus galaksi, dan pelensaan gravitasi.',
    },
    {
      id: 'l4-m5',
      gerbang: 'derivasi',
      teks: 'Menurunkan Luminositas Eddington L_Edd = 4πGMm_p c/σ_T untuk AGN/kuasar dan mengaitkannya dengan efisiensi akresi η.',
    },
  ],
  l5: [
    {
      id: 'l5-m1',
      gerbang: 'konsep',
      teks: 'Membedakan redshift kosmologis (1 + z = a₀/a) dari efek Doppler lokal serta menjelaskan Hukum Hubble–Lemaître.',
    },
    {
      id: 'l5-m2',
      gerbang: 'derivasi',
      teks: 'Menurunkan Persamaan Friedmann, Fluida, dan Percepatan ä/a dari mekanika Newtonian + Hukum I Termodinamika.',
    },
    {
      id: 'l5-m3',
      gerbang: 'derivasi',
      teks: 'Menghitung densitas kritis ρ_c = 3H₀²/(8πG) dan mengintegrasikan a(t) serta usia alam semesta t₀ untuk fluida ber-persamaan keadaan P = wρc².',
    },
    {
      id: 'l5-m4',
      gerbang: 'observasi',
      teks: 'Menghitung epoch kesetaraan materi–radiasi z_eq, sejarah termal T(z) = T₀(1+z), BBN, dan rekombinasi CMB.',
    },
    {
      id: 'l5-m5',
      gerbang: 'logika',
      teks: 'Menjelaskan mengapa Ω_Λ mempercepat ekspansi (ä > 0 pada z < 0,63) dan bagaimana inflasi memecahkan masalah horizon & kerataan.',
    },
  ],
  l6: [
    {
      id: 'l6-m1',
      gerbang: 'observasi',
      teks: 'Menuliskan alur reduksi CCD C = (R − Bias − Dark_skala)/Flat_norm serta menghitung SNR fotometri apertur & σ_m ≈ 1,0857/SNR.',
    },
    {
      id: 'l6-m2',
      gerbang: 'observasi',
      teks: 'Menerapkan fotometri diferensial dan garis ekstingsi Bouguer m = m₀ + k′X (X = sec z) untuk mengoreksi atmosfer.',
    },
    {
      id: 'l6-m3',
      gerbang: 'observasi',
      teks: 'Melakukan pelipatan fase (phase folding), menghindari jebakan aliasing pencuplikan, dan mengekstrak δ, T₁₄, T₂₃ transit.',
    },
    {
      id: 'l6-m4',
      gerbang: 'derivasi',
      teks: 'Menghitung regresi kuadrat terkecil terbobot (WLS), galat parameter (σ_m, σ_c), dan menginterpretasikan χ²_ν.',
    },
    {
      id: 'l6-m5',
      gerbang: 'derivasi',
      teks: 'Melakukan propagasi galat kuadratur Gauss berantai hingga pembulatan angka penting yang tepat pada hasil akhir.',
    },
  ],
}

export type GerbangId = 'derivasi' | 'logika' | 'fermi_observasi' | 'retensi_kuis'

export interface KriteriaGerbang {
  label: string
  tercapai: boolean
  detail: string
}

export interface StatusGerbang {
  id: GerbangId
  nomor: 1 | 2 | 3 | 4
  judul: string
  kategori: string
  lulus: boolean
  skor: number // 0..1
  ringkasan: string
  targetAnchorId?: string
  kriteria: KriteriaGerbang[]
}

export interface EvaluasiKesiapanModul {
  babId: string
  gerbang: StatusGerbang[]
  jumlahLolos: number
  totalGerbang: number
  persentaseKesiapan: number
  statusKesiapan: 'awal' | 'berkembang' | 'hampir_siap' | 'siap_penuh'
  labelKesiapan: string
  rekomendasiTindakan: string
}

export function evaluasiKesiapanModul(bab: Bab, state: LearningState): EvaluasiKesiapanModul {
  const babData = state.bab[bab.id]
  const checklistMap = babData?.masteryChecklist ?? {}
  const refleksiMap = babData?.refleksi ?? {}
  const checkpointMap = babData?.checkpoint ?? {}
  const rincianKuis = rincianPenguasaanBab(bab, state)

  const items = CHECKLIST_REGISTRY[bab.id] ?? []

  // Gerbang 1: Derivasi Mandiri (100% Langkah Inti)
  const itemsDerivasi = items.filter((x) => x.gerbang === 'derivasi')
  const selesaiDerivasi = itemsDerivasi.filter((x) => Boolean(checklistMap[x.id])).length
  const totalDerivasi = itemsDerivasi.length || 1
  const rasioDerivasi = selesaiDerivasi / totalDerivasi
  const latihanDerivasiTerisi = Object.keys(refleksiMap).some(
    (k) => (k.startsWith('latihan-') || k.includes('derivasi')) && (refleksiMap[k]?.trim().length ?? 0) >= 10,
  )
  const lulusGerbang1 = rasioDerivasi >= 1.0

  const gerbang1: StatusGerbang = {
    id: 'derivasi',
    nomor: 1,
    judul: 'Gerbang Derivasi Mandiri',
    kategori: 'Kalkulus & Aljabar',
    lulus: lulusGerbang1,
    skor: rasioDerivasi,
    ringkasan: lulusGerbang1
      ? '100% langkah inti derivasi terverifikasi mandiri.'
      : `${selesaiDerivasi}/${totalDerivasi} langkah inti checklist derivasi tercentang.`,
    targetAnchorId: 'checklist-mastery',
    kriteria: [
      {
        label: 'Checklist langkah derivasi 100%',
        tercapai: rasioDerivasi >= 1.0,
        detail: `${selesaiDerivasi} dari ${totalDerivasi} poin derivasi selesai`,
      },
      {
        label: 'Catatan penurunan / latihan aktif',
        tercapai: latihanDerivasiTerisi || rasioDerivasi >= 0.5,
        detail: latihanDerivasiTerisi ? 'Tersimpan di notebook latihan' : 'Lengkapi sketsa penurunan',
      },
    ],
  }

  // Gerbang 2: Audit Logika & Uji Nalar (>= 80% Poin Rubrik)
  const itemsLogika = items.filter((x) => x.gerbang === 'logika' || x.gerbang === 'konsep')
  const selesaiLogika = itemsLogika.filter((x) => Boolean(checklistMap[x.id])).length
  const totalLogika = itemsLogika.length || 1
  const rasioChecklistLogika = selesaiLogika / totalLogika
  const argumenUjianLogika = Object.keys(refleksiMap).filter(
    (k) => k.startsWith('logika-') && (refleksiMap[k]?.trim().length ?? 0) >= 15,
  ).length
  const adaUjianLogika = argumenUjianLogika >= 1
  const skorLogika = (rasioChecklistLogika * 0.6) + (adaUjianLogika ? 0.4 : 0)
  const lulusGerbang2 = rasioChecklistLogika >= 0.8 && adaUjianLogika

  const gerbang2: StatusGerbang = {
    id: 'logika',
    nomor: 2,
    judul: 'Gerbang Audit Logika & Uji Nalar',
    kategori: 'Audit Asumsi & Argumen',
    lulus: lulusGerbang2,
    skor: skorLogika,
    ringkasan: lulusGerbang2
      ? 'Audit logika lulus: asumsi teridentifikasi dan argumen teruji.'
      : `${selesaiLogika}/${totalLogika} checklist logika tercentang, ${argumenUjianLogika} argumen uji nalar terisi.`,
    targetAnchorId: 'ujian-logika-section',
    kriteria: [
      {
        label: 'Checklist penalaran & asumsi',
        tercapai: rasioChecklistLogika >= 0.8,
        detail: `${selesaiLogika} dari ${totalLogika} kriteria logika tuntas`,
      },
      {
        label: 'Respons Ujian Logika / Uji Nalar',
        tercapai: adaUjianLogika,
        detail: adaUjianLogika
          ? `${argumenUjianLogika} argumen tersimpan di sistem`
          : 'Jawab minimal 1 tantangan Ujian Logika',
      },
    ],
  }

  // Gerbang 3: Estimasi Fermi, Cek Dimensi & Observasi (Orde-Besar & Batas Fisis)
  const itemsFermiObs = items.filter((x) => x.gerbang === 'fermi' || x.gerbang === 'observasi')
  const selesaiFermiObs = itemsFermiObs.filter((x) => Boolean(checklistMap[x.id])).length
  const totalFermiObs = itemsFermiObs.length || 1
  const rasioFermiObs = selesaiFermiObs / totalFermiObs
  const checkpointsBenar = Object.values(checkpointMap).filter(Boolean).length
  const skorFermiObs = (rasioFermiObs * 0.7) + (checkpointsBenar > 0 ? 0.3 : 0)
  const lulusGerbang3 = rasioFermiObs >= 0.5 || (rasioFermiObs > 0 && checkpointsBenar > 0)

  const gerbang3: StatusGerbang = {
    id: 'fermi_observasi',
    nomor: 3,
    judul: 'Gerbang Estimasi Fermi & Observasi',
    kategori: 'Orde Besar & Reduksi',
    lulus: lulusGerbang3,
    skor: Math.min(1, skorFermiObs),
    ringkasan: lulusGerbang3
      ? 'Estimasi Fermi, cek dimensi, dan interpretasi data observasi dikuasai.'
      : `${selesaiFermiObs}/${totalFermiObs} checklist observasi/Fermi selesai.`,
    targetAnchorId: 'cek-pemahaman-section',
    kriteria: [
      {
        label: 'Checklist observasi & Fermi',
        tercapai: rasioFermiObs >= 0.5,
        detail: `${selesaiFermiObs} dari ${totalFermiObs} poin observasi tercapai`,
      },
      {
        label: 'Cek pemahaman / verifikasi instrumen',
        tercapai: checkpointsBenar > 0 || rasioFermiObs >= 1.0,
        detail: checkpointsBenar > 0
          ? `${checkpointsBenar} checkpoint dijawab tepat`
          : 'Verifikasi instrumen & estimasi numerik',
      },
    ],
  }

  // Gerbang 4: Retensi Sesi Kuis Spaced Repetition (SM-2 & Sesi Terpisah)
  const lulusGerbang4 = rincianKuis.dikuasai
  const gerbang4Skor =
    ((Math.min(rincianKuis.soalUnik, 8) / 8) * 0.25) +
    ((Math.min(rincianKuis.sesiUnik, 2) / 2) * 0.25) +
    ((Math.min(rincianKuis.rentangHari, 7) / 7) * 0.25) +
    ((Math.min(rincianKuis.skorRataRata, 0.8) / 0.8) * 0.25)

  const gerbang4: StatusGerbang = {
    id: 'retensi_kuis',
    nomor: 4,
    judul: 'Gerbang Retensi Sesi Kuis',
    kategori: 'Spaced Repetition & Bank Soal',
    lulus: lulusGerbang4,
    skor: gerbang4Skor,
    ringkasan: lulusGerbang4
      ? 'Retensi kuat: 8+ soal unik di 2+ sesi berjarak 7+ hari dengan skor ≥ 80%.'
      : `Progres kuis: ${Math.min(rincianKuis.soalUnik, 8)}/8 soal unik, ${Math.min(rincianKuis.sesiUnik, 2)}/2 sesi, skor ${Math.round(rincianKuis.skorRataRata * 100)}%/80%.`,
    targetAnchorId: 'kuis-bab',
    kriteria: [
      {
        label: 'Soal unik teruji',
        tercapai: rincianKuis.soalUnik >= 8,
        detail: `${Math.min(rincianKuis.soalUnik, 8)} / 8 soal`,
      },
      {
        label: 'Sesi latihan terpisah',
        tercapai: rincianKuis.sesiUnik >= 2,
        detail: `${Math.min(rincianKuis.sesiUnik, 2)} / 2 sesi`,
      },
      {
        label: 'Jeda retensi memori',
        tercapai: rincianKuis.rentangHari >= 7,
        detail: `${Math.min(Math.floor(rincianKuis.rentangHari), 7)} / 7 hari`,
      },
      {
        label: 'Skor akurasi kuis',
        tercapai: rincianKuis.skorRataRata >= 0.8,
        detail: `${Math.round(rincianKuis.skorRataRata * 100)}% (target ≥ 80%)`,
      },
    ],
  }

  const daftarGerbang: StatusGerbang[] = [gerbang1, gerbang2, gerbang3, gerbang4]
  const jumlahLolos = daftarGerbang.filter((g) => g.lulus).length
  const totalGerbang = 4
  const persentaseKesiapan = Math.round((jumlahLolos / totalGerbang) * 100)

  let statusKesiapan: EvaluasiKesiapanModul['statusKesiapan'] = 'awal'
  let labelKesiapan = 'Belum Dimulai'
  let rekomendasiTindakan = 'Mulai pelajari intuisi awal dan langkah penurunan pertama di materi.'

  if (jumlahLolos === 4) {
    statusKesiapan = 'siap_penuh'
    labelKesiapan = 'Siap Penuh (4/4 Gerbang Lolos)'
    rekomendasiTindakan = 'Semua gerbang penguasaan lolos. Modul ini telah kamu kuasai secara utuh dan siap jadi fondasi modul berikutnya.'
  } else if (jumlahLolos === 3) {
    statusKesiapan = 'hampir_siap'
    labelKesiapan = 'Hampir Siap (3/4 Gerbang Lolos)'
    const gerbangGagal = daftarGerbang.find((g) => !g.lulus)
    rekomendasiTindakan = `Tinggal 1 gerbang lagi (${gerbangGagal?.judul}). Lengkapi langkah ini untuk penguasaan 100%.`
  } else if (jumlahLolos >= 1) {
    statusKesiapan = 'berkembang'
    labelKesiapan = `Sedang Berjalan (${jumlahLolos}/4 Gerbang Lolos)`
    rekomendasiTindakan = 'Lanjutkan latihan bertahap: centang checklist derivasi, tulis argumen pada Ujian Logika, dan kerjakan sesi kuis.'
  }

  return {
    babId: bab.id,
    gerbang: daftarGerbang,
    jumlahLolos,
    totalGerbang,
    persentaseKesiapan,
    statusKesiapan,
    labelKesiapan,
    rekomendasiTindakan,
  }
}
