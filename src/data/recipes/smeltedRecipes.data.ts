import { Recipe } from "../../types/recipe.types";

export const smeltedRecipes: Recipe[] = [
  {
    id: "copper_ore_to_copper_bar",
    name: "Smelt Copper Bar",
    workbenchType: "smelting",
    itemType: "crafting",
    inputs: [
      { itemIds: ["copper_ore"], amount: 1 },
      { itemIds: ["coal"], amount: 1 },
    ],
    outputs: [
      { itemId: "copper_bar", amount: 1 },
    ],
    craftingTime: 100, // Time in ticks
    levelRequired: 1,
    experienceGain: 10,
  },
  {
    id: "iron_ore_to_iron_bar",
    name: "Smelt Iron Bar",
    workbenchType: "smelting",
    itemType: "crafting",
    inputs: [
      { itemIds: ["iron_ore"], amount: 1 },
      { itemIds: ["coal"], amount: 1 },
    ],
    outputs: [
      { itemId: "iron_bar", amount: 1 },
    ],
    craftingTime: 150, // Time in ticks
    levelRequired: 5,
    experienceGain: 15,
  },
  {
    id: "silver_ore_to_silver_bar",
    name: "Smelt Silver Bar",
    workbenchType: "smelting",
    itemType: "crafting",
    inputs: [
      { itemIds: ["silver_ore"], amount: 1 },
      { itemIds: ["coal"], amount: 2 },
    ],
    outputs: [
      { itemId: "silver_bar", amount: 1 },
    ],
    craftingTime: 200, // Time in ticks
    levelRequired: 10,
    experienceGain: 20,
  },
  {
    id: "gold_ore_to_gold_bar",
    name: "Smelt Gold Bar",
    workbenchType: "smelting",
    itemType: "crafting",
    inputs: [
      { itemIds: ["gold_ore"], amount: 1 },
      { itemIds: ["coal"], amount: 2 },
    ],
    outputs: [
      { itemId: "gold_bar", amount: 1 },
    ],
    craftingTime: 250, // Time in ticks
    levelRequired: 15,
    experienceGain: 25,
  },
  {
    id: "platinum_ore_to_platinum_bar",
    name: "Smelt Platinum Bar",
    workbenchType: "smelting",
    itemType: "crafting",
    inputs: [
      { itemIds: ["platinum_ore"], amount: 1 },
      { itemIds: ["coal"], amount: 3 },
    ],
    outputs: [
      { itemId: "platinum_bar", amount: 1 },
    ],
    craftingTime: 300, // Time in ticks
    levelRequired: 20,
    experienceGain: 30,
  },
  {
    id: "mithril_ore_to_mithril_bar",
    name: "Smelt Mithril Bar",
    workbenchType: "smelting",
    itemType: "crafting",
    inputs: [
      { itemIds: ["mithril_ore"], amount: 1 },
      { itemIds: ["coal"], amount: 3 },
    ],
    outputs: [
      { itemId: "mithril_bar", amount: 1 },
    ],
    craftingTime: 350, // Time in ticks
    levelRequired: 25,
    experienceGain: 35,

  },
  {
    id: "adamantite_ore_to_adamantite_bar",
    name: "Smelt Adamantite Bar",   
    workbenchType: "smelting",
    itemType: "crafting",
    inputs: [
      { itemIds: ["adamantite_ore"], amount: 1 },
      { itemIds: ["coal"], amount: 4 },
    ],
    outputs: [
      { itemId: "adamantite_bar", amount: 1 },
    ],  
    craftingTime: 400, // Time in ticks
    levelRequired: 30,
    experienceGain: 40,
  },
  {
    id: "runite_ore_to_runite_bar",
    name: "Smelt Runite Bar",
    workbenchType: "smelting",
    itemType: "crafting",
    inputs: [
      { itemIds: ["runite_ore"], amount: 1 },
      { itemIds: ["coal"], amount: 4 },
    ],
    outputs: [
      { itemId: "runite_bar", amount: 1 },
    ],
    craftingTime: 450, // Time in ticks
    levelRequired: 35,
    experienceGain: 45,
  }

];
