import { allResources } from '../data/allResources.data';
import { calculateResourceGain } from '../utils/resourceCalculation.utils';
import { GameState } from '../types/state.types';
import { defaultSkillMapping } from '../data/defaultSkillMapping';
import { calculateExperienceGain } from '../utils/resourceCalculation.utils';
import { useResourceAssignmentStore } from '../stores/resourceAssignment.store';

export const calculateResourcesGained = (state: GameState, elapsedTime: number): Record<string, number> => {
  const resourcesGained: Record<string, number> = {};

  if (state.currentActivity) {
    const resource = allResources.find(r => r.id === state.currentActivity);
    if (resource) {
      const { wholeAmount } = calculateResourceGain(resource.gatherRate, elapsedTime, state.fractionalResources[resource.id] || 0);
      resourcesGained[resource.id] = wholeAmount;
    }
  }

  if (state.budActivity) {
    const resource = allResources.find(r => r.id === state.budActivity);
    if (resource) {
      const { wholeAmount } = calculateResourceGain(resource.gatherRate, elapsedTime, state.fractionalResources[resource.id] || 0);
      resourcesGained[resource.id] = (resourcesGained[resource.id] || 0) + wholeAmount;
    }
  }

  return resourcesGained;
};

export const calculateOfflineDuration = (lastActiveTime: number): number => {
    const currentTime = Date.now();
    return (currentTime - lastActiveTime) / 1000; // Convert milliseconds to seconds
};
  
export const calculateHunterXPGained = (state: GameState, elapsedTime: number): number => {
    let totalXPGained = 0;
  
    if (state.currentActivity) {
      const resource = allResources.find(r => r.id === state.currentActivity);
      if (resource) {
        const skillId = defaultSkillMapping[resource.type];
        const { wholeXP } = calculateExperienceGain(resource.experienceGain, elapsedTime, state.fractionalXP[skillId] || 0);
        totalXPGained += wholeXP;
      }
    }
  
    return totalXPGained;
};
  
export const calculateBudXPGained = (state: GameState, elapsedTime: number): Record<string, number> => {
    const budXPGained: Record<string, number> = {};
  
    if (state.budActivity) {
      const resource = allResources.find(r => r.id === state.budActivity);
      if (resource) {
        const { assignments } = useResourceAssignmentStore.getState();
        const assignedBud = assignments[state.budActivity];
  
        if (assignedBud) {
          const { wholeXP } = calculateExperienceGain(resource.experienceGain, elapsedTime, state.fractionalXP[assignedBud.id] || 0);
          budXPGained[assignedBud.id] = wholeXP;
        }
      }
    }
  
    return budXPGained;
  };