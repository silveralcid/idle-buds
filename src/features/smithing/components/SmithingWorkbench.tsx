import React from "react";
import { useSmithingStore } from "../smithing.store";
import { Recipe } from "../../../types/recipe.types";

interface SmithingWorkbenchProps {
  workbenchId: string;
}

const SmithingWorkbench: React.FC<SmithingWorkbenchProps> = ({
  workbenchId,
}) => {
  const workbench = useSmithingStore((state) => state.workbenches[workbenchId]);
  const recipes = useSmithingStore((state) => state.recipes);
  const activateWorkbench = useSmithingStore((state) => state.activateWorkbench);
  const updateWorkbenchProgress = useSmithingStore(
    (state) => state.updateWorkbenchProgress
  );

  if (!workbench) {
    return (
      <div className="p-4 bg-red-500 text-white rounded">
        <p>Workbench not found.</p>
      </div>
    );
  }

  const handleStartCrafting = (recipeId: string) => {
    activateWorkbench(workbenchId, recipeId);
  };

  const handleStopCrafting = () => {
    updateWorkbenchProgress(workbenchId, -1); // Reset progress or deactivate
  };

  const isLocked = !workbench.isActive;

  return (
    <div
      className={`p-4 rounded shadow-md ${
        isLocked ? "bg-gray-300 text-gray-500" : "bg-gray-100"
      }`}
    >
      <h3 className="text-lg font-bold mb-2">{workbench.id}</h3>
      <p>
        Progress: {workbench.progress.toFixed(2)}% /{" "}
        {workbench.recipe?.craftingTime || "N/A"}
      </p>
      <p>
        Active Recipe: {workbench.recipe?.name || "No recipe selected"}
      </p>

      {isLocked ? (
        <p className="italic text-sm mt-4">Workbench is inactive.</p>
      ) : workbench.isActive ? (
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
          onClick={handleStopCrafting}
        >
          Stop Crafting
        </button>
      ) : (
        <div>
          <h4 className="text-sm font-semibold mt-4">Available Recipes:</h4>
          <ul className="mt-2">
            {recipes.map((recipe: Recipe) => (
              <li key={recipe.id} className="flex justify-between items-center">
                <span>{recipe.name}</span>
                <button
                  className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
                  onClick={() => handleStartCrafting(recipe.id)}
                >
                  Craft
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SmithingWorkbench;
