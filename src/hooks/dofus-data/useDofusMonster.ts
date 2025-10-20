import { useQuery } from '@tanstack/react-query'

export interface Monster {
  id: number
  name: { fr: string }
}

export const fetchDofusMonster = async (id: number) => {
  const response = await fetch(`http://localhost:3960/monsters/${id}`);
  return await response.json() as Monster;
}

export const useDofusMonster = (id: number) => useQuery({ queryKey: ["DofusMonsters", id], queryFn: () => fetchDofusMonster(id) });

export default useDofusMonster;