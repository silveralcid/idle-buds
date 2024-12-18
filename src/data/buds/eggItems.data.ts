import { BaseItem } from "../../types/itemBase.types";



export const eggItems: BaseItem[] = [
  {
    id: 'test_egg',
    name: 'Test Egg',
    type: 'egg',
    description: 'A test egg, used for testing.',
    rarity: 'common',
    value: 1,
    isStackable: true,
    maxStackSize: undefined, // Infinite stack size
    tags: ['egg', 'test', 'bud'],
  },
];


