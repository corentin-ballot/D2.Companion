import { useQuery } from '@tanstack/react-query'

export interface Spell {
  id: number
  name: { fr: string }
  typeId: number
  iconId: number
}

export const fetchDofusSpell = async (id: number) => {
  const response = await fetch(`http://localhost:3960/spells/${id}`);
  return await response.json() as Spell;
}

export const useDofusSpell = (id: number) => useQuery({ queryKey: ["DofusSpell", id], queryFn: () => fetchDofusSpell(id) });

export default useDofusSpell;