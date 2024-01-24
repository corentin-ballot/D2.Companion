import { useQuery } from '@tanstack/react-query'

export interface PossibleEffect {
  _id: string
  targetMask: string
  diceNum: number
  visibleInBuffUi: boolean
  baseEffectId: number
  visibleInFightLog: boolean
  targetId: number
  effectElement: number
  effectUid: number
  dispellable: number
  triggers: string
  spellId: number
  duration: number
  random: number
  effectId: number
  delay: number
  diceSide: number
  visibleOnTerrain: boolean
  visibleInTooltip: boolean
  rawZone: string
  forClientOnly: boolean
  value: number
  order: number
  group: number
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