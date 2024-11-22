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
  assignedBuds: string[];
  onAssignBud: (budId: string) => void;
  onRemoveBud: (budId: string) => void;
  onActivate: (workbenchId: string) => void;
  skillId: string;
  onRecipeSelect: (recipeId: string | null) => void;
  selectedRecipeId: string | null;
}

const WorkbenchCard: React.FC<WorkbenchCardProps> = ({
  workbench,
  assignedBuds,
  onAssignBud,
  onRemoveBud,
  onActivate,
  skillId,
  onRecipeSelect,
  selectedRecipeId,
}) => {
  const [isUnlocked, setIsUnlocked] = useState(workbench.isUnlocked);
  const skill = useHunterStore((state) => state.skills[skillId]);
  const { assignedBud, removeBud, handleAssignBud } = useBudAssignment(workbench.id);
  const budActivity = useGameStore((state) => state.budActivity);
  const currentActivity = useGameStore((state) => state.currentActivity);
  const party = useHunterStore((state) => state.party);
  const [canCraft, setCanCraft] = useState(false);
  const items = useBankStore((state) => state.items);

  useEffect(() => {
    if (skill && skill.level >= workbench.levelRequired) {
      setIsUnlocked(true);
    }
  }, [skill, workbench.levelRequired]);

  const handleBudCraft = () => {
    if (!isUnlocked) return;
    if (budActivity === workbench.id) {
      // Stop crafting
      onActivate('');
    } else {
      // Start crafting
      onActivate(workbench.id);
    }
  };

  const handleHunterCraft = () => {
    if (!isUnlocked) return;
    if (currentActivity === workbench.id) {
      // Stop crafting
      onActivate('');
    } else {
      // Start crafting
      onActivate(workbench.id);
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
    return recipe.inputs.every(input => {
      // Check if player has any of the alternative items in sufficient quantity
      return input.itemIds.some(itemId => 
        (items[itemId] || 0) >= input.amount
      );
    });
  };

  useEffect(() => {
    if (selectedRecipeId) {
      const recipe = recipes.find(r => r.id === selectedRecipeId);
      if (recipe) {
        setCanCraft(checkCanCraft(recipe));
      }
    }
  }, [selectedRecipeId, items, recipes]);

  return (
    <div className={`card shadow-lg ${isUnlocked ? 'opacity-100' : 'opacity-50'} 
      ${(budActivity === workbench.id || currentActivity === workbench.id) ? 'bg-success' : 'bg-base-200'}`}>
      <div className="card-body relative">
        <h3 className="card-title flex justify-between">
          {workbench.name}
        </h3>
        <p className="text-sm opacity-70">{workbench.description}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Type: {workbench.workbenchType}</span>
            <span>Level Required: {workbench.levelRequired}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tier: {workbench.tier || 1}</span>
          </div>
          {workbench.specialRequirements && (
            <div className="text-sm text-warning">
              {workbench.specialRequirements.map((req, index) => (
                <div key={index}>{req}</div>
              ))}
            </div>
          )}
          {isUnlocked && (
            <div className="flex justify-between mt-4">
              <button
                onClick={assignedBud ? handleBudCraft : handleHunterCraft}
                className={`btn ${(assignedBud && budActivity === workbench.id) || 
                  (!assignedBud && currentActivity === workbench.id) ? 'btn-danger' : 'btn-primary'}`}
              >
                {(assignedBud && budActivity === workbench.id) || 
                  (!assignedBud && currentActivity === workbench.id) ? 'Stop' : 'Craft'}
              </button>
              {assignedBud ? (
                <div className="flex items-center space-x-2">
                  <img src={assignedBud.spriteRef} alt={assignedBud.name} className="w-8 h-8" />
                  <div className="text-sm">
                    <div>{assignedBud.name}</div>
                    <div>Level: {assignedBud.level}</div>
                    <div>XP: {assignedBud.experience}/{assignedBud.experienceToNextLevel}</div>
                  </div>
                  <button
                    onClick={() => removeBud()}
                    className="text-red-500 hover:text-red-700"
                  >
                    &times;
                  </button>
                </div>
              ) : (
                <div>
                  <label htmlFor="bud-select" className="block text-sm font-medium text-gray-700">
                    Assign Bud:
                  </label>
                  <select
                    id="bud-select"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none 
                      focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
        </div>
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Available Recipes:</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {recipes.map((recipe) => (
              <div 
                key={recipe.id} 
                className={`bg-base-300 p-2 rounded-lg text-sm cursor-pointer
                  ${selectedRecipeId === recipe.id ? 'ring-2 ring-primary' : ''}
                  ${checkCanCraft(recipe) ? 'opacity-100' : 'opacity-50'}`}
                onClick={() => onRecipeSelect(recipe.id)}
              >
                <div className="font-medium">{recipe.name}</div>
                <div className="flex justify-between text-xs">
                  <span>Level: {recipe.levelRequired}</span>
                  <span>XP: {recipe.experienceGain}</span>
                </div>
                <div className="text-xs">
                  <div className={!checkCanCraft(recipe) ? 'text-error' : ''}>
                    Inputs: {recipe.inputs.map(input => 
                      `${input.amount}x ${input.itemIds.join(' or ')} (${items[input.itemIds[0]] || 0})`
                    ).join(', ')}
                  </div>
                  <div>
                    Outputs: {recipe.outputs.map(output => 
                      `${output.amount}x ${output.itemId}`
                    ).join(', ')}
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