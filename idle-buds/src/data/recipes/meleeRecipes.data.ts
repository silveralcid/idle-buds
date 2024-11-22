import { Recipe } from "../../types/recipe.types";


export const meleeRecipes: Recipe[] = [
  {
    id: "bronze_dagger_recipe",
    name: "Craft Bronze Dagger",
    workbenchType: "smithing",
    itemType: "equipment",
    inputs: [
      { itemIds: ["bronze_bar"], amount: 2 },
      { itemIds: ["oak_logs"], amount: 1 },
    ],
    outputs: [
      { itemId: "bronze_dagger", amount: 1 },
    ],
    craftingTime: 100,
    levelRequired: 1,
    experienceGain: 10,
    tier: 1,
  },
  {
    id: "iron_dagger_recipe",
    name: "Craft Iron Dagger",
    workbenchType: 'smithing',
    itemType: 'equipment',
    inputs: [
      { itemIds: ["iron_bar"], amount: 2 },
      { itemIds: ["oak_logs"], amount: 1 },
    ],
    outputs: [
      { itemId: "iron_dagger", amount: 1 },
    ],
    craftingTime: 150,
    levelRequired: 5,
    experienceGain: 15,
    tier: 2,
  },
  {
    id: "steel_dagger_recipe",
    name: "Craft Steel Dagger",
    workbenchType: 'smithing',
    itemType: 'equipment',
    inputs: [
      { itemIds: ["steel_bar"], amount: 2 },
      { itemIds: ["oak_logs"], amount: 1 },
    ],
    outputs: [
      { itemId: "steel_dagger", amount: 1 },
    ],
    craftingTime: 200,
    levelRequired: 10,
    experienceGain: 20,
    tier: 3,
  },
  {
    id: "mithril_dagger_recipe",
    name: "Craft Mithril Dagger",
    workbenchType: 'smithing',
    itemType: 'equipment',
    inputs: [
      { itemIds: ["mithril_bar"], amount: 2 },
      { itemIds: ["oak_logs"], amount: 1 },
    ],
    outputs: [
      { itemId: "mithril_dagger", amount: 1 },
    ],
    craftingTime: 250,
    levelRequired: 15,
    experienceGain: 25,
    tier: 4,
  },
  {
    id: "adamantite_dagger_recipe",
    name: "Craft Adamantite Dagger",
    workbenchType: 'smithing',
    itemType: 'equipment',
    inputs: [
      { itemIds: ["adamantite_bar"], amount: 2 },
      { itemIds: ["oak_logs"], amount: 1 },
    ],
    outputs: [
      { itemId: "adamantite_dagger", amount: 1 },
    ],
    craftingTime: 300,
    levelRequired: 20,
    experienceGain: 30,
    tier: 5,
  },
  {
    id: "runite_dagger_recipe",
    name: "Craft Runite Dagger",
    workbenchType: 'smithing',
    itemType: 'equipment',
    inputs: [
      { itemIds: ["runite_bar"], amount: 2 },
      { itemIds: ["oak_logs"], amount: 1 },
    ],
    outputs: [{ itemId: "runite_dagger", amount: 1 }],
    craftingTime: 350,
    levelRequired: 25,
    experienceGain: 35,
    tier: 6,
  },
];
