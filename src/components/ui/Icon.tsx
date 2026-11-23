import type { ReactNode, SVGProps } from 'react'

const JALUR: Record<string, ReactNode> = {
  beranda: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </>
  ),
  peta: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18M3 12h18" />
      <path d="M12 3c2.5 2.6 4 5.6 4 9s-1.5 6.4-4 9c-2.5-2.6-4-5.6-4-9s1.5-6.4 4-9Z" />
    </>
  ),
  latihan: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </>
  ),
  progres: (
    <>
      <path d="M3 21h18" />
      <path d="M6 21V10M12 21V4M18 21v-7" />
    </>
  ),
  kembali: <path d="M19 12H5M12 19l-7-7 7-7" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  cek: <path d="m5 13 4 4L19 7" />,
  silang: <path d="M6 6l12 12M18 6 6 18" />,
  jam: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  keluar: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </>
  ),
  bintang: <path d="m12 3 2.7 5.7 6.3.9-4.5 4.4 1 6.2-5.5-2.9-5.5 2.9 1-6.2L3 9.6l6.3-.9Z" />,
  panah: <path d="M5 12h14M13 6l6 6-6 6" />,
  lingkaran: <circle cx="12" cy="12" r="8" />,
  unduh: (
    <>
      <path d="M12 4v10" />
      <path d="m7 10 5 5 5-5" />
      <path d="M4 19h16" />
    </>
  ),
  unggah: (
    <>
      <path d="M12 15V5" />
      <path d="m7 9 5-5 5 5" />
      <path d="M4 19h16" />
    </>
  ),
  api: (
    <path d="M12 3c1.5 3 4.5 4.2 4.5 8a4.5 4.5 0 0 1-9 0c0-1.6.6-2.8 1.5-4 .3 1.2 1 2 2 2.3C10.6 7.6 11 5.2 12 3Z" />
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  piala: (
    <>
      <path d="M8 4h8v5a4 4 0 0 1-8 0Z" />
      <path d="M8 5H5v2a3 3 0 0 0 3 3M16 5h3v2a3 3 0 0 1-3 3" />
      <path d="M12 13v4M9 20h6M10 17h4" />
    </>
  ),
  bulan: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />,
  memori: (
    <>
      <rect x="4" y="6" width="13" height="14" rx="2" />
      <path d="M8 6V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-1" />
      <path d="M8 11h5M8 15h3" />
    </>
  ),
  referensi: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5Z" />
      <path d="M4 5.5v16M8 7h8M8 11h6" />
    </>
  ),
  bookmark: <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  hapus: (
    <>
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M6 7l1 13h10l1-13" />
    </>
  ),
  ulang: (
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </>
  ),
  kalkulator: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8M8 12h2M12 12h4M8 16h2M12 16h2M16 12v4" />
    </>
  ),
  ai: (
    <>
      <path d="m12 3 1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9Z" />
      <path d="M18 16l.8 1.9L20.7 19l-1.9.8L18 21.7l-.8-1.9L15.3 19l1.9-.8Z" />
    </>
  ),
  suara: (
    <>
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 6a8.5 8.5 0 0 1 0 12" />
    </>
  ),
  suaraMati: (
    <>
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      <path d="m16 9 5 6M21 9l-5 6" />
    </>
  ),
}

export type NamaIkon = keyof typeof JALUR

interface Props extends SVGProps<SVGSVGElement> {
  nama: NamaIkon
  ukuran?: number
}

export function Icon({ nama, ukuran = 20, ...sisa }: Props) {
  return (
    <svg
      width={ukuran}
      height={ukuran}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...sisa}
    >
      {JALUR[nama]}
    </svg>
  )
}
