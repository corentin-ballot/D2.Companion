import { useQuery } from '@tanstack/react-query'

export interface Spell {
  id: number
  name: string
  typeId: number
  iconId: number
}

export const useDofusSpells = () => {
  const fetchDofusSpells = async () => {
      const response = await fetch(`${process.env.PUBLIC_URL}/data/spells.json`)
      const data = await response.json() as Spell[]
      
      return data
    }

  return useQuery({ queryKey: ["DofusSpells"], queryFn: fetchDofusSpells })
}

export default useDofusSpells