import { useQuery } from '@tanstack/react-query'

export interface Quest {
  id: number
  name: string
  categoryId: number
}

export const useDofusQuests = () => {
  const fetchDofusQuests = async () => {
    const response = await fetch(`${process.env.PUBLIC_URL}/data/quests.json`)
    const data = await response.json() as Quest[]

    return data
  }

  return useQuery({ queryKey: ["DofusQuests"], queryFn: fetchDofusQuests })
}

export default useDofusQuests