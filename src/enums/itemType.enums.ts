export type ItemType =
  | 'resource'      // Basic materials like wood, ore, herbs
  | 'crafting'     // Crafting materials like wood, ore, herbs
  | 'tool'          // Tools like pickaxes or fishing rods
  | 'equipment'     // Weapons, armor, accessories
  | 'consumable'    // Potions, food, scrolls
  | 'quest'         // Quest-specific items that can't be traded or crafted
  | 'currency';     // Money or special tokens