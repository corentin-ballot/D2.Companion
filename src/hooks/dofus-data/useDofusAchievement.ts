import { useQuery } from '@tanstack/react-query'

export interface Achievement {
  id: number
  name: { fr: string }
  categoryId: number
  order: number
  iconId: number
}

export const fetchDofusAchievement = async (id: number) => {
  const response = await fetch(`http://localhost:3960/achievements/${id}`);
  return await response.json() as Achievement;
}

export const useDofusAchievement = (id: number) => useQuery({ queryKey: ["DofusAchievements", id], queryFn: () => fetchDofusAchievement(id) });

export default useDofusAchievement;