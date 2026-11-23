import 'dotenv/config'
import express, { type Request, type Response } from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { GoogleGenAI, Type } from '@google/genai'
import { z } from 'zod'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const skemaEvaluasiEsai = z.object({
  pertanyaan: z.string().min(5).max(4000),
  topik: z.string().min(1).max(120),
  level: z.string().min(1).max(60),
  jawabanSiswa: z.string().min(5).max(8000),
  rubrik: z
    .array(
      z.object({
        poin: z.string().min(1).max(1000),
        bobot: z.number().positive(),
      }),
    )
    .min(1)
    .max(12),
  jawabanTeladan: z.string().max(4000).optional(),
  pembahasan: z.array(z.string().max(2000)).max(20).optional(),
})

interface HasilRubrikModel {
  indeks: number
  status: 'penuh' | 'sebagian' | 'belum'
  alasan: string
}

interface ResponsEvaluasiModel {
  ringkasan: string
  kekuatan: string[]
  perbaikan: string[]
  konsepTerlewat: string[]
  rubrikHasil: HasilRubrikModel[]
}

const MODEL_ESAI = 'gemini-4-hydrogen'

function buatKlienGemini(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim()
  if (!apiKey) return null
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  })
}

async function startServer() {
  const app = express()
  const port = Number(process.env.PORT) || 3000
  const isProd = process.env.NODE_ENV === 'production'

  app.use(express.json({ limit: '64kb' }))

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true, aiConfigured: Boolean(process.env.GEMINI_API_KEY?.trim()) })
  })

  app.post('/api/evaluasi-esai', async (req: Request, res: Response) => {
    const parsed = skemaEvaluasiEsai.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        error: 'Permintaan evaluasi esai tidak lengkap atau tidak valid.',
      })
      return
    }

    const ai = buatKlienGemini()
    if (!ai) {
      res.status(503).json({
        error:
          'Layanan AI belum memiliki GEMINI_API_KEY di server. Tambahkan kunci API di panel Settings > Secrets.',
      })
      return
    }

    const { pertanyaan, topik, level, jawabanSiswa, rubrik, jawabanTeladan, pembahasan } =
      parsed.data

    const daftarRubrik = rubrik
      .map((r, i) => `${i}. [bobot ${r.bobot}] ${r.poin}`)
      .join('\n')

    const referensiPembahasan =
      pembahasan && pembahasan.length > 0
        ? pembahasan.map((p, i) => `${i + 1}. ${p}`).join('\n')
        : '-'

    const prompt = [
      `Topik: ${topik} | Level: ${level}`,
      '',
      'SOAL ESAI:',
      pertanyaan,
      '',
      'RUBRIK PENILAIAN (indeks 0 sampai ' + (rubrik.length - 1) + '):',
      daftarRubrik,
      '',
      'JAWABAN TELADAN / PEMBAHASAN REFERENSI:',
      jawabanTeladan ? `Teladan: ${jawabanTeladan}\n` : '',
      referensiPembahasan,
      '',
      'JAWABAN SISWA:',
      jawabanSiswa,
    ].join('\n')

    try {
      const response = await ai.models.generateContent({
        model: MODEL_ESAI,
        contents: prompt,
        config: {
          systemInstruction:
            'Kamu adalah pembina OSN Astronomi yang teliti, adil, dan suportif. ' +
            'Tugasmu mengevaluasi jawaban esai siswa berdasarkan rubrik yang diberikan. ' +
            'Nilai setiap poin rubrik secara jujur: "penuh" bila konsep/penurunan/argumennya benar dan lengkap, ' +
            '"sebagian" bila arahnya benar namun kurang lengkap/kurang presisi/ada kekeliruan kecil, ' +
            'atau "belum" bila poin tidak dibahas atau konsepnya keliru. ' +
            'Jangan memberi nilai penuh jika siswa hanya menulis kalimat umum tanpa penalaran fisis/matematis yang diminta. ' +
            'Berikan umpan balik dalam bahasa Indonesia yang jelas, langsung menyapa siswa ("kamu"), ' +
            'sebutkan apa yang sudah tepat, apa yang perlu diperbaiki, dan konsep kunci yang terlewat.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              ringkasan: {
                type: Type.STRING,
                description: 'Ringkasan evaluasi 2-3 kalimat yang langsung ditujukan kepada siswa.',
              },
              kekuatan: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '1-3 hal yang sudah benar atau kuat dalam jawaban siswa.',
              },
              perbaikan: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '1-3 saran perbaikan konkret pada langkah penalaran atau perhitungan.',
              },
              konsepTerlewat: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Konsep, rumus, atau syarat batas penting yang belum muncul.',
              },
              rubrikHasil: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    indeks: { type: Type.INTEGER },
                    status: {
                      type: Type.STRING,
                      description: 'Harus salah satu dari: penuh, sebagian, belum',
                    },
                    alasan: {
                      type: Type.STRING,
                      description: 'Alasan singkat 1 kalimat mengapa status ini diberikan.',
                    },
                  },
                  required: ['indeks', 'status', 'alasan'],
                },
              },
            },
            required: ['ringkasan', 'kekuatan', 'perbaikan', 'konsepTerlewat', 'rubrikHasil'],
          },
        },
      })

      const rawText = (response.text ?? '').trim()
      if (!rawText) {
        res.status(502).json({ error: 'Model AI mengembalikan respons kosong.' })
        return
      }

      const hasilModel = JSON.parse(rawText) as ResponsEvaluasiModel

      const petaRubrik = new Map<number, HasilRubrikModel>()
      for (const item of hasilModel.rubrikHasil ?? []) {
        if (typeof item.indeks === 'number') {
          const statusValid: 'penuh' | 'sebagian' | 'belum' =
            item.status === 'penuh' || item.status === 'sebagian' || item.status === 'belum'
              ? item.status
              : 'belum'
          petaRubrik.set(item.indeks, {
            indeks: item.indeks,
            status: statusValid,
            alasan: item.alasan || '',
          })
        }
      }

      let totalBobot = 0
      let bobotTercapai = 0
      const rubrikTernormalisasi = rubrik.map((r, i) => {
        const entry = petaRubrik.get(i)
        const status: 'penuh' | 'sebagian' | 'belum' = entry?.status ?? 'belum'
        const faktor = status === 'penuh' ? 1 : status === 'sebagian' ? 0.5 : 0
        totalBobot += r.bobot
        bobotTercapai += r.bobot * faktor
        return {
          indeks: i,
          status,
          faktor,
          alasan: entry?.alasan || 'Tidak tercakup secara eksplisit pada jawaban.',
        }
      })

      const skor = totalBobot > 0 ? Number((bobotTercapai / totalBobot).toFixed(3)) : 0

      res.json({
        skor,
        benar: skor >= 0.7,
        ringkasan: hasilModel.ringkasan || 'Evaluasi selesai.',
        kekuatan: Array.isArray(hasilModel.kekuatan) ? hasilModel.kekuatan.slice(0, 4) : [],
        perbaikan: Array.isArray(hasilModel.perbaikan) ? hasilModel.perbaikan.slice(0, 4) : [],
        konsepTerlewat: Array.isArray(hasilModel.konsepTerlewat)
          ? hasilModel.konsepTerlewat.slice(0, 4)
          : [],
        rubrikHasil: rubrikTernormalisasi,
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error('Error evaluasi esai Gemini:', msg)
      if (msg.includes('403') || msg.includes('PERMISSION_DENIED') || msg.includes('API_KEY_INVALID')) {
        res.status(403).json({
          error:
            'Kunci API Gemini ditolak atau belum valid. Periksa GEMINI_API_KEY di panel Settings > Secrets.',
        })
        return
      }
      if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
        res.status(429).json({
          error: 'Batas kuota permintaan AI tercapai sementara. Coba lagi beberapa saat lagi.',
        })
        return
      }
      res.status(502).json({
        error: 'Gagal menghubungi evaluator AI. Silakan coba lagi atau nilai dengan rubrik mandiri.',
      })
    }
  })

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite')
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    })
    app.use(vite.middlewares)
  } else {
    const distDir = path.resolve(__dirname, 'dist')
    app.use(express.static(distDir))
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'))
    })
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Ruang Langit server berjalan di http://0.0.0.0:${port}`)
  })
}

void startServer()
