import { useBankStore } from '../stores/bank.store';
import { useHunterStore } from '../stores/hunter.store';
import { calculateResourceGain, calculateExperienceGain } from './gathering-calculation.utils';
import { defaultSkillMapping } from '../data/defaultSkillMapping';
import { GameConfig } from '../constants/gameConfig';
import { allResources } from '../data/allResources.data';

export const updateHunterResources = (state: GameState, deltaTime: number) => {
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

  // Update bank and experience
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