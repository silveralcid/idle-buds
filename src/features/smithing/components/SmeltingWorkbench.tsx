import React, { useMemo, useState, useEffect } from 'react';
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
  const [forceUpdate, setForceUpdate] = useState(0);

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

  useEffect(() => {
    const interval = setInterval(() => {
      // Force component update by subscribing to state changes
      assignedBuds.forEach(budId => {
        const status = getBudCraftingStatus(budId);
        if (status) {
          // This will trigger a re-render when progress changes
          setForceUpdate(prev => prev + 1);
        }
      });
    }, 50); // Increase update frequency

    return () => clearInterval(interval);
  }, [assignedBuds, getBudCraftingStatus]);

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
              const craftingStatus = getBudCraftingStatus(budId);
              const recipe = recipes.find(r => r.id === craftingStatus?.recipeId);
              const isActive = isBudCraftingActive(budId);

              return (
                <div key={budId} className="bg-base-300 p-4 rounded">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm">{budId.slice(0, 8)}...</span>
                    <button
                      onClick={() => handleUnassignBud(budId)}
                      className="btn btn-ghost btn-xs text-error"
                      disabled={isActive}
                    >
                      Remove
                    </button>
                  </div>
                  {isActive && recipe && craftingStatus && (
                    <div className="mt-2">
                      <p className="text-sm">Crafting: {recipe.name}</p>
                      <div className="w-full bg-gray-600 h-2 mt-2 rounded overflow-hidden">
                        <div 
                          className="bg-green-500 h-full rounded transition-all duration-100 ease-linear"
                          style={{ 
                            width: `${(craftingStatus.progress / recipe.craftingTime) * 100}%`,
                            transition: 'width 100ms linear'
                          }}
                        />
                      </div>
                    </div>
                  )}
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
                  {bud.id.slice(0, 8)}... (Level {bud.level})
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

      {/* Recipe List */}
      <div className="grid grid-cols-1 gap-4">
        {smeltingRecipes.map((recipe) => {
          const isUnlocked = isRecipeUnlocked(recipe.id);
          const hasResources = canCraftRecipe(recipe);
          const isDisabled = !isUnlocked || (!hasResources && !workbench.isActive);
          const budAssignedToRecipe = assignedBuds.length > 0;
          
          // Check if any assigned bud is actively crafting this recipe
          const isActiveCrafting = assignedBuds.some(budId => {
            const craftingStatus = getBudCraftingStatus(budId);
            return craftingStatus?.recipeId === recipe.id;
          });

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
                        : isActiveCrafting
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                    onClick={() => {
                      const bud = assignedBuds[0];
                      if (isActiveCrafting) {
                        stopBudSmithing(bud);
                      } else {
                        handleAssignBud(bud, recipe.id);
                      }
                    }}
                    disabled={isDisabled}
                  >
                    {!isUnlocked 
                      ? `Requires Level ${recipe.levelRequired}`
                      : !hasResources
                        ? 'Missing Resources'
                        : isActiveCrafting
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
