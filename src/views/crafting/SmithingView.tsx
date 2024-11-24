import React, { useMemo } from "react";
import { smeltedItems } from "../../data/items/smelted.data";
import { Workbench } from "../../types/workbench.types";
import WorkbenchComponent from "../../components/game/Workbench";

const smithingWorkbench: Workbench = {
  id: "smithing_workbench",
  name: "Smithing Workbench",
  description: "A sturdy workbench for refining ores into bars.",
  workbenchType: "smithing",
  levelRequired: 1,
  isUnlocked: true,
};

const SmithingView: React.FC = () => {
  const recipes = useMemo(() => [
    { input: "copper_ore", output: smeltedItems.find((item) => item.id === "copper_bar")!, inputAmount: 2 },
    { input: "iron_ore", output: smeltedItems.find((item) => item.id === "iron_bar")!, inputAmount: 3 },
  ], []);

  return (
    <div className="p-6 bg-gray-900 text-white rounded shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Smithing</h1>
      <p className="mb-4">Welcome to the smithing area! Use a workbench to craft items and refine materials.</p>
      <WorkbenchComponent workbench={smithingWorkbench} skillId="smithing" recipes={recipes} />
    </div>
  );
};

export default SmithingView;
