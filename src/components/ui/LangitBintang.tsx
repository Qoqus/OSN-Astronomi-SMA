import { useEffect, useRef } from 'react'

interface Bintang {
  x: number
  y: number
  r: number
  fase: number
  kecepatan: number
  hue: string
}

const WARNA = ['255,255,255', '183,178,214', '34,211,238', '255,178,36', '240,67,180']

export function LangitBintang() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduksi = Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches)
    let bintang: Bintang[] = []
    let raf = 0
    let lebar = 0
    let tinggi = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    function buat() {
      const jumlah = Math.min(160, Math.round((lebar * tinggi) / 11000))
      bintang = Array.from({ length: jumlah }, () => ({
        x: Math.random() * lebar,
        y: Math.random() * tinggi,
        r: Math.random() * 1.3 + 0.3,
        fase: Math.random() * Math.PI * 2,
        kecepatan: Math.random() * 1.5 + 0.4,
        hue: WARNA[Math.floor(Math.random() * WARNA.length)],
      }))
    }

    function ukur() {
      lebar = window.innerWidth
      tinggi = window.innerHeight
      canvas!.width = Math.floor(lebar * dpr)
      canvas!.height = Math.floor(tinggi * dpr)
      canvas!.style.width = `${lebar}px`
      canvas!.style.height = `${tinggi}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      buat()
      if (reduksi) gambar(0)
    }

    function gambar(t: number) {
      ctx!.clearRect(0, 0, lebar, tinggi)
      for (const b of bintang) {
        const kedip = reduksi ? 0.7 : 0.45 + 0.55 * Math.abs(Math.sin(b.fase + t * 0.001 * b.kecepatan))
        ctx!.beginPath()
        ctx!.fillStyle = `rgba(${b.hue},${kedip.toFixed(3)})`
        ctx!.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    function loop(t: number) {
      gambar(t)
      raf = requestAnimationFrame(loop)
    }

    function mulai() {
      if (reduksi || raf) return
      raf = requestAnimationFrame(loop)
    }
    function berhenti() {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }

    const saatVis = () => (document.hidden ? berhenti() : mulai())
    let resizeT = 0
    const saatResize = () => {
      window.clearTimeout(resizeT)
      resizeT = window.setTimeout(ukur, 150)
    }

    ukur()
    mulai()
    document.addEventListener('visibilitychange', saatVis)
    window.addEventListener('resize', saatResize)
    return () => {
      berhenti()
      document.removeEventListener('visibilitychange', saatVis)
      window.removeEventListener('resize', saatResize)
      window.clearTimeout(resizeT)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  )
}