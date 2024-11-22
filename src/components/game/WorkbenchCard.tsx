import React, { useState, useEffect } from 'react';
import { Workbench } from '../../types/workbench.types';
import { Recipe } from '../../types/recipe.types';
import { useHunterStore } from '../../stores/hunter.store';
import { useBudAssignment } from '../../hooks/useBudAssignment';
import { useGameStore } from '../../stores/game.store';
import { smeltedRecipes } from '../../data/recipes/smeltedRecipes.data';
import { meleeRecipes } from '../../data/recipes/meleeRecipes.data';
import { useBankStore } from '../../stores/bank.store';

interface WorkbenchCardProps {
  workbench: Workbench;
  skillId: string;
  onRecipeSelect: (recipeId: string | null) => void;
  selectedRecipeId: string | null;
}

const WorkbenchCard: React.FC<WorkbenchCardProps> = ({
  workbench,
  skillId,
  onRecipeSelect,
  selectedRecipeId,
}) => {
  const [isUnlocked, setIsUnlocked] = useState(workbench.isUnlocked);
  const skill = useHunterStore((state) => state.skills[skillId]);
  const { assignedBud, assign, unassign } = useBudAssignment(workbench.id, 'crafting');
  const budActivity = useGameStore((state) => state.budActivity);
  const currentActivity = useGameStore((state) => state.currentActivity);
  const party = useHunterStore((state) => state.party);
  const [canCraft, setCanCraft] = useState(false);
  const items = useBankStore((state) => state.items);
  const [craftProgress, setCraftProgress] = useState(0);
  const fractionalItems = useGameStore((state) => state.fractionalItems);

  useEffect(() => {
    if (skill && skill.level >= workbench.levelRequired) {
      setIsUnlocked(true);
    }
  }, [skill, workbench.levelRequired]);

  useEffect(() => {
    const isActive = currentActivity === workbench.id || budActivity === workbench.id;
    
    if (!isActive) {
      setCraftProgress(0);
      return;
    }

    const progress = fractionalItems[workbench.id] || 0;
    setCraftProgress(progress);

    return () => {
      if (!isActive) {
        setCraftProgress(0);
      }
    };
  }, [
    fractionalItems,
    workbench.id,
    currentActivity,
    budActivity
  ]);

  const handleBudCraft = () => {
    if (!isUnlocked || !selectedRecipeId) return;
    if (budActivity === workbench.id) {
      unassign();
    } else {
      useGameStore.getState().setCurrentRecipe(selectedRecipeId);
      assign(workbench.id);
    }
  };

  const handleHunterCraft = () => {
    if (!isUnlocked || !selectedRecipeId) return;
    if (currentActivity === workbench.id) {
      unassign();
    } else {
      useGameStore.getState().setCurrentRecipe(selectedRecipeId);
      assign(workbench.id);
    }
  };

  const getRelevantRecipes = (): Recipe[] => {
    switch (workbench.workbenchType) {
      case 'smelting':
        return smeltedRecipes;
      case 'smithing':
        return meleeRecipes;
      default:
        return [];
    }
  };

  const recipes = getRelevantRecipes();

  const checkCanCraft = (recipe: Recipe) => {
    return recipe.inputs.every(input =>
      input.itemIds.some(itemId => (items[itemId] || 0) >= input.amount)
    );
  };

  useEffect(() => {
    if (selectedRecipeId) {
      const recipe = recipes.find(r => r.id === selectedRecipeId);
      if (recipe) {
        setCanCraft(checkCanCraft(recipe));
      }
    }
  }, [selectedRecipeId, items, recipes]);

  const handleAssignBud = (budId: string) => {
    if (selectedRecipeId) {
      assign(budId, selectedRecipeId);
    }
  };

  return (
    <div
      className={`card shadow-lg p-4 space-y-4 ${
        isUnlocked ? 'opacity-100' : 'opacity-50'
      } ${(budActivity === workbench.id || currentActivity === workbench.id)
        ? 'bg-success'
        : 'bg-base-200'}`}
    >
      <div className="card-body relative">
        <h3 className="card-title flex justify-between text-lg font-bold">
          {workbench.name}
        </h3>
        <p className="text-sm text-gray-600">{workbench.description}</p>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Type: {workbench.workbenchType}</span>
            <span>Level Required: {workbench.levelRequired}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tier: {workbench.tier || 1}</span>
          </div>
          {workbench.specialRequirements && (
            <div className="text-sm text-warning space-y-1">
              {workbench.specialRequirements.map((req, index) => (
                <div key={index}>{req}</div>
              ))}
            </div>
          )}
        </div>

        {isUnlocked && (
          <div className="mt-4 space-y-4">
            {(currentActivity === workbench.id || budActivity === workbench.id) && (
              <div className="w-full mb-2">
                <div className="w-full bg-base-300 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-200 ease-linear"
                    style={{ 
                      width: `${Math.min(craftProgress * 100, 100)}%`,
                      transition: 'width 200ms linear'
                    }}
                  />
                </div>
                <div className="text-xs text-center mt-1">
                  {(craftProgress * 100).toFixed(1)}%
                </div>
              </div>
            )}
            <button
              onClick={assignedBud ? handleBudCraft : handleHunterCraft}
              className={`btn ${
                (assignedBud && budActivity === workbench.id) ||
                (!assignedBud && currentActivity === workbench.id)
                  ? 'btn-danger'
                  : 'btn-primary'
              }`}
            >
              {(assignedBud && budActivity === workbench.id) ||
              (!assignedBud && currentActivity === workbench.id)
                ? 'Stop'
                : 'Craft'}
            </button>

            {assignedBud ? (
              <div className="flex items-center space-x-2">
                <img
                  src={assignedBud.spriteRef}
                  alt={assignedBud.name}
                  className="w-8 h-8"
                />
                <div className="text-sm">
                  <div>{assignedBud.name}</div>
                  <div>Level: {assignedBud.level}</div>
                  <div>
                    XP: {assignedBud.experience}/{assignedBud.experienceToNextLevel}
                  </div>
                </div>
                <button
                  onClick={() => unassign()}
                  className="text-red-500 hover:text-red-700"
                >
                  &times;
                </button>
              </div>
            ) : (
              <div>
                <label
                  htmlFor="bud-select"
                  className="block text-sm font-medium text-gray-700"
                >
                  Assign Bud:
                </label>
                <select
                  id="bud-select"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  onChange={(e) => handleAssignBud(e.target.value)}
                >
                  <option value="">Select a Bud</option>
                  {party.map((bud) => (
                    <option key={bud.id} value={bud.id}>
                      {bud.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        <div className="mt-4">
          <h4 className="font-semibold mb-2">Available Recipes:</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className={`bg-base-300 p-2 rounded-lg text-sm cursor-pointer ${
                  selectedRecipeId === recipe.id ? 'ring-2 ring-primary' : ''
                } ${checkCanCraft(recipe) ? 'opacity-100' : 'opacity-50'}`}
                onClick={() => onRecipeSelect(recipe.id)}
              >
                <div className="font-medium">{recipe.name}</div>
                <div className="flex justify-between text-xs">
                  <span>Level: {recipe.levelRequired}</span>
                  <span>XP: {recipe.experienceGain}</span>
                </div>
                <div className="text-xs space-y-1">
                  <div
                    className={!checkCanCraft(recipe) ? 'text-error' : ''}
                  >
                    Inputs:{' '}
                    {recipe.inputs
                      .map(
                        (input) =>
                          `${input.amount}x ${input.itemIds.join(' or ')} (${
                            items[input.itemIds[0]] || 0
                          })`
                      )
                      .join(', ')}
                  </div>
                  <div>
                    Outputs:{' '}
                    {recipe.outputs
                      .map(
                        (output) =>
                          `${output.amount}x ${output.itemId}`
                      )
                      .join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default WorkbenchCard;