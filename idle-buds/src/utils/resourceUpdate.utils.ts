import { allResources } from '../data/allResources.data';
import { useBankStore } from '../stores/bank.store';
import { useHunterStore } from '../stores/hunter.store';
import { useNodeAssignmentStore } from '../stores/nodeAssignment.store';
import { calculateResourceGain, calculateExperienceGain } from '../utils/resourceCalculation.utils';
import { defaultSkillMapping } from '../data/defaultSkillMapping';
import { GameState } from '../types/state.types';
import { GameConfig } from '../constants/gameConfig';

export const updateHunterResources = (state: GameState, deltaTime: number) => {
  if (state.currentActivity) {
    const resource = allResources.find(r => r.id === state.currentActivity);
    if (resource) {
      const ticks = deltaTime / GameConfig.tickDuration;
      const { wholeAmount, newFraction } = calculateResourceGain(resource.gatherRate, ticks, state.fractionalItems[resource.id] || 0);
      const skillId = defaultSkillMapping[resource.type];
      const { wholeXP, newXPFraction } = calculateExperienceGain(resource.experienceGain, ticks, state.fractionalXP[skillId] || 0);

      useBankStore.getState().addItem(resource.id, wholeAmount);
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
    }
  }
  return state;
};

export const updateBudResources = (state: GameState, deltaTime: number) => {
  if (state.budActivity) {
    const resource = allResources.find(r => r.id === state.budActivity);
    if (resource) {
      const { assignments } = useNodeAssignmentStore.getState();
      const assignedBud = assignments[state.budActivity];

      if (assignedBud) {
        const ticks = deltaTime / GameConfig.tickDuration;
        const { wholeAmount, newFraction } = calculateResourceGain(resource.gatherRate, ticks, state.fractionalItems[resource.id] || 0);
        const { wholeXP, newXPFraction } = calculateExperienceGain(resource.experienceGain, ticks, state.fractionalXP[assignedBud.id] || 0);

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
      }
    }
  }
  return state;
};