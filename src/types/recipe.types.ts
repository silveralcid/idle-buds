import { WorkbenchType } from "../enums/workbenchType.enum";
import { ItemType } from "../enums/itemType.enums";
export interface Recipe {
  id: string; // Unique identifier for the recipe
  name: string; // Name of the recipe
  workbenchType: WorkbenchType;
  itemType: ItemType; // Type of recipe (e.g., crafting, smelting, etc.)
  inputs: {
    itemIds: string[]; // List of possible item IDs for this input
    amount: number; // Quantity required (same for all alternatives)
  }[];
  outputs: {
    itemId: string; // ID of the output item
    amount: number; // Quantity of the output item
  }[];
  craftingTime: number; // Time required to craft in ticks
  levelRequired: number; // Minimum level required to craft this recipe
  experienceGain: number; // Experience points gained upon crafting

  tier?: number; // Optional field for categorizing recipes by difficulty or progression
  specialRequirements?: string[]; // Optional field for any special conditions (e.g., "Requires specific tool")
}