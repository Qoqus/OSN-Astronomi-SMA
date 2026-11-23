import { createContext, useContext } from 'react'

export const KonteksPelajaran = createContext<string>('')

export function gunakanBabId(): string {
  return useContext(KonteksPelajaran)
}
