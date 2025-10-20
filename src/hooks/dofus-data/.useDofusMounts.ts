import { useQuery } from '@tanstack/react-query'

export interface Mount {
  id: number
  name: string
  certificateId: number
}

export const useDofusMounts = () => {
  const fetchDofusMounts = async () => {
    const response = await fetch(`${process.env.PUBLIC_URL}/data/mounts.json`)
    const data = await response.json() as Mount[]

    return data
  }

  return useQuery({ queryKey: ["DofusMounts"], queryFn: fetchDofusMounts })
}

export default useDofusMounts