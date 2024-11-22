// src/utils/bud/budResource.utils.ts
import { GameState } from '../types/state.types';
import { useBankStore } from '../stores/bank.store';
import { useBudStore } from '../stores/bud.store';
import { calculateResourceGain, calculateExperienceGain } from './gathering-calculation.utils';
import { GameConfig } from '../constants/gameConfig';
import { allResources } from '../data/allResources.data';

export const updateBudResources = (state: GameState, deltaTime: number) => {
  if (!state.budActivity) return state;

  const resource = allResources.find(r => r.id === state.budActivity);
  if (!resource) return state;

  const { assignments } = useNodeAssignmentStore.getState();
  const assignedBud = assignments[state.budActivity];
  if (!assignedBud) return state;

  const ticks = deltaTime / GameConfig.tickDuration;
  const efficiency = calculateBudEfficiency(assignedBud, resource);
  
  const { wholeAmount, newFraction } = calculateResourceGain(
    resource.gatherRate * efficiency,
    ticks,
    state.fractionalItems[resource.id] || 0 
  );

  const { wholeXP, newXPFraction } = calculateExperienceGain(
    resource.experienceGain,
    ticks,
    state.fractionalXP[assignedBud.id] || 0
  );

  // Update resources and experience
  resource.resourceNodeYields.forEach(itemId => {
    useBankStore.getState().addItem(itemId, wholeAmount);
  });
  useBudStore.getState().increaseBudExperience(assignedBud.id, wholeXP);

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