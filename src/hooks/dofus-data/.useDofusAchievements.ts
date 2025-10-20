import { useQuery } from '@tanstack/react-query'

export interface Achievement {
  id: number
  name: string
  categoryId: number
  order: number
  iconId: number
}

export const useDofusAchievements = () => {
  const fetchDofusAchievements = async () => {
    const response = await fetch(`${process.env.PUBLIC_URL}/data/achievements.json`)
    const data = await response.json() as Achievement[]

    return data
  }

  return useQuery({ queryKey: ["DofusAchievements"], queryFn: fetchDofusAchievements })
}

export default useDofusAchievements