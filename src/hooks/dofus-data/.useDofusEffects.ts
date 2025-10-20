import { useQuery } from '@tanstack/react-query'

export interface Effect {
  id: number
  description: string
  operator?: string
  effectPowerRate: number
}

export const useDofusEffects = () => {
  const fetchDofusEffects = async () => {
    const response = await fetch(`${process.env.PUBLIC_URL}/data/effects.json`)
    const data = await response.json() as Effect[]

    return data
  }

  return useQuery({ queryKey: ["DofusEffects"], queryFn: fetchDofusEffects })
}

export default useDofusEffects