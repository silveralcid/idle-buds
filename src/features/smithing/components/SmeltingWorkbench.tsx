import React, { useMemo, useState } from 'react';
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
  const getBudCraftingStatus = useSmithingStore(state => state.getBudCraftingStatus);
  const getBud = useAssignmentStore((state) => state.getBud);

  const assignedBuds = getBudsByWorkbench('smelting_furnace');
  const hasBudAssigned = assignedBuds.length > 0;

  const availableBuds = useMemo(() => {
    return Object.values(partyBuds).filter(bud => 
      !assignedBuds.includes(bud.id) && 
      bud.allowedTasks.includes('smithing') &&
      bud.level >= 1
    );
  }, [partyBuds, assignedBuds]);

  const [selectedBudId, setSelectedBudId] = useState<string>("");

  const handleAssignBud = (budId: string, recipeId: string) => {
    if (!budId || !recipeId) return;
    
    const isActive = isBudCraftingActive(budId);
    
    if (isActive) {
      stopBudSmithing(budId);
      return;
    }
  
    // First start the crafting process
    startBudSmithing(budId, 'smelting_furnace', recipeId);
    
    // Then assign the bud
    assignBud(budId, "smithing", {
      taskType: "workbench",
      nodeID: 'smelting_furnace',
      recipeId: recipeId
    });
  };

  const handleUnassignBud = (budId: string) => {
    stopBudSmithing(budId);
    unassignBud(budId);
  };

  const handleCraft = (recipeId: string) => {
    if (!hasBudAssigned) {
      activateWorkbench('smelting_furnace', recipeId);
    }
  };

  const canCraftRecipe = (recipe: Recipe): boolean => {
    return recipe.inputs.every(input => {
      return input.itemIds.some(itemId => 
        (bankItems[itemId] || 0) >= input.amount
      );
    });
  };

  // Filter recipes for smelting workbench type
  const smeltingRecipes = useMemo(() => 
    recipes.filter(recipe => recipe.workbenchType === 'smelting'),
    [recipes]
  );

  return (
    <div className="p-4 bg-base-200 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Smelting Furnace</h2>
      
      {/* Bud Assignment Section */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Assigned Buds</h3>
        {assignedBuds.length > 0 ? (
          <div className="space-y-2">
            {assignedBuds.map(budId => {
              const bud = getBud(budId);
              const isActive = isBudCraftingActive(budId);
              return (
                <div key={budId} className="flex items-center justify-between bg-base-300 p-2 rounded">
                  <span>{bud?.nickname || bud?.name}</span>
                  <button
                    onClick={() => handleUnassignBud(budId)}
                    className="btn btn-ghost btn-xs text-error"
                    disabled={isActive}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            <select 
              className="select select-bordered w-full max-w-xs mb-2"
              onChange={(e) => setSelectedBudId(e.target.value)}
              value={selectedBudId}
            >
              <option value="">Assign Bud...</option>
              {availableBuds.map(bud => (
                <option key={bud.id} value={bud.id}>
                  {bud.nickname || bud.name} (Level {bud.level})
                </option>
              ))}
            </select>
            
            {selectedBudId && (
              <select
                className="select select-bordered w-full max-w-xs mb-2"
                onChange={(e) => {
                  handleAssignBud(selectedBudId, e.target.value);
                  setSelectedBudId("");
                }}
                value=""
              >
                <option value="">Select Recipe...</option>
                {smeltingRecipes.map(recipe => (
                  <option 
                    key={recipe.id} 
                    value={recipe.id}
                    disabled={!isRecipeUnlocked(recipe.id) || !canCraftRecipe(recipe)}
                  >
                    {recipe.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      {/* Active Workbench Progress */}
      {workbench.isActive && workbench.recipe && (
        <div className="mb-4 p-4 bg-base-300 rounded">
          <h3 className="font-semibold">Currently Smelting:</h3>
          <p>{workbench.recipe.name}</p>
          <div className="w-full bg-gray-600 h-2 mt-2 rounded">
            <div 
              className="bg-blue-500 h-full rounded"
              style={{ width: `${(workbench.progress / workbench.recipe.craftingTime) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Bud Crafting Progress */}
      {assignedBuds.map(budId => {
        const bud = getBud(budId);
        const isActive = isBudCraftingActive(budId);
        const craftingStatus = getBudCraftingStatus(budId);
        const recipe = recipes.find(r => r.id === craftingStatus?.recipeId);

        if (!bud) return null;

        return (
          <div key={budId} className="mb-4 p-4 bg-base-300 rounded">
            <div className="flex items-center justify-between">
              <span>{bud.nickname || bud.name}</span>
              <button
                onClick={() => handleUnassignBud(budId)}
                className="btn btn-ghost btn-xs text-error"
                disabled={isActive}
              >
                Remove
              </button>
            </div>
            {isActive && recipe && (
              <div className="mt-2">
                <p className="text-sm">Crafting: {recipe.name}</p>
                <div className="w-full bg-gray-600 h-2 mt-2 rounded">
                  <div 
                    className="bg-green-500 h-full rounded transition-all duration-200"
                    style={{ width: `${((craftingStatus?.progress ?? 0) / recipe.craftingTime) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Recipe List */}
      <div className="grid grid-cols-1 gap-4">
        {smeltingRecipes.map((recipe) => {
          const isUnlocked = isRecipeUnlocked(recipe.id);
          const hasResources = canCraftRecipe(recipe);
          const isDisabled = !isUnlocked || (!hasResources && !workbench.isActive);
          const budAssignedToRecipe = assignedBuds.length > 0;
          const isActive = workbench.isActive && workbench.recipe?.id === recipe.id;
          
          return (
            <div key={recipe.id} className={`p-4 rounded ${isUnlocked ? 'bg-base-100' : 'bg-base-300 opacity-50'}`}>
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

              <div className="flex gap-2 mt-4">
                {budAssignedToRecipe && (
                  <button
                    className={`px-4 py-2 rounded ${
                      isDisabled 
                        ? 'bg-gray-500 cursor-not-allowed' 
                        : isActive 
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-orange-500 hover:bg-orange-600'
                    }`}
                    onClick={() => handleAssignBud(assignedBuds[0], recipe.id)}
                    disabled={isDisabled}
                  >
                    {!isUnlocked 
                      ? `Requires Level ${recipe.levelRequired}`
                      : !hasResources
                        ? 'Missing Resources'
                        : isActive
                          ? 'Stop Crafting'
                          : 'Start Crafting'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SmeltingWorkbench;
