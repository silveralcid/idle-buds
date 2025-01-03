import { Recipe } from "../../types/recipe.types";

export const armorRecipes: Recipe[] = [
  // Copper Armor Set Recipes
  {
    id: "copper_helmet_recipe",
    name: "Craft Copper Helmet",
    workbenchType: "smithing",
    itemType: "equipment",
    inputs: [
      { itemIds: ["copper_bar"], amount: 3 },
    ],
    outputs: [
      { itemId: "copper_helmet", amount: 1 },
    ],
    craftingTime: 150,
    levelRequired: 1,
    experienceGain: 15,
    tier: 1,
  },
  {
    id: "copper_chestplate_recipe",
    name: "Craft Copper Chestplate",
    workbenchType: "smithing",
    itemType: "equipment",
    inputs: [
      { itemIds: ["copper_bar"], amount: 5 },
    ],
    outputs: [
      { itemId: "copper_chestplate", amount: 1 },
    ],
    craftingTime: 200,
    levelRequired: 1,
    experienceGain: 25,
    tier: 1,
  },
  {
    id: "copper_legs_recipe",
    name: "Craft Copper Legs",
    workbenchType: "smithing",
    itemType: "equipment",
    inputs: [
      { itemIds: ["copper_bar"], amount: 4 },
    ],
    outputs: [
      { itemId: "copper_legs", amount: 1 },
    ],
    craftingTime: 175,
    levelRequired: 1,
    experienceGain: 20,
    tier: 1,
  },
  {
    id: "copper_boots_recipe",
    name: "Craft Copper Boots",
    workbenchType: "smithing",
    itemType: "equipment",
    inputs: [
      { itemIds: ["copper_bar"], amount: 2 },
    ],
    outputs: [
      { itemId: "copper_boots", amount: 1 },
    ],
    craftingTime: 125,
    levelRequired: 1,
    experienceGain: 12,
    tier: 1,
  },

  // Iron Armor Set Recipes
  {
    id: "iron_helmet_recipe",
    name: "Craft Iron Helmet",
    workbenchType: "smithing",
    itemType: "equipment",
    inputs: [
      { itemIds: ["iron_bar"], amount: 3 },
    ],
    outputs: [
      { itemId: "iron_helmet", amount: 1 },
    ],
    craftingTime: 200,
    levelRequired: 5,
    experienceGain: 30,
    tier: 2,
  },
  {
    id: "iron_chestplate_recipe",
    name: "Craft Iron Chestplate",
    workbenchType: "smithing",
    itemType: "equipment",
    inputs: [
      { itemIds: ["iron_bar"], amount: 5 },
    ],
    outputs: [
      { itemId: "iron_chestplate", amount: 1 },
    ],
    craftingTime: 250,
    levelRequired: 5,
    experienceGain: 50,
    tier: 2,
  },
  {
    id: "iron_legs_recipe",
    name: "Craft Iron Legs",
    workbenchType: "smithing",
    itemType: "equipment",
    inputs: [
      { itemIds: ["iron_bar"], amount: 4 },
    ],
    outputs: [
      { itemId: "iron_legs", amount: 1 },
    ],
    craftingTime: 225,
    levelRequired: 5,
    experienceGain: 40,
    tier: 2,
  },
  {
    id: "iron_boots_recipe",
    name: "Craft Iron Boots",
    workbenchType: "smithing",
    itemType: "equipment",
    inputs: [
      { itemIds: ["iron_bar"], amount: 2 },
    ],
    outputs: [
      { itemId: "iron_boots", amount: 1 },
    ],
    craftingTime: 175,
    levelRequired: 5,
    experienceGain: 25,
    tier: 2,
  },

  // Steel Armor Set Recipes
  {
    id: "steel_helmet_recipe",
    name: "Craft Steel Helmet",
    workbenchType: "smithing",
    itemType: "equipment",
    inputs: [
      { itemIds: ["steel_bar"], amount: 3 },
    ],
    outputs: [
      { itemId: "steel_helmet", amount: 1 },
    ],
    craftingTime: 250,
    levelRequired: 10,
    experienceGain: 45,
    tier: 3,
  },
  {
    id: "steel_chestplate_recipe",
    name: "Craft Steel Chestplate",
    workbenchType: "smithing",
    itemType: "equipment",
    inputs: [
      { itemIds: ["steel_bar"], amount: 5 },
    ],
    outputs: [
      { itemId: "steel_chestplate", amount: 1 },
    ],
    craftingTime: 300,
    levelRequired: 10,
    experienceGain: 75,
    tier: 3,
  },
  {
    id: "steel_legs_recipe",
    name: "Craft Steel Legs",
    workbenchType: "smithing",
    itemType: "equipment",
    inputs: [
      { itemIds: ["steel_bar"], amount: 4 },
    ],
    outputs: [
      { itemId: "steel_legs", amount: 1 },
    ],
    craftingTime: 275,
    levelRequired: 10,
    experienceGain: 60,
    tier: 3,
  },
  {
    id: "steel_boots_recipe",
    name: "Craft Steel Boots",
    workbenchType: "smithing",
    itemType: "equipment",
    inputs: [
      { itemIds: ["steel_bar"], amount: 2 },
    ],
    outputs: [
      { itemId: "steel_boots", amount: 1 },
    ],
    craftingTime: 225,
    levelRequired: 10,
    experienceGain: 37,
    tier: 3,
  },

  // Mithril Armor Set Recipes
  {
    id: "mithril_helmet_recipe",
    name: "Craft Mithril Helmet",
    workbenchType: "smithing",
    itemType: "equipment",
    inputs: [
      { itemIds: ["mithril_bar"], amount: 3 },
    ],
    outputs: [
      { itemId: "mithril_helmet", amount: 1 },
    ],
    craftingTime: 300,
    levelRequired: 15,
    experienceGain: 60,
    tier: 4,
  },
  {
    id: "mithril_chestplate_recipe",
    name: "Craft Mithril Chestplate",
    workbenchType: "smithing",
    itemType: "equipment",
    inputs: [
      { itemIds: ["mithril_bar"], amount: 5 },
    ],
    outputs: [
      { itemId: "mithril_chestplate", amount: 1 },
    ],
    craftingTime: 350,
    levelRequired: 15,
    experienceGain: 100,
    tier: 4,
  },
  {
    id: "mithril_legs_recipe",
    name: "Craft Mithril Legs",
    workbenchType: "smithing",
    itemType: "equipment",
    inputs: [
      { itemIds: ["mithril_bar"], amount: 4 },
    ],
    outputs: [
      { itemId: "mithril_legs", amount: 1 },
    ],
    craftingTime: 325,
    levelRequired: 15,
    experienceGain: 80,
    tier: 4,
  },
  {
    id: "mithril_boots_recipe",
    name: "Craft Mithril Boots",
    workbenchType: "smithing",
    itemType: "equipment",
    inputs: [
      { itemIds: ["mithril_bar"], amount: 2 },
    ],
    outputs: [
      { itemId: "mithril_boots", amount: 1 },
    ],
    craftingTime: 275,
    levelRequired: 15,
    experienceGain: 50,
    tier: 4,
  },

  // Adamantite Armor Set Recipes
  {
    id: "adamantite_helmet_recipe",
    name: "Craft Adamantite Helmet",
    workbenchType: "smithing",
    itemType: "equipment",
    inputs: [
      { itemIds: ["adamantite_bar"], amount: 3 },
    ],
    outputs: [
      { itemId: "adamantite_helmet", amount: 1 },
    ],
    craftingTime: 350,
    levelRequired: 20,
    experienceGain: 75,
    tier: 5,
  },
  {
    id: "adamantite_chestplate_recipe",
    name: "Craft Adamantite Chestplate",
    workbenchType: "smithing",
    itemType: "equipment",
    inputs: [
      { itemIds: ["adamantite_bar"], amount: 5 },
    ],
    outputs: [
      { itemId: "adamantite_chestplate", amount: 1 },
    ],
    craftingTime: 400,
    levelRequired: 20,
    experienceGain: 125,
    tier: 5,
  },
  {
    id: "adamantite_legs_recipe",
    name: "Craft Adamantite Legs",
    workbenchType: "smithing",
    itemType: "equipment",
    inputs: [
      { itemIds: ["adamantite_bar"], amount: 4 },
    ],
    outputs: [
      { itemId: "adamantite_legs", amount: 1 },
    ],
    craftingTime: 375,
    levelRequired: 20,
    experienceGain: 100,
    tier: 5,
  },
  {
    id: "adamantite_boots_recipe",
    name: "Craft Adamantite Boots",
    workbenchType: "smithing",
    itemType: "equipment",
    inputs: [
      { itemIds: ["adamantite_bar"], amount: 2 },
    ],
    outputs: [
      { itemId: "adamantite_boots", amount: 1 },
    ],
    craftingTime: 325,
    levelRequired: 20,
    experienceGain: 62,
    tier: 5,
  },

  // Runite Armor Set Recipes
  {
    id: "runite_helmet_recipe",
    name: "Craft Runite Helmet",
    workbenchType: "smithing",
    itemType: "equipment",
    inputs: [
      { itemIds: ["runite_bar"], amount: 3 },
    ],
    outputs: [
      { itemId: "runite_helmet", amount: 1 },
    ],
    craftingTime: 400,
    levelRequired: 25,
    experienceGain: 90,
    tier: 6,
  },
  {
    id: "runite_chestplate_recipe",
    name: "Craft Runite Chestplate",
    workbenchType: "smithing",
    itemType: "equipment",
    inputs: [
      { itemIds: ["runite_bar"], amount: 5 },
    ],
    outputs: [
      { itemId: "runite_chestplate", amount: 1 },
    ],
    craftingTime: 450,
    levelRequired: 25,
    experienceGain: 150,
    tier: 6,
  },
  {
    id: "runite_legs_recipe",
    name: "Craft Runite Legs",
    workbenchType: "smithing",
    itemType: "equipment",
    inputs: [
      { itemIds: ["runite_bar"], amount: 4 },
    ],
    outputs: [
      { itemId: "runite_legs", amount: 1 },
    ],
    craftingTime: 425,
    levelRequired: 25,
    experienceGain: 120,
    tier: 6,
  },
  {
    id: "runite_boots_recipe",
    name: "Craft Runite Boots",
    workbenchType: "smithing",
    itemType: "equipment",
    inputs: [
      { itemIds: ["runite_bar"], amount: 2 },
    ],
    outputs: [
      { itemId: "runite_boots", amount: 1 },
    ],
    craftingTime: 375,
    levelRequired: 25,
    experienceGain: 75,
    tier: 6,
  },
];
