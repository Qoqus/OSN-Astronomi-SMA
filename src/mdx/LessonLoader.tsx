import {
  Component,
  lazy,
  Suspense,
  useMemo,
  type ComponentType,
  type ReactNode,
} from 'react'
import { komponenMDX } from './MDXComponents'
import { KonteksPelajaran } from './konteks'

const berkasMateri = import.meta.glob('/content/materi/**/*.mdx') as Record<
  string,
  () => Promise<{ default: ComponentType<{ components?: Record<string, unknown> }> }>
>

class BatasKesalahan extends Component<{ children: ReactNode }, { gagal: boolean }> {
  state = { gagal: false }

  static getDerivedStateFromError() {
    return { gagal: true }
  }

  render() {
    if (this.state.gagal) {
      return (
        <div className="kartu p-5 text-[15px] text-muted">
          Materi gagal dimuat. Coba muat ulang halaman ini.
        </div>
      )
    }
    return this.props.children
  }
}

interface Props {
  path?: string
  babId: string
}

export function LessonLoader({ path, babId }: Props) {
  const pemuat = path ? berkasMateri[path] : undefined
  const Komponen = useMemo(() => (pemuat ? lazy(pemuat) : null), [path, pemuat])

  if (!Komponen) {
    return (
      <div className="kartu p-5 text-[15px] text-muted">
        Materi bab ini sedang disusun. Pantau peta belajar untuk pembaruan berikutnya.
      </div>
    )
  }

  return (
    <KonteksPelajaran.Provider value={babId}>
      <BatasKesalahan>
        <Suspense fallback={<p className="py-6 text-[15px] text-faint">Memuat materi…</p>}>
          <div className="prose-materi">
            <Komponen components={komponenMDX as unknown as Record<string, unknown>} />
          </div>
        </Suspense>
      </BatasKesalahan>
    </KonteksPelajaran.Provider>
  )
}
