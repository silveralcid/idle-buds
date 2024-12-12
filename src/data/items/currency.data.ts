import { BaseItem } from "../../types/itemBase.types";

export const currencyItems: BaseItem[] = [
  {
    id: 'gold_coin',
    name: 'Gold Coin',
    type: 'currency',
    description: 'A gold coin, used for purchasing items and services.',
    rarity: 'common',
    value: 1,
    isStackable: true,
    maxStackSize: undefined, // Infinite stack size
    tags: ['currency'],
  },
];