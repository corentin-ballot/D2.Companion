import { useQuery } from '@tanstack/react-query'

export interface PossibleEffect {
  diceNum: number
  diceConst?: number
  effectId: number
  diceSide: number
}

export interface Item {
  id: number
  name: string
  level: number
  iconId: number
  possibleEffects: PossibleEffect[]
  typeId: number
}

export const useDofusItems = () => {
  const fetchDofusItems = async () => {
      const response = await fetch(`${process.env.PUBLIC_URL}/data/items.json`)
      const data = await response.json() as Item[]
      
      return data
    }

  return useQuery({ queryKey: ["DofusItems"], queryFn: fetchDofusItems })
}

export default useDofusItems