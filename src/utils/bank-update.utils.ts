import { allResources } from '../data/allResources.data';
import { useBankStore } from '../stores/bank.store';
import { useHunterStore } from '../stores/hunter.store';
import { useNodeAssignmentStore } from '../stores/nodeAssignment.store';
import { calculateResourceGain, calculateExperienceGain } from './gathering-calculation.utils';
import { defaultSkillMapping } from '../data/defaultSkillMapping';
import { GameState } from '../types/state.types';
import { GameConfig } from '../constants/gameConfig';
import { meleeRecipes } from '../data/recipes/meleeRecipes.data';
import { processBudCrafting, processCrafting } from './bud-crafting.utils';
import { smeltedRecipes } from '../data/recipes/smeltedRecipes.data';
import { CraftingResult } from '../types/crafting-result.types';

const updateStateWithResult = (
  state: GameState, 
  result: CraftingResult, 
  activityId: string, 
  isBud: boolean
): GameState => {
  const { completedItems, remainingFraction, experienceGained } = result;
  
  if (completedItems > 0) {
    useBankStore.getState().addItem(activityId, completedItems);
  }

  if (isBud) {
    const { assignments } = useNodeAssignmentStore.getState();
    const assignedBud = assignments[activityId];
    if (assignedBud) {
      useNodeAssignmentStore.getState().increaseBudExperience(assignedBud.id, experienceGained);
    }
  } else {
    useHunterStore.getState().increaseSkillExperience(
      defaultSkillMapping[activityId] || 'crafting',
      experienceGained
    );
  }

  return {
    ...state,
    fractionalItems: {
      ...state.fractionalItems,
      [activityId]: remainingFraction
    }
  };
};

export const updateResources = (state: GameState, deltaTime: number) => {
  let newState = { ...state };
  
  // Process hunter activities
  if (state.currentActivity) {
    newState = processEntityActivity(newState, deltaTime, false);
  }
  
  // Process bud activities independently
  if (state.budActivity) {
    newState = processEntityActivity(newState, deltaTime, true);
  }
  
  return newState;
};

const processEntityActivity = (state: GameState, deltaTime: number, isBud: boolean) => {
  const activityId = isBud ? state.budActivity : state.currentActivity;
  const recipe = state.currentRecipeId ? 
    [...smeltedRecipes, ...meleeRecipes].find(r => r.id === state.currentRecipeId) : 
    null;

  if (recipe) {
    const result = isBud ? 
      processBudCrafting(recipe, deltaTime, activityId!, state.fractionalItems[activityId!] || 0) :
      processCrafting(recipe, deltaTime, state.fractionalItems[activityId!] || 0);

    return updateStateWithResult(state, result, activityId!, isBud);
  }

  return state;
};

export const updateHunterResources = (state: GameState, deltaTime: number): GameState => {
  if (!state.currentActivity) return state;

  const resource = allResources.find(r => r.id === state.currentActivity);
  if (!resource) return state;

  const ticks = deltaTime / GameConfig.tickDuration;
  const { wholeAmount, newFraction } = calculateResourceGain(
    resource.gatherRate, 
    ticks, 
    state.fractionalItems[resource.id] || 0
  );

  const skillId = defaultSkillMapping[resource.type];
  const { wholeXP, newXPFraction } = calculateExperienceGain(
    resource.experienceGain, 
    ticks, 
    state.fractionalXP[skillId] || 0
  );

  resource.resourceNodeYields.forEach(itemId => {
    useBankStore.getState().addItem(itemId, wholeAmount);
  });

  useHunterStore.getState().increaseSkillExperience(skillId, wholeXP);

  return {
    ...state,
    fractionalItems: {
      ...state.fractionalItems,
      [resource.id]: newFraction,
    },
    fractionalXP: {
      ...state.fractionalXP,
      [skillId]: newXPFraction,
    },
  };
};

export const updateBudResources = (state: GameState, deltaTime: number): GameState => {
  if (!state.budActivity) return state;

  const resource = allResources.find(r => r.id === state.budActivity);
  if (!resource) return state;

  const { assignments } = useNodeAssignmentStore.getState();
  const assignedBud = assignments[state.budActivity];
  if (!assignedBud) return state;

  const ticks = deltaTime / GameConfig.tickDuration;
  const { wholeAmount, newFraction } = calculateResourceGain(
    resource.gatherRate, 
    ticks, 
    state.fractionalItems[resource.id] || 0
  );

  const { wholeXP, newXPFraction } = calculateExperienceGain(
    resource.experienceGain, 
    ticks, 
    state.fractionalXP[assignedBud.id] || 0
  );

  resource.resourceNodeYields.forEach(itemId => {
    useBankStore.getState().addItem(itemId, wholeAmount);
  });

  useHunterStore.getState().increaseBudExperience(assignedBud.id, wholeXP);

  return {
    ...state,
    fractionalItems: {
      ...state.fractionalItems,
      [resource.id]: newFraction,
    },
    fractionalXP: {
      ...state.fractionalXP,
      [assignedBud.id]: newXPFraction,
    },
  };
};
