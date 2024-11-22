import { ItemType } from "../enums/itemType.enums";

export interface BaseItem {
    // Identification
    id: string; // Unique identifier for the item
    variantId?: string; // Optional identifier for item variants (e.g., "iron_sword+1")
    name: string; // Display name of the item
    type: ItemType; // Core category of the item (see below)
    tier?: number; // Tier of the item
  
    // General Properties
    description?: string; // Optional description for lore or context
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'; // Rarity tier
    value: number; // Base value for trading or selling
  
    // Stackable Items
    isStackable: boolean; // Whether this item can stack in inventory
    maxStackSize?: number; // Maximum stack size (if stackable)
  
    // Metadata (Extensibility)
    metadata?: Record<string, any>; // Flexible field for unique attributes
  
    // Tags and Filters
    tags?: string[]; // Tags for filtering or categorization (e.g., "crafting", "quest")
  }