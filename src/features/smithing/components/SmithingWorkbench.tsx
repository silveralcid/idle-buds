import React, { useMemo, useState, useEffect } from 'react';
import { useSmithingStore } from '../smithing.store';
import { useBankStore } from '../../bank/bank.store';
import { usePartyStore } from '../../party/party.store';
import { useAssignmentStore } from '../../assignment/assignment.store';
import { Recipe } from '../../../types/recipe.types';
import { startBudSmithing, stopBudSmithing } from '../smithing.logic';

const SmithingWorkbench: React.FC = () => {
  const workbench = useSmithingStore((state) => state.workbenches.smithing_anvil);
  const recipes = useSmithingStore((state) => state.recipes);
  const bankItems = useBankStore((state) => state.items);
  const isRecipeUnlocked = useSmithingStore((state) => state.isRecipeUnlocked);
  const partyBuds = usePartyStore((state) => state.buds);
  const assignBud = useAssignmentStore((state) => state.assignBud);
  const unassignBud = useAssignmentStore((state) => state.unassignBud);
  const updateBudRecipe = useAssignmentStore((state) => state.updateBudRecipe);
  const getBudsByWorkbench = useAssignmentStore((state) => state.getBudsByWorkbench);
  const isBudCraftingActive = useSmithingStore((state) => state.isBudCraftingActive);
  const getBudCraftingStatus = useSmithingStore(state => state.getBudCraftingStatus);
  const getBud = useAssignmentStore((state) => state.getBud);

  const [selectedBudId, setSelectedBudId] = useState<string>("");
  const [forceUpdate, setForceUpdate] = useState(0);

  const assignedBuds = getBudsByWorkbench('smithing_anvil');
  const hasBudAssigned = assignedBuds.length > 0;

  const availableBuds = useMemo(() => {
    return Object.values(partyBuds).filter(bud => 
      !assignedBuds.includes(bud.id) && 
      bud.allowedTasks.includes('smithing') &&
      bud.level >= 1
    );
  }, [partyBuds, assignedBuds]);

  const handleAssignBud = (budId: string) => {
    if (!budId) return;
    
    assignBud(budId, "smithing", {
      taskType: "workbench",
      nodeID: 'smithing_anvil'
    });
    setSelectedBudId("");
  };

  const handleStartCrafting = (budId: string, recipeId: string) => {
    const isActive = isBudCraftingActive(budId);
    
    if (isActive) {
      stopBudSmithing(budId);
      setForceUpdate(prev => prev + 1);
    } else {
      updateBudRecipe(budId, recipeId);
      startBudSmithing(budId, 'smithing_anvil', recipeId);
    }
  };

  const handleUnassignBud = (budId: string) => {
    stopBudSmithing(budId);
    unassignBud(budId);
  };

  const canCraftRecipe = (recipe: Recipe): boolean => {
    return recipe.inputs.every(input => {
      return input.itemIds.some(itemId => 
        (bankItems[itemId] || 0) >= input.amount
      );
    });
  };

  // Filter recipes for smithing workbench type
  const smithingRecipes = useMemo(() => 
    recipes.filter(recipe => recipe.workbenchType === 'smithing'),
    [recipes]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      assignedBuds.forEach(budId => {
        const status = getBudCraftingStatus(budId);
        if (status) {
          setForceUpdate(prev => prev + 1);
        }
      });
    }, 50);

    return () => clearInterval(interval);
  }, [assignedBuds, getBudCraftingStatus]);

  // Add player crafting controls
  const activateWorkbench = useSmithingStore((state) => state.activateWorkbench);
  
  const handlePlayerCraft = (recipeId: string) => {
    activateWorkbench('smithing_anvil', recipeId);
  };

  return (
    <div className="p-4 bg-base-200 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Smithing Anvil</h2>
      
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
          <select 
            className="select select-bordered w-full max-w-xs mb-2"
            onChange={(e) => handleAssignBud(e.target.value)}
            value={selectedBudId}
          >
            <option value="">Assign Bud...</option>
            {availableBuds.map(bud => (
              <option key={bud.id} value={bud.id}>
                {bud.id.slice(0, 8)}... (Level {bud.level})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Recipe List */}
      <div className="grid grid-cols-1 gap-4">
        {smithingRecipes.map((recipe) => {
          const isUnlocked = isRecipeUnlocked(recipe.id);
          const hasResources = canCraftRecipe(recipe);
          const isDisabled = !isUnlocked || (!hasResources && !workbench.isActive);
          
          // Check if workbench is active for player crafting
          const isPlayerCrafting = workbench.isActive && workbench.recipe?.id === recipe.id;

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
                {hasBudAssigned ? (
                  // Show Bud crafting controls
                  <button
                    className={`px-4 py-2 rounded ${
                      isDisabled 
                        ? 'bg-gray-500 cursor-not-allowed' 
                        : isBudCraftingActive(assignedBuds[0])
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                    onClick={() => {
                      const bud = assignedBuds[0];
                      handleStartCrafting(bud, recipe.id);
                    }}
                    disabled={isDisabled}
                  >
                    {!isUnlocked 
                      ? `Requires Level ${recipe.levelRequired}`
                      : !hasResources
                        ? 'Missing Resources'
                        : isBudCraftingActive(assignedBuds[0])
                          ? 'Stop Crafting'
                          : 'Start Crafting'}
                  </button>
                ) : (
                  // Show Player crafting controls
                  <div>
                    <button
                      className={`px-4 py-2 rounded ${
                        isUnlocked && (hasResources || workbench.isActive)
                          ? isPlayerCrafting
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-blue-500 hover:bg-blue-600'
                          : 'bg-gray-500 cursor-not-allowed'
                      }`}
                      onClick={() => handlePlayerCraft(recipe.id)}
                      disabled={!isUnlocked || (!hasResources && !workbench.isActive)}
                    >
                      {!isUnlocked 
                        ? `Requires Level ${recipe.levelRequired}`
                        : !hasResources && !workbench.isActive
                        ? 'Missing Resources'
                        : isPlayerCrafting
                        ? 'Stop'
                        : 'Start'}
                    </button>
                    {isPlayerCrafting && (
                      <div className="mt-2">
                        <p className="text-sm">Crafting: {recipe.name}</p>
                        <div className="w-full bg-gray-600 h-2 mt-2 rounded overflow-hidden">
                          <div 
                            className="bg-green-500 h-full rounded transition-all duration-100 ease-linear"
                            style={{ 
                              width: `${(workbench.progress / recipe.craftingTime) * 100}%`,
                              transition: 'width 100ms linear'
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SmithingWorkbench;
