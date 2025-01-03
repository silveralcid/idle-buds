import { BaseItem } from "../types/itemBase.types";
import { foodItems } from "./items/food.data";
import { lumberingItems } from "./items/log.data";
import { miningItems } from "./items/ore.data";
import { smeltedItems } from "./items/smelted.data";
import { melee } from "./items/melee.data";
import { armor } from "./items/armor.data";
import { currencyItems } from "./items/currency.data";

// Aggregate all items into a single registry
export const itemRegistry: BaseItem[] = [
  ...foodItems,
  ...lumberingItems,
  ...miningItems,
  ...smeltedItems,
  ...melee,
  ...armor,
  ...currencyItems,
];

// Utility function to find item by ID
export const getItemById = (itemId: string): BaseItem | undefined => {
  return itemRegistry.find(item => item.id === itemId);
};

// Utility function to filter items by type
export const getItemsByType = (type: string): BaseItem[] => {
  return itemRegistry.filter(item => item.type === type);
};

// Utility function to filter items by tag
export const getItemsByTag = (tag: string): BaseItem[] => {
  return itemRegistry.filter(item => item.tags?.includes(tag) ?? false);
};