import React, { useMemo } from "react";
import { smeltedRecipes } from "../../data/recipes/smeltedRecipes.data";
import { meleeRecipes } from "../../data/recipes/meleeRecipes.data";
import { Workbench } from "../../types/workbench.types";
import WorkbenchComponent from "../../components/game/WorkbenchComponent";

// Define Workbenches
const smithingWorkbench: Workbench = {
  id: "smithing_workbench",
  name: "Smithing Workbench",
  description: "A sturdy workbench for crafting weapons and armor.",
  workbenchType: "smithing",
  levelRequired: 1,
  isUnlocked: true,
};

const smelterWorkbench: Workbench = {
  id: "smelter_furnace",
  name: "Smelter Furnace",
  description: "A furnace for smelting ores into metal bars.",
  workbenchType: "smelting",
  levelRequired: 1,
  isUnlocked: true,
};

const SmithingView: React.FC = () => {
  const smithingRecipes = useMemo(() => meleeRecipes, []);
  const smeltingRecipes = useMemo(() => smeltedRecipes, []);

  return (
    <div className="p-6 bg-gray-900 text-white rounded shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Smithing</h1>
      <p className="mb-4">Welcome to the smithing area! Use workbenches to craft items and smelt ores.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Smelter Furnace */}
        <WorkbenchComponent
          workbench={smelterWorkbench}
          skillId="smithing"
          recipes={smeltingRecipes}
        />
        {/* Smithing Workbench */}
        <WorkbenchComponent
          workbench={smithingWorkbench}
          skillId="smithing"
          recipes={smithingRecipes}
        />
      </div>
    </div>
  );
};

export default SmithingView;
