import { useQuery } from '@tanstack/react-query'

export interface PossibleEffect {
  diceNum: number
  diceConst?: number
  effectId: number
  diceSide: number
}

export interface Item {
  id: number
  name: { fr: string }
  level: number
  iconId: number
  possibleEffects: PossibleEffect[]
  typeId: number
  hasRecipe: boolean
  estimatedPrice: number
  recipeEstimatedPrice: number
  recyclingNuggets: number
}

export const fetchDofusItem = async (id: number) => {
  const response = await fetch(`http://localhost:3960/items/${id}`);
  return await response.json() as Item;
}

export interface Price {
  date: string
  price: number
}

export const fetchDofusItemPrices = async (id: number) => {
  const response = await fetch(`http://localhost:3960/items/${id}/averagePrices`);
  return await response.json() as Price[];
}

export const fetchDofusItemName = async (name: string) => {
  const response = await fetch(`http://localhost:3960/items/search?name=${name}`);
   return await response.json() as Item[];
}

export const useDofusItem = (id: number) => useQuery({ queryKey: ["DofusItem", id], queryFn: () => fetchDofusItem(id) });
export const useDofusItemPrices = (id: number) => useQuery({ queryKey: ["DofusItemPrices", id], queryFn: () => fetchDofusItemPrices(id) });
export const useDofusItemSearch = (name: string) => useQuery({ queryKey: ["DofusItemSearch", name], queryFn: () => fetchDofusItemName(name) });

export default useDofusItem;