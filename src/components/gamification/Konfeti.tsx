import { useEffect, useMemo, useState } from 'react'

const WARNA = ['#8b5cf6', '#22d3ee', '#f043b4', '#ffb224', '#4ade80', '#6366f1']

export function Konfeti({ jumlah = 44 }: { jumlah?: number }) {
  const [reduksi] = useState(
    () =>
      typeof window !== 'undefined' &&
      Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches),
  )
  const [selesai, setSelesai] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => setSelesai(true), 2800)
    return () => window.clearTimeout(t)
  }, [])

  const pieces = useMemo(
    () =>
      Array.from({ length: jumlah }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        dur: 1.7 + Math.random() * 1.1,
        gx: (Math.random() - 0.5) * 120,
        gr: 360 + Math.random() * 540,
        color: WARNA[i % WARNA.length],
        w: 5 + Math.random() * 6,
        h: 8 + Math.random() * 8,
      })),
    [jumlah],
  )

  if (reduksi || selesai) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="konfeti"
          style={{
            left: `${p.left}%`,
            width: p.w,
            height: p.h,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            ['--gx' as string]: `${p.gx}px`,
            ['--gr' as string]: `${p.gr}deg`,
          }}
        />
      ))}
    </div>
  )
}