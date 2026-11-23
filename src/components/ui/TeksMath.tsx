import { useMemo } from 'react'
import katex from 'katex'

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const POLA = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g

function renderMath(teks: string): string {
  if (!teks) return ''
  let hasil = ''
  let terakhir = 0
  for (const cocok of teks.matchAll(POLA)) {
    const indeks = cocok.index ?? 0
    hasil += escapeHtml(teks.slice(terakhir, indeks)).replace(/\n/g, '<br/>')
    const mentah = cocok[0]
    const display = mentah.startsWith('$$')
    const isi = display ? mentah.slice(2, -2) : mentah.slice(1, -1)
    try {
      hasil += katex.renderToString(isi.trim(), {
        displayMode: display,
        throwOnError: false,
        strict: false,
        trust: false,
      })
    } catch {
      hasil += escapeHtml(mentah)
    }
    terakhir = indeks + mentah.length
  }
  hasil += escapeHtml(teks.slice(terakhir)).replace(/\n/g, '<br/>')
  return hasil
}

interface Props {
  teks?: string
  className?: string
}

export function TeksMath({ teks = '', className }: Props) {
  const html = useMemo(() => renderMath(teks), [teks])
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
}