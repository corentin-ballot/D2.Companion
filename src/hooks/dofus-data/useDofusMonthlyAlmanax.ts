import { useQuery } from '@tanstack/react-query'

export interface Name {
  fr: string
}

export interface Need {
  items: number[]
  quantities: number[]
}

export interface Reward {
  id: number
  levelMin: number
  levelMax: number
  kamasRatio: number
  experienceRatio: number
  kamasScaleWithPlayerLevel: boolean
}

export interface Step {
  id: number
  optimalLevel: number
  duration: number
  rewards: Reward[]
}

export interface Quest {
  id: number
  startCriterion: string
  name: Name
  need: Need
  steps: Step[]
  date: number
}

export const fetchDofusMonthlyAlmanax = async (year: number, month: number) => {
  const response = await fetch(`http://localhost:3960/almanax/${year}/${month}`);
  return await response.json() as Quest[];
}

export const useDofusMonthlyAlmanax = (year: number, month: number) => useQuery({ queryKey: ["DofusMonthlyAlmanax", month, year], queryFn: () => fetchDofusMonthlyAlmanax(year, month) });

export default useDofusMonthlyAlmanax;