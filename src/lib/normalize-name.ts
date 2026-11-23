export function normalisasiNama(nama: string): string {
  return nama
    .normalize('NFKC')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
}

export function namaTampil(nama: string): string {
  return nama.normalize('NFKC').trim().replace(/\s+/g, ' ')
}
