import React from "react";
import { useHunterStore } from "../../stores/hunter.store";
import { useBankStore } from "../../stores/bank.store";
import { Workbench } from "../../types/workbench.types";
import { Recipe } from "../../types/recipe.types";

interface WorkbenchProps {
  workbench: Workbench;
  skillId: string;
  recipes: Recipe[];
}

const WorkbenchComponent: React.FC<WorkbenchProps> = ({ workbench, skillId, recipes }) => {
  const startTask = useHunterStore((state) => state.startTask);
  const stopTask = useHunterStore((state) => state.stopTask);
  const currentTask = useHunterStore((state) => state.currentTask);
  const progress = useHunterStore((state) => state.progress);
  const hunterSkills = useHunterStore((state) => state.hunterSkills);
  const bankItems = useBankStore((state) => state.items);

  const skill = hunterSkills[skillId];
  const canCraft = skill && skill.level >= workbench.levelRequired;

  const handleCraftClick = (recipe: Recipe) => {
    if (!canCraft) {
      alert(`You need at least level ${workbench.levelRequired} in ${skill?.name || "this skill"} to craft here.`);
      return;
    }

    if (currentTask?.taskId === recipe.id) {
      stopTask();
      return;
    }

    // Check if sufficient materials are available in the bank
    const hasMaterials = recipe.inputs.every((input) =>
      input.itemIds.some((id) => (bankItems[id] || 0) >= input.amount)
    );

    if (!hasMaterials) {
      alert("Insufficient materials to craft this item.");
      return;
    }

    startTask({
      taskId: recipe.id,
      type: "crafting",
      skillId,
    });
  };

  return (
    <div className="p-4 bg-gray-800 text-white rounded shadow-md">
      <h3 className="text-lg font-bold">{workbench.name}</h3>
      <p>{workbench.description}</p>
      <p>Required Level: {workbench.levelRequired}</p>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id} className="mb-4">
            <div>
              {recipe.inputs.map((input) => (
                <span key={input.itemIds[0]}>
                  {input.amount}x {input.itemIds.join(" / ")}{" "}
                </span>
              ))}
              →{" "}
              {recipe.outputs.map((output) => (
                <span key={output.itemId}>
                  {output.amount}x {output.itemId}{" "}
                </span>
              ))}
            </div>
            <div className="mt-2">
              {currentTask?.taskId === recipe.id && (
                <div className="w-full bg-gray-600 rounded h-4">
                  <div
                    className="bg-blue-500 h-4 rounded"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
            <button
              onClick={() => handleCraftClick(recipe)}
              className={`mt-1 px-4 py-2 rounded ${
                canCraft ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-500 cursor-not-allowed"
              }`}
              disabled={!canCraft}
            >
              {currentTask?.taskId === recipe.id ? "Stop Crafting" : "Craft"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkbenchComponent;
