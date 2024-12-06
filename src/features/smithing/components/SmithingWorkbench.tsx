import React from "react";
import { useSmithingStore } from "../smithing.store";
import { getRecipesByWorkbench } from "../../../data/recipe-registry";
import { useBankStore } from "../../bank/bank.store";
import { Recipe } from "../../../types/recipe.types";
import { WorkbenchType } from "../../../enums/workbenchType.enum";

interface SmithingWorkbenchProps {
  workbenchId: string;
}

const SmithingWorkbench: React.FC<SmithingWorkbenchProps> = ({ workbenchId }) => {
  const workbench = useSmithingStore((state) => state.workbenches[workbenchId]);
  const level = useSmithingStore((state) => state.level);
  const bankItems = useBankStore((state) => state.items);

  if (!workbench) {
    return (
      <div className="p-4 bg-red-500 text-white rounded">
        <p>Workbench not found.</p>
      </div>
    );
  }

  const recipes = getRecipesByWorkbench(workbench.type as WorkbenchType);

  const canCraftRecipe = (recipe: Recipe) => {
    if (level < recipe.levelRequired) return false;

    return recipe.inputs.every(input => {
      return input.itemIds.some(itemId => 
        (bankItems[itemId] || 0) >= input.amount
      );
    });
  };

  const handleActivateRecipe = (recipeId: string) => {
    useSmithingStore.getState().activateWorkbench(workbenchId, recipeId);
  };

  const progress = workbench.recipe 
    ? (workbench.progress / workbench.recipe.craftingTime) * 100 
    : 0;

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">{workbench.type.charAt(0).toUpperCase() + workbench.type.slice(1)}</h3>
      
      {/* Active Recipe Display */}
      {workbench.recipe && workbench.isActive && (
        <div className="mb-4 p-4 bg-blue-100 rounded">
          <h4 className="font-semibold">Currently Crafting: {workbench.recipe.name}</h4>
          <div className="w-full bg-gray-200 rounded h-2 mt-2">
            <div 
              className="bg-blue-500 h-2 rounded" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Recipe List */}
      <div className="grid gap-4">
        {recipes.map((recipe) => (
          <div 
            key={recipe.id}
            className={`p-3 border rounded ${
              canCraftRecipe(recipe) ? 'bg-white' : 'bg-gray-200'
            }`}
          >
            <h4 className="font-semibold">{recipe.name}</h4>
            <p className="text-sm">Level Required: {recipe.levelRequired}</p>
            
            {/* Inputs */}
            <div className="mt-2">
              <p className="text-sm font-medium">Required:</p>
              {recipe.inputs.map((input, index) => (
                <p 
                  key={index}
                  className={`text-sm ${
                    input.itemIds.some(id => (bankItems[id] || 0) >= input.amount)
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {input.amount}x {input.itemIds[0].replace('_', ' ')}
                </p>
              ))}
            </div>

            {/* Outputs */}
            <div className="mt-2">
              <p className="text-sm font-medium">Produces:</p>
              {recipe.outputs.map((output, index) => (
                <p key={index} className="text-sm">
                  {output.amount}x {output.itemId.replace('_', ' ')}
                </p>
              ))}
            </div>

            <button
              className={`mt-3 px-4 py-2 rounded w-full ${
                canCraftRecipe(recipe)
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={() => handleActivateRecipe(recipe.id)}
              disabled={!canCraftRecipe(recipe) || workbench.isActive}
            >
              {workbench.isActive ? 'Busy' : 'Craft'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmithingWorkbench;
