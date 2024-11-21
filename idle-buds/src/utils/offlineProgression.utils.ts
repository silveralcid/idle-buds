import { calculateResourceGain, calculateExperienceGain } from './resourceCalculation.utils';
import { allResources } from '../data/allResources.data';
import { GameState } from '../types/state.types';
import { useResourceAssignmentStore } from '../stores/resourceAssignment.store';
import { defaultSkillMapping } from '../data/defaultSkillMapping';

interface OfflineProgressionResult {
  hunterResources: Record<string, number>;
  budResources: Record<string, number>;
  hunterExperience: Record<string, number>;
  budExperience: Record<string, number>;
}

export const calculateOfflineProgression = (state: GameState, deltaTime: number): OfflineProgressionResult => {
  const hunterResources: Record<string, number> = {};
  const budResources: Record<string, number> = {};
  const hunterExperience: Record<string, number> = {};
  const budExperience: Record<string, number> = {};

  // Calculate hunter's resource and experience gains
  if (state.currentActivity) {
    const resource = allResources.find(r => r.id === state.currentActivity);
    if (resource) {
      const { wholeAmount: hunterResourceGain } = calculateResourceGain(resource.gatherRate, deltaTime, state.fractionalResources[resource.id] || 0);
      const skillId = defaultSkillMapping[resource.type];
      const { wholeXP: hunterXP } = calculateExperienceGain(resource.experienceGain, deltaTime, state.fractionalXP[skillId] || 0);

      hunterResources[resource.id] = hunterResourceGain;
      hunterExperience[skillId] = hunterXP;
    }
  }

  // Calculate bud's resource and experience gains
  if (state.budActivity) {
    const resource = allResources.find(r => r.id === state.budActivity);
    if (resource) {
      const { assignments } = useResourceAssignmentStore.getState();
      const assignedBud = assignments[state.budActivity];

      if (assignedBud) {
        const { wholeAmount: budResourceGain } = calculateResourceGain(resource.gatherRate, deltaTime, state.fractionalResources[resource.id] || 0);
        const { wholeXP: budXP } = calculateExperienceGain(resource.experienceGain, deltaTime, state.fractionalXP[assignedBud.id] || 0);

        budResources[resource.id] = budResourceGain;
        budExperience[assignedBud.id] = budXP;
      }
    }
  }

  return {
    hunterResources,
    budResources,
    hunterExperience,
    budExperience
  };
};