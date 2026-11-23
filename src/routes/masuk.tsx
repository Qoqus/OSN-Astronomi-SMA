import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useStore } from '@/state/user-store'
import { Button } from '@/components/ui/Button'
import { LangitBintang } from '@/components/ui/LangitBintang'
import { Lumi } from '@/components/lumi/Lumi'
import { modeRemote } from '@/lib/api'

export function Masuk() {
  const profil = useStore((s) => s.profil)
  const masuk = useStore((s) => s.masuk)
  const navigate = useNavigate()
  const [nama, setNama] = useState('')
  const [memuat, setMemuat] = useState(false)
  const [error, setError] = useState('')

  if (profil) return <Navigate to="/" replace />

  async function kirim(e: FormEvent) {
    e.preventDefault()
    const bersih = nama.trim()
    if (bersih.length < 2) {
      setError('Tulis namamu minimal dua huruf.')
      return
    }
    setError('')
    setMemuat(true)
    try {
      await masuk(bersih)
      navigate('/', { replace: true })
    } catch {
      setError('Gagal menyimpan profil. Coba lagi.')
    } finally {
      setMemuat(false)
    }
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center px-5 py-10">
      <div className="lapis-nebula" aria-hidden="true" />
      <LangitBintang />
      <div className="lapis-grain" aria-hidden="true" />
      <div className="anim-masuk relative z-10 w-full max-w-[420px]">
        <div className="mb-10 text-center">
          <p className="bg-gradient-to-r from-cyan via-ungu to-magenta bg-clip-text font-display text-[1.35rem] font-semibold tracking-tight text-transparent">
            Ruang Langit
          </p>
          <p className="mt-0.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-faint">
            Belajar OSN Astronomi
          </p>
        </div>

        <Lumi ekspresi="senang" ukuran={92} className="mx-auto mb-3" />
        <h1 className="text-center text-[2rem] leading-tight">Siapa namamu?</h1>
        <p className="mt-2 text-center text-[15.5px] leading-relaxed text-muted">
          Lumi akan menemani perjalananmu — nama ini menyimpan progres, streak, dan capaianmu.
        </p>

        <form onSubmit={kirim} className="mt-6">
          <label htmlFor="nama" className="sr-only">
            Nama
          </label>
          <input
            id="nama"
            autoFocus
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Budi"
            autoComplete="off"
            className="w-full rounded-[10px] border border-line bg-surface px-4 py-3.5 text-[17px] outline-none transition focus:border-olive/60"
          />
          <p className="mt-2 text-[13px] leading-relaxed text-faint">
            Huruf besar atau kecil tidak dibedakan — “Budi” dan “budi” adalah profil yang sama.
          </p>
          {error && (
            <p className="mt-3 text-[14px] text-korall" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" className="mt-5 w-full" disabled={memuat}>
            {memuat ? 'Menyiapkan…' : 'Mulai belajar'}
          </Button>
        </form>

        <p className="mt-8 text-center text-[12px] text-faint">
          {modeRemote
            ? 'Profil tersimpan di Supabase — bisa dibuka dari perangkat lain.'
            : 'Mode lokal — progres tersimpan di browser ini.'}
        </p>
      </div>
    </div>
  )
}
