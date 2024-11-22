import { allResources } from '../data/allResources.data';
import { useBankStore } from '../stores/bank.store';
import { useHunterStore } from '../stores/hunter.store';
import { useNodeAssignmentStore } from '../stores/nodeAssignment.store';
import { calculateResourceGain, calculateExperienceGain } from '../utils/resourceCalculation.utils';
import { defaultSkillMapping } from '../data/defaultSkillMapping';
import { GameState } from '../types/state.types';
import { GameConfig } from '../constants/gameConfig';

export const updateHunterResources = (state: GameState, deltaTime: number) => {
  console.log('updateHunterResources called with:', { state, deltaTime });

  if (state.currentActivity) {
    console.log('Current activity:', state.currentActivity);

    const resource = allResources.find(r => r.id === state.currentActivity);
    console.log('Resource found:', resource);

    if (resource) {
      const ticks = deltaTime / GameConfig.tickDuration;
      console.log('Ticks calculated:', ticks);

      const { wholeAmount, newFraction } = calculateResourceGain(resource.gatherRate, ticks, state.fractionalItems[resource.id] || 0);
      console.log('Resource gain calculated:', { wholeAmount, newFraction });

      const skillId = defaultSkillMapping[resource.type];
      console.log('Skill ID determined:', skillId);

      const { wholeXP, newXPFraction } = calculateExperienceGain(resource.experienceGain, ticks, state.fractionalXP[skillId] || 0);
      console.log('Experience gain calculated:', { wholeXP, newXPFraction });

      resource.resourceNodeYields.forEach(itemId => {
        useBankStore.getState().addItem(itemId, wholeAmount);
        console.log(`Added ${wholeAmount} of item ${itemId} to bank`);
      });

      useHunterStore.getState().increaseSkillExperience(skillId, wholeXP);
      console.log(`Increased skill experience for skill ${skillId} by ${wholeXP}`);

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

  console.log('No current activity or resource found. Returning unchanged state.');
  return state;
};

export const updateBudResources = (state: GameState, deltaTime: number) => {
  console.log('updateBudResources called with:', { state, deltaTime });

  if (state.budActivity) {
    console.log('Bud activity:', state.budActivity);

    const resource = allResources.find(r => r.id === state.budActivity);
    console.log('Resource found:', resource);

    if (resource) {
      const { assignments } = useNodeAssignmentStore.getState();
      console.log('Node assignments:', assignments);

      const assignedBud = assignments[state.budActivity];
      console.log('Assigned bud:', assignedBud);

      if (assignedBud) {
        const ticks = deltaTime / GameConfig.tickDuration;
        console.log('Ticks calculated:', ticks);

        const { wholeAmount, newFraction } = calculateResourceGain(resource.gatherRate, ticks, state.fractionalItems[resource.id] || 0);
        console.log('Resource gain calculated:', { wholeAmount, newFraction });

        const { wholeXP, newXPFraction } = calculateExperienceGain(resource.experienceGain, ticks, state.fractionalXP[assignedBud.id] || 0);
        console.log('Experience gain calculated:', { wholeXP, newXPFraction });

        resource.resourceNodeYields.forEach(itemId => {
          useBankStore.getState().addItem(itemId, wholeAmount);
          console.log(`Added ${wholeAmount} of item ${itemId} to bank`);
        });

        useHunterStore.getState().increaseBudExperience(assignedBud.id, wholeXP);
        console.log(`Increased bud experience for bud ${assignedBud.id} by ${wholeXP}`);

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

  console.log('No bud activity or assigned bud/resource found. Returning unchanged state.');
  return state;
};