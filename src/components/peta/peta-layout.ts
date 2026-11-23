import { KATALOG, TIER_LABEL } from '../../../content/index'
import type { Tier } from '@/types'

export const LEBAR = 900
export const TINGGI = 620

const TIER_X: Record<Tier, number> = { fondasi: 165, inti: 450, lanjutan: 738 }

export interface NodePeta {
  id: string
  kode: string
  judul: string
  tier: Tier
  x: number
  y: number
}

export interface EdgePeta {
  dari: string
  ke: string
  d: string
}

export interface ZonaPeta {
  tier: Tier
  label: string
  x: number
  y: number
  w: number
  h: number
  cx: number
}

function bangunNodes(): NodePeta[] {
  const nodes: NodePeta[] = []
  for (const tier of ['fondasi', 'inti', 'lanjutan'] as Tier[]) {
    const daftar = KATALOG.filter((b) => b.tier === tier)
    const n = daftar.length
    daftar.forEach((b, i) => {
      const y = n === 1 ? TINGGI / 2 : 88 + (i * (TINGGI - 176)) / (n - 1)
      const jitter = (i % 2 === 0 ? -1 : 1) * (16 + (i % 3) * 7)
      nodes.push({ id: b.id, kode: b.kode, judul: b.judul, tier, x: TIER_X[tier] + jitter, y })
    })
  }
  return nodes
}

export const NODES: NodePeta[] = bangunNodes()
export const nodeById = new Map(NODES.map((n) => [n.id, n]))

function bezier(a: NodePeta, b: NodePeta): string {
  const dx = b.x - a.x
  if (Math.abs(dx) < 40) {
    const bow = 70 * (a.y < b.y ? 1 : -1)
    return `M ${a.x} ${a.y} C ${a.x + bow} ${a.y + (b.y - a.y) * 0.3}, ${b.x + bow} ${b.y - (b.y - a.y) * 0.3}, ${b.x} ${b.y}`
  }
  const c = Math.max(50, Math.abs(dx) * 0.42)
  return `M ${a.x} ${a.y} C ${a.x + c} ${a.y}, ${b.x - c} ${b.y}, ${b.x} ${b.y}`
}

export const EDGES: EdgePeta[] = KATALOG.flatMap((b) =>
  b.prasyarat
    .map((p) => {
      const a = nodeById.get(p)
      const t = nodeById.get(b.id)
      if (!a || !t) return null
      return { dari: p, ke: b.id, d: bezier(a, t) }
    })
    .filter((x): x is EdgePeta => x !== null),
)

export const ZONA: ZonaPeta[] = (['fondasi', 'inti', 'lanjutan'] as Tier[]).map((tier) => ({
  tier,
  label: TIER_LABEL[tier],
  x: TIER_X[tier] - 118,
  y: 44,
  w: 236,
  h: TINGGI - 88,
  cx: TIER_X[tier],
}))