import { useNavigate } from 'react-router-dom'
import { Icon } from './Icon'

interface Props {
  judul?: string
  kanan?: React.ReactNode
}

export function TopBar({ judul, kanan }: Props) {
  const navigate = useNavigate()
  return (
    <div className="mb-5 flex items-center gap-3">
      <button
        onClick={() => navigate(-1)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-muted transition hover:border-ungu/50 hover:text-ink"
        aria-label="Kembali"
      >
        <Icon nama="kembali" ukuran={18} />
      </button>
      {judul && <span className="truncate text-[14px] font-medium text-muted">{judul}</span>}
      <div className="ml-auto">{kanan}</div>
    </div>
  )
}