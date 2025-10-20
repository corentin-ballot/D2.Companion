import { useQuery } from '@tanstack/react-query'

export interface Comagnon {
  id: number
  name: string
  signeId: string
}

export const fetchDofusComagnons = async (id: number) => {
  const response = await fetch(`http://localhost:3960/companions/${id}`);
  return await response.json() as Comagnon;
}

export const useDofusComagnon = (id: number) => useQuery({ queryKey: ["DofusComagnons", id], queryFn: () => fetchDofusComagnons(id) });

export default useDofusComagnon;