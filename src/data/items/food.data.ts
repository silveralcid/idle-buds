import { ConsumableItem } from "../../types/consumable.types";

export const foodItems: ConsumableItem[] = [
  {
    id: 'cooked_sardine',
    name: 'Cooked Sardine',
    type: 'consumable',
    description: 'A small cooked fish that provides minor healing.',
    rarity: 'common',
    value: 5,
    isStackable: true,
    maxStackSize: undefined,
    tags: ['food', 'fish', 'cooked'],
    effects: [
      {
        type: 'heal',
        value: 3
      }
    ],
    cooldown: 1
  },
  {
    id: 'cooked_trout',
    name: 'Cooked Trout',
    type: 'consumable',
    description: 'A medium-sized cooked fish that provides moderate healing.',
    rarity: 'common',
    value: 12,
    isStackable: true,
    maxStackSize: undefined,
    tags: ['food', 'fish', 'cooked'],
    effects: [
      {
        type: 'heal',
        value: 7
      }
    ],
    cooldown: 1
  },
  {
    id: 'cooked_salmon',
    name: 'Cooked Salmon',
    type: 'consumable',
    description: 'A large cooked fish that provides substantial healing.',
    rarity: 'uncommon',
    value: 25,
    isStackable: true,
    maxStackSize: undefined,
    tags: ['food', 'fish', 'cooked'],
    effects: [
      {
        type: 'heal',
        value: 12
      }
    ],
    cooldown: 1
  },
  {
    id: 'cooked_tuna',
    name: 'Cooked Tuna',
    type: 'consumable',
    description: 'A large cooked fish that provides excellent healing.',
    rarity: 'uncommon',
    value: 40,
    isStackable: true,
    maxStackSize: undefined,
    tags: ['food', 'fish', 'cooked'],
    effects: [
      {
        type: 'heal',
        value: 18
      }
    ],
    cooldown: 1
  }
];
