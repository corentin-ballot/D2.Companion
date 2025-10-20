import { useQuery } from '@tanstack/react-query'

export interface Mount {
  id: number
  name: string
  certificateId: number
}

export const fetchDofusMount = async (id: number) => {
  const response = await fetch(`http://localhost:3960/mounts/${id}`);
  return await response.json() as Mount;
}

export const useDofusMount = (id: number) => useQuery({ queryKey: ["DofusMount", id], queryFn: () => fetchDofusMount(id) });

export default useDofusMount;