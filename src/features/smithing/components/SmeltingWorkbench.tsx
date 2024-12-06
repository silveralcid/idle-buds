import React, { useState } from "react";
import { useSmithingStore } from "../smithing.store";
import { useBankStore } from "../../bank/bank.store";
import { Recipe } from "../../../types/recipe.types";
import { getRecipesByWorkbench } from "../../../data/recipe-registry";

const SmeltingWorkbench: React.FC = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const workbench = useSmithingStore((state) => state.workbenches.smelting_furnace);
  const isRecipeUnlocked = useSmithingStore((state) => state.isRecipeUnlocked);
  const bankItems = useBankStore((state) => state.items);
  const activateWorkbench = useSmithingStore((state) => state.activateWorkbench);

  const smeltingRecipes = getRecipesByWorkbench("smelting");

  const canCraftRecipe = (recipe: Recipe): boolean => {
    if (!isRecipeUnlocked(recipe.id)) return false;
    return recipe.inputs.every((input) =>
      input.itemIds.some((itemId) => (bankItems[itemId] || 0) >= input.amount)
    );
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleCraft = () => {
    if (selectedRecipe && canCraftRecipe(selectedRecipe)) {
      activateWorkbench("smelting_furnace", selectedRecipe.id);
    }
  };

  return (
    <div className="p-4 bg-base-200 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Smelting Furnace</h2>

      {/* Recipe Menu */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {smeltingRecipes.map((recipe) => {
          const isCraftable = canCraftRecipe(recipe);
          const isUnlocked = isRecipeUnlocked(recipe.id);
          return (
            <div
              key={recipe.id}
              className={`p-4 border rounded-lg cursor-pointer ${
                isUnlocked
                  ? isCraftable
                    ? "bg-base-100 hover:bg-base-200"
                    : "bg-base-300"
                  : "bg-base-300 opacity-50"
              }`}
              onClick={() => handleSelectRecipe(recipe)}
            >
              <h3 className="font-semibold mb-2">{recipe.name}</h3>
              <p className="text-sm">Level Required: {recipe.levelRequired}</p>
              <p className="text-sm">Experience: {recipe.experienceGain}</p>
            </div>
          );
        })}
      </div>

      {/* Recipe Details */}
      {selectedRecipe && (
        <div className="p-4 border rounded-lg bg-base-100">
          <h3 className="font-semibold mb-4">Selected Recipe: {selectedRecipe.name}</h3>
          <p className="mb-2">Level Required: {selectedRecipe.levelRequired}</p>
          <p className="mb-2">Experience: {selectedRecipe.experienceGain}</p>

          <div className="mb-2">
            <p className="font-semibold">Requires:</p>
            {selectedRecipe.inputs.map((input, idx) => (
              <p key={idx} className="text-sm">
                {input.amount}x {input.itemIds.join(" / ").replace(/_/g, " ")}
              </p>
            ))}
          </div>

          <div className="mb-4">
            <p className="font-semibold">Produces:</p>
            {selectedRecipe.outputs.map((output, idx) => (
              <p key={idx} className="text-sm">
                {output.amount}x {output.itemId.replace(/_/g, " ")}
              </p>
            ))}
          </div>

          {/* Craft Button and Progress Bar */}
          <button
            className={`px-4 py-2 rounded w-full ${
                workbench.isActive
                ? "bg-gray-500 cursor-not-allowed"
                : selectedRecipe && canCraftRecipe(selectedRecipe)
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-gray-500 cursor-not-allowed"
            }`}
            onClick={handleCraft}
            disabled={!selectedRecipe || !canCraftRecipe(selectedRecipe) || workbench.isActive}
          >
            {workbench.isActive ? "Busy" : "Craft"}
          </button>

          {workbench.isActive && workbench.recipe && (
            <div className="w-full bg-gray-600 h-2 rounded mt-4">
              <div
                className="bg-orange-500 h-full rounded transition-all duration-200"
                style={{
                  width: `${(workbench.progress / workbench.recipe.craftingTime) * 100}%`,
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmeltingWorkbench;
