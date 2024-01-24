import { useQuery } from '@tanstack/react-query'

export interface Quest {
    id: number
    name: string
    questIds: number[]
    order: number
}

export const useDofusQuestCategories = () => {
    const fetchDofusQuestCategories = async () => {
        const response = await fetch(`${process.env.PUBLIC_URL}/data/quest-categories.json`)
        const data = await response.json() as Quest[]

        return data
    }

    return useQuery({ queryKey: ["DofusQuestCategories"], queryFn: fetchDofusQuestCategories })
}

export default useDofusQuestCategories