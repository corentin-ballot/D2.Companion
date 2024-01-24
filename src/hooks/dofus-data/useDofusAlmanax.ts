import { useQuery } from '@tanstack/react-query'

export interface Almanax {
  date: string
  merydes: string
  bonus: string
}

export const useDofusAlmanaxes = () => {
  const fetchDofusAlmanaxes = async () => {
    const response = await fetch(`${process.env.PUBLIC_URL}/data/almanax.json`)
    const data = await response.json() as Almanax[]

    return data
  }

  return useQuery({ queryKey: ["DofusAlmanaxes"], queryFn: fetchDofusAlmanaxes })
}

export default useDofusAlmanaxes