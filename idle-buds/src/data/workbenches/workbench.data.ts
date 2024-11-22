import { Workbench } from "../../types/workbench.types";
export const workbenches: Workbench[] = [

  {
    id: "smelting_furnace",
    name: "Smelting Furnace",
    description: "A furnace used to smelt ores into refined bars.",
    workbenchType: "smelting",
    tier: 1,
    levelRequired: 1,
    isUnlocked: true,
    specialRequirements: ["Requires fuel (e.g., coal) to operate"],
  },
  {
    id: "smithing_anvil",
    name: "Smithing Anvil",
    description: "An anvil used for forging weapons, armor, and tools.",
    workbenchType: "smithing",
    tier: 2,
    levelRequired: 5,
    isUnlocked: false,
    specialRequirements: ["Requires a hammer to operate"],
  },
  {
    id: "cooking_station",
    name: "Cooking Station",
    description:
      "A workstation used for preparing and crafting cooking-related items.",
    workbenchType: "cooking",
    tier: 1,
    levelRequired: 3,
    isUnlocked: true,
  },
  {
    id: "crafting_table",
    name: "Crafting Table",
    description:
      "A general-purpose table used for crafting basic and advanced items.",
    workbenchType: "crafting",
    tier: 1,
    levelRequired: 1,
    isUnlocked: true,
  },
];