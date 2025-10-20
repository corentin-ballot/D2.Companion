import { useQuery } from '@tanstack/react-query'

export interface Monster {
  id: number
  name: string
}

export const useDofusMonsters = () => {
  const fetchDofusMonsters = async () => {
      const response = await fetch(`${process.env.PUBLIC_URL}/data/monsters.json`)
      const data = await response.json() as Monster[]
      
      return data
    }

  return useQuery({ queryKey: ["DofusMonsters"], queryFn: fetchDofusMonsters })
}

export default useDofusMonsters