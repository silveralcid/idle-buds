import React from "react";
import { useHunterStore } from "../../stores/hunter.store";
import { useBankStore } from "../../stores/bank.store";
import { Workbench } from "../../types/workbench.types";
import { BaseItem } from "../../types/itemBase.types";

interface WorkbenchProps {
  workbench: Workbench;
  skillId: string;
  recipes: { input: string; output: BaseItem; inputAmount: number }[];
}

const WorkbenchComponent: React.FC<WorkbenchProps> = ({ workbench, skillId, recipes }) => {
  const startTask = useHunterStore((state) => state.startTask);
  const stopTask = useHunterStore((state) => state.stopTask);
  const currentTask = useHunterStore((state) => state.currentTask);
  const hunterSkills = useHunterStore((state) => state.hunterSkills);
  const bankItems = useBankStore((state) => state.items);

  const skill = hunterSkills[skillId];
  const canCraft = skill && skill.level >= workbench.levelRequired;

  const handleCraftClick = (recipe: { input: string; output: BaseItem; inputAmount: number }) => {
    if (!canCraft) {
      alert(`You need at least level ${workbench.levelRequired} in ${skill?.name || "this skill"} to craft here.`);
      return;
    }

    const availableAmount = bankItems[recipe.input] || 0;
    if (availableAmount < recipe.inputAmount) {
      alert(`You need at least ${recipe.inputAmount} ${recipe.input} to craft ${recipe.output.name}.`);
      return;
    }

    if (currentTask?.taskId === workbench.id) {
      stopTask(); // Toggle off crafting
      return;
    }

    startTask({
      taskId: workbench.id,
      type: "crafting",
      skillId,
    });
  };

  return (
    <div className="p-4 bg-gray-800 text-white rounded shadow-md">
      <h3 className="text-lg font-bold">{workbench.name}</h3>
      <p>{workbench.description}</p>
      <p>Required Level: {workbench.levelRequired}</p>
      {workbench.tier && <p>Tier: {workbench.tier}</p>}

      <div className="mt-4">
        <h4 className="text-md font-semibold">Recipes</h4>
        <ul className="mt-2">
          {recipes.map((recipe, index) => (
            <li key={index} className="mb-2">
              <p>
                {recipe.inputAmount}x {recipe.input} → {recipe.output.name}
              </p>
              <button
                onClick={() => handleCraftClick(recipe)}
                className={`mt-1 px-4 py-2 rounded ${
                  canCraft ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-500 cursor-not-allowed"
                }`}
                disabled={!canCraft}
              >
                {currentTask?.taskId === workbench.id ? "Stop Crafting" : "Craft"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WorkbenchComponent;
