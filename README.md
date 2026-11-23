# Ruang Langit — Belajar OSN Astronomi

Situs belajar terstruktur untuk persiapan OSN Astronomi (selaras IOAA) bagi siswa kelas 10.
Bukan sekadar bank soal: materi interaktif → kuis bertahap → rekomendasi adaptif → peta progres.

## Menjalankan

```bash
npm install
npm run dev          # http://localhost:5173
npm run check        # tsc + validasi konten + Vitest
npm run build        # tsc --noEmit && vite build → dist/
npm run preview
```

Tanpa `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`, aplikasi berjalan sepenuhnya
di mode lokal: profil dan progres disimpan di `localStorage` browser.

## Supabase (profil lintas perangkat)

1. Buat project di [supabase.com](https://supabase.com).
2. Buka SQL Editor dan jalankan isi `supabase/migrations/0001_init.sql`.
   Skrip ini membuat tabel, mengaktifkan RLS **tanpa policy untuk anon**, mencabut akses
   langsung ke tabel, lalu membuat RPC `SECURITY DEFINER`:
   `login_or_create_profile`, `get_learning_state`, `record_attempt`,
   `save_chapter_progress`, `unlock_achievement`.
3. Salin `.env.example` menjadi `.env` dan isi `VITE_SUPABASE_URL` serta
   `VITE_SUPABASE_ANON_KEY` dari Project Settings → API.
4. Di Netlify, set dua environment variable yang sama; `netlify.toml` sudah mengatur
   SPA redirect ke `index.html`.

### Trade-off keamanan: login nama tanpa kata sandi

Nama adalah identitas, bukan autentikasi. Siapa pun yang tahu nama dapat membuka profil
itu. UUID profil dan akses RPC-only mencegah enumerasi massal, bukan penyamaran.
Ini keputusan produk yang disengaja (belajar bersama, tanpa gesekan daftar akun);
jangan gunakan untuk data pribadi atau nilai resmi.

## Konten

- Katalog bab: `content/index.ts` (19 bab, tier Fondasi → Inti → Lanjutan).
- Materi: `content/materi/**/*.mdx` (MDX + KaTeX + GFM).
- Bank soal: `content/soal/*.json` (Zod, divalidasi sebelum build).

Menambah bab: set `tersedia: true`, isi `file` dan `soalFile` di katalog, lalu jalankan
`npm run validate:content` (bagian dari `npm run check`). Setiap bank soal butuh
≥10 soal, ≥1 soal level `penalaran`, dan topik yang terdaftar di bab tersebut.

## Struktur singkat

```
content/           katalog, materi MDX, bank soal JSON
src/routes/        masuk, beranda, peta, bab, kuis, latihan, progres
src/lib/           grading, adaptive, achievements, quiz-builder, storage, api
src/state/         Zustand store (profil, state belajar, sesi kuis)
supabase/          migrasi SQL (tabel + RPC)
script/            validator konten
```
