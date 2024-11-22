import { BaseItem } from "../../types/itemBase.types";
export const miningItems: BaseItem[] = [
  {
    id: 'coal',
    name: 'Coal',
    type: 'resource',
    description: 'A chunk of raw coal, used for crafting and refining.',
    rarity: 'common',
    value: 5,
    isStackable: true,
    maxStackSize: undefined, // Infinite stack size
    tags: ['crafting', 'mining'],
  },
  {
    id: 'copper_ore',
    name: 'Copper Ore',
    type: 'resource',
    description: 'A chunk of raw copper, used for crafting and refining.',
    rarity: 'common',
    value: 10,
    isStackable: true,
    maxStackSize: undefined, // Infinite stack size
    tags: ['crafting', 'mining'],
  },
  {
    id: 'iron_ore',
    name: 'Iron Ore',
    type: 'resource',
    description: 'A chunk of raw iron, used for crafting and refining.',
    rarity: 'common',
    value: 15,
    isStackable: true,
    maxStackSize: undefined, // Infinite stack size
    tags: ['crafting', 'mining'],
  },
  {
    id: 'silver_ore',
    name: 'Silver Ore',
    type: 'resource',
    description: 'A chunk of raw silver, used for crafting and refining.',
    rarity: 'uncommon',
    value: 20,
    isStackable: true,
    maxStackSize: undefined, // Infinite stack size
    tags: ['crafting', 'mining'],
  },
  {
    id: 'gold_ore',
    name: 'Gold Ore',
    type: 'resource',
    description: 'A chunk of raw gold, used for crafting and refining.',
    rarity: 'uncommon',
    value: 25,
    isStackable: true,
    maxStackSize: undefined, // Infinite stack size
    tags: ['crafting', 'mining'],
  },
  {
    id: 'platinum_ore',
    name: 'Platinum Ore',
    type: 'resource',
    description:
      'A chunk of raw platinum, prized for its rarity in crafting and refining.',
    rarity: 'rare',
    value: 30,
    isStackable: true,
    maxStackSize: undefined, // Infinite stack size
    tags: ['crafting', 'mining'],
  },
  {
    id: 'mithril_ore',
    name: 'Mithril Ore',
    type: 'resource',
    description:
      'A chunk of raw mithril, prized for its strength and lightness in crafting.',
    rarity: 'rare',
    value: 35,
    isStackable: true,
    maxStackSize: undefined, // Infinite stack size
    tags: ['crafting', 'mining'],
  },
  {
    id: 'adamantite_ore',
    name: 'Adamantite Ore',
    type: 'resource',
    description:
      'A chunk of raw adamantite, known for its exceptional durability in crafting.',
    rarity: 'epic',
    value: 40,
    isStackable: true,
    maxStackSize: undefined, // Infinite stack size
    tags: ['crafting', 'mining'],
  },
  {
    id: 'runite_ore',
    name: 'Runite Ore',
    type: 'resource',
    description:
      'A chunk of raw runite, a legendary material used in high-tier crafting.',
    rarity: 'epic',
    value: 45,
    isStackable: true,
    maxStackSize: undefined, // Infinite stack size
    tags: ['crafting', 'mining'],
  },
];