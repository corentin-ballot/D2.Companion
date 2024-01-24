import { useQuery } from '@tanstack/react-query'

export interface AchievementCategory {
  id: number
  name: string
  parentId: number
  order: number
  achievementIds: number[]
  iconId: number
}

export const useDofusAchievementCategories = () => {
  const fetchDofusAchievementCategories = async () => {
    const response = await fetch(`${process.env.PUBLIC_URL}/data/achievement-categories.json`)
    const data = await response.json() as AchievementCategory[]

    return data
  }

  return useQuery({ queryKey: ["DofusAchievementCategories"], queryFn: fetchDofusAchievementCategories })
}

export default useDofusAchievementCategories