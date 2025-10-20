import { useQuery } from '@tanstack/react-query'

export interface Effect {
  id: number
  description: { fr: string }
  characteristicOperator?: string
  effectPowerRate: number
}

export const fetchDofusEffect = async (id: number) => {
  const response = await fetch(`http://localhost:3960/effects/${id}`);
  return await response.json() as Effect;
}

export const useDofusEffect = (id: number) => useQuery({ queryKey: ["DofusEffects", id], queryFn: () => fetchDofusEffect(id) });

export default useDofusEffect;