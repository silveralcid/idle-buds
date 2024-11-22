import { BaseItem } from "../../types/itemBase.types";

export const lumberingItems: BaseItem[] = [
  {
    id: 'oak_logs',
    name: 'Oak Logs',
    type: 'resource',
    description: 'Logs from an oak tree, used for crafting and construction.',
    rarity: 'common',
    value: 10,
    isStackable: true,
    maxStackSize: undefined, // Infinite stack size
    tags: ['crafting', 'lumbering'],
  },
  {
    id: 'pine_logs',
    name: 'Pine Logs',
    type: 'resource',
    description: 'Logs from a pine tree, used for crafting and construction.',
    rarity: 'common',
    value: 15,
    isStackable: true,
    maxStackSize: undefined, // Infinite stack size
    tags: ['crafting', 'lumbering'],
  },
  {
    id: 'birch_logs',
    name: 'Birch Logs',
    type: 'resource',
    description: 'Logs from a birch tree, used for crafting and construction.',
    rarity: 'uncommon',
    value: 20,
    isStackable: true,
    maxStackSize: undefined, // Infinite stack size
    tags: ['crafting', 'lumbering'],
  },
  {
    id: 'maple_logs',
    name: 'Maple Logs',
    type: 'resource',
    description:
      'Logs from a maple tree, prized for their quality in crafting and construction.',
    rarity: 'uncommon',
    value: 25,
    isStackable: true,
    maxStackSize: undefined, // Infinite stack size
    tags: ['crafting', 'lumbering'],
  },
  {
    id: 'mahogany_logs',
    name: 'Mahogany Logs',
    type: 'resource',
    description:
      'Logs from a mahogany tree, known for their durability and beauty.',
    rarity: 'rare',
    value: 30,
    isStackable: true,
    maxStackSize: undefined, // Infinite stack size
    tags: ['crafting', 'lumbering'],
  },
  {
    id: 'teak_logs',
    name: 'Teak Logs',
    type: 'resource',
    description:
      'Logs from a teak tree, valued for their strength and resistance to decay.',
    rarity: 'rare',
    value: 35,
    isStackable: true,
    maxStackSize: undefined, // Infinite stack size
    tags: ['crafting', 'lumbering'],
  },
  {
    id: 'ebony_logs',
    name: 'Ebony Logs',
    type: 'resource',
    description:
      'Logs from an ebony tree, prized for their dark color and high quality.',
    rarity: 'epic',
    value: 40,
    isStackable: true,
    maxStackSize: undefined, // Infinite stack size
    tags: ['crafting', 'lumbering'],
  },
  {
    id: 'yew_logs',
    name: 'Yew Logs',
    type: 'resource',
    description:
      'Logs from a yew tree, a legendary material used in high-tier crafting.',
    rarity: 'epic',
    value: 45,
    isStackable: true,
    maxStackSize: undefined, // Infinite stack size
    tags: ['crafting', 'lumbering'],
  },
];