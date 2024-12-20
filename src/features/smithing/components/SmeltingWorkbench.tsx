import React, { useMemo } from 'react';
import { useSmithingStore } from '../smithing.store';
import { useBankStore } from '../../bank/bank.store';
import { usePartyStore } from '../../party/party.store';
import { useAssignmentStore } from '../../assignment/assignment.store';
import { Recipe } from '../../../types/recipe.types';
import { startBudSmithing, stopBudSmithing } from '../smithing.logic';

const SmeltingWorkbench: React.FC = () => {
  const workbench = useSmithingStore((state) => state.workbenches.smelting_furnace);
  const recipes = useSmithingStore((state) => state.recipes);
  const bankItems = useBankStore((state) => state.items);
  const isRecipeUnlocked = useSmithingStore((state) => state.isRecipeUnlocked);
  const activateWorkbench = useSmithingStore((state) => state.activateWorkbench);
  const partyBuds = usePartyStore((state) => state.buds);
  const assignBud = useAssignmentStore((state) => state.assignBud);
  const unassignBud = useAssignmentStore((state) => state.unassignBud);
  const getBudsByWorkbench = useAssignmentStore((state) => state.getBudsByWorkbench);
  const isBudCraftingActive = useSmithingStore((state) => state.isBudCraftingActive);

  const assignedBuds = getBudsByWorkbench('smelting_furnace');
  const availableBuds = useMemo(() => {
    return Object.values(partyBuds).filter(bud => 
      !assignedBuds.includes(bud.id) && 
      bud.allowedTasks.includes('smithing') &&
      bud.level >= 1 // You can adjust minimum level requirement
    );
  }, [partyBuds, assignedBuds]);

  // Filter recipes for smelting workbench type
  const smeltingRecipes = recipes.filter(recipe => recipe.workbenchType === 'smelting');

  const canCraftRecipe = (recipe: Recipe): boolean => {
    return recipe.inputs.every(input => {
      return input.itemIds.some(itemId => 
        (bankItems[itemId] || 0) >= input.amount
      );
    });
  };

  const handleCraft = (recipeId: string) => {
    activateWorkbench('smelting_furnace', recipeId);
  };

  const handleAssignBud = (budId: string) => {
    if (budId) {
      assignBud(budId, "smithing", {
        taskType: "workbench",
        nodeID: 'smelting_furnace'
      });
    }
  };

  const handleUnassignBud = (budId: string) => {
    stopBudSmithing(budId);
    unassignBud(budId);
  };

  return (
    <div className="p-4 bg-base-200 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Smelting Furnace</h2>
      
      {/* Active Recipe Display */}
      {workbench.isActive && workbench.recipe && (
        <div className="mb-4 p-4 bg-base-300 rounded">
          <h3 className="font-semibold">Currently Smelting:</h3>
          <p>{workbench.recipe.name}</p>
          <div className="w-full bg-gray-600 h-2 mt-2 rounded">
            <div 
              className="bg-orange-500 h-full rounded"
              style={{ width: `${(workbench.progress / workbench.recipe.craftingTime) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Bud Assignment Section */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Assigned Buds</h3>
        {assignedBuds.length > 0 ? (
          <div className="space-y-2">
            {assignedBuds.map(budId => {
              const bud = partyBuds[budId];
              return (
                <div key={budId} className="flex items-center justify-between bg-base-300 p-2 rounded">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">
                      {bud?.nickname || bud?.name || budId}
                    </span>
                    <span className="text-xs opacity-75">
                      (Lvl {bud?.level})
                    </span>
                  </div>
                  <button
                    onClick={() => handleUnassignBud(budId)}
                    className="btn btn-ghost btn-xs text-error"
                    title="Unassign Bud"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <select 
            className="select select-bordered w-full max-w-xs mb-2"
            onChange={(e) => handleAssignBud(e.target.value)}
            value=""
          >
            <option value="">Assign Bud...</option>
            {availableBuds.map(bud => (
              <option key={bud.id} value={bud.id}>
                {bud.nickname || bud.name} (Level {bud.level})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Recipe List */}
      <div className="grid grid-cols-1 gap-4">
        {smeltingRecipes.map((recipe) => {
          const isUnlocked = isRecipeUnlocked(recipe.id);
          const hasResources = canCraftRecipe(recipe);
          
          return (
            <div 
              key={recipe.id}
              className={`p-4 rounded ${
                isUnlocked ? 'bg-base-100' : 'bg-base-300 opacity-50'
              }`}
            >
              <h3 className="font-semibold">{recipe.name}</h3>
              
              {/* Requirements */}
              <div className="mt-2 text-sm">
                <h4>Requires:</h4>
                {recipe.inputs.map((input, index) => (
                  <div key={index} className={
                    input.itemIds.some(id => (bankItems[id] || 0) >= input.amount)
                      ? 'text-green-500'
                      : 'text-red-500'
                  }>
                    {input.amount}x {input.itemIds[0]}
                  </div>
                ))}
              </div>

              {/* Output */}
              <div className="mt-2 text-sm">
                <h4>Creates:</h4>
                {recipe.outputs.map((output, index) => (
                  <div key={index}>
                    {output.amount}x {output.itemId}
                  </div>
                ))}
              </div>

              <button
                className={`mt-4 px-4 py-2 rounded ${
                  isUnlocked && (hasResources || workbench.isActive)
                    ? 'bg-orange-500 hover:bg-orange-600'
                    : 'bg-gray-500 cursor-not-allowed'
                }`}
                onClick={() => handleCraft(recipe.id)}
                disabled={!isUnlocked || (!hasResources && !workbench.isActive)}
              >
                {!isUnlocked 
                  ? `Requires Level ${recipe.levelRequired}`
                  : !hasResources && !workbench.isActive
                  ? 'Missing Resources'
                  : workbench.isActive && workbench.recipe?.id === recipe.id
                  ? 'Stop'
                  : 'Start'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SmeltingWorkbench;
