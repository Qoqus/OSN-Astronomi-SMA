import { z } from 'zod'

export const TIPE_VISUAL = [
  'hr_diagram',
  'light_curve',
  'rv_curve',
  'spectrum',
  'blackbody_curve',
  'color_color_diagram',
  'orbit_diagram',
  'pzs_triangle',
  'sky_map',
  'phase_fold',
  'data_table',
  'log_scale_bar',
  'linearization_plot',
  'rot_curve',
  'hubble_diagram',
  'filter_curves',
  'airy_disk',
  'cmd_diagram',
  'energy_level',
  'schematic',
] as const

export type TipeVisual = (typeof TIPE_VISUAL)[number]

export const SET_TIPE_VISUAL = new Set<string>(TIPE_VISUAL)

export const skemaMedia = z.object({
  type: z.enum(TIPE_VISUAL),
  params: z.record(z.string(), z.unknown()),
  caption: z.string().min(1).optional(),
})

export type MediaParametrik = z.infer<typeof skemaMedia>
