import { useQuery } from '@tanstack/react-query'

export interface Comagnon {
  id: number
  name: string
  img: string
}

export const useDofusComagnons = () => {
  const fetchDofusComagnons = async () => {
      const response = await fetch(`${process.env.PUBLIC_URL}/data/compagnons.json`)
      const data = await response.json() as Comagnon[]
      
      return data
    }

  return useQuery({ queryKey: ["DofusComagnons"], queryFn: fetchDofusComagnons })
}

export default useDofusComagnons