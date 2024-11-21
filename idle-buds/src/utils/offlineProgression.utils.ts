import { calculateResourceGain, calculateExperienceGain } from './resourceCalculation.utils';
import { allResources } from '../data/allResources.data';
import { GameState } from '../types/state.types';
import { useResourceAssignmentStore } from '../stores/resourceAssignment.store';
import { defaultSkillMapping } from '../data/defaultSkillMapping';
import { useGameStore } from '../stores/game.store';
import { GameConfig } from '../constants/gameConfig';
import { useBankStore } from '../stores/bank.store';
import { useHunterStore } from '../stores/hunter.store';
import { increaseBudExperience } from '../utils/budManagement.utils';

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

  console.log('Current Activity:', state.currentActivity);
  console.log('Bud Activity:', state.budActivity);
  console.log('All Resources:', allResources);
  console.log('Default Skill Mapping:', defaultSkillMapping);

  const tickDuration = GameConfig.tickDuration / 1000; // Convert to seconds
  const ticks = deltaTime / tickDuration;

  if (state.currentActivity) {
    const resource = allResources.find(r => r.id === state.currentActivity);
    if (resource) {
      const { wholeAmount: hunterResourceGain, newFraction: newHunterFraction } = calculateResourceGain(resource.gatherRate, ticks, state.fractionalResources[resource.id] || 0);
      const skillId = defaultSkillMapping[resource.type];
      const { wholeXP: hunterXP, newXPFraction: newHunterXPFraction } = calculateExperienceGain(resource.experienceGain, ticks, state.fractionalXP[skillId] || 0);

      hunterResources[resource.id] = hunterResourceGain;
      hunterExperience[skillId] = hunterXP;

      state.fractionalResources[resource.id] = newHunterFraction;
      state.fractionalXP[skillId] = newHunterXPFraction;
    }
  }

  if (state.budActivity) {
    const resource = allResources.find(r => r.id === state.budActivity);
    if (resource) {
      const { assignments } = useResourceAssignmentStore.getState();
      const assignedBud = assignments[state.budActivity];

      if (assignedBud) {
        const { wholeAmount: budResourceGain, newFraction: newBudFraction } = calculateResourceGain(resource.gatherRate, ticks, state.fractionalResources[resource.id] || 0);
        const { wholeXP: budXP, newXPFraction: newBudXPFraction } = calculateExperienceGain(resource.experienceGain, ticks, state.fractionalXP[assignedBud.id] || 0);

        budResources[resource.id] = budResourceGain;
        budExperience[assignedBud.id] = budXP;

        state.fractionalResources[resource.id] = newBudFraction;
        state.fractionalXP[assignedBud.id] = newBudXPFraction;
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

export const handleOfflineProgression = (setProgressionData: (data: any) => void, setModalVisible: (visible: boolean) => void) => {
  console.log('Calculating offline progression');
  const lastSaveTime = useGameStore.getState().lastSaveTime;
  const currentTime = Date.now();
  const deltaTime = (currentTime - lastSaveTime) / 1000;

  console.log('Last save time:', new Date(lastSaveTime).toLocaleString());
  console.log('Current time:', new Date(currentTime).toLocaleString());
  console.log('Delta time (seconds):', deltaTime);

  const state = useGameStore.getState();
  const progressionData = calculateOfflineProgression(state, deltaTime);
  console.log('Progression data:', progressionData);

  // Update Bank Store with hunter and bud resources
  const bankStore = useBankStore.getState();
  Object.entries(progressionData.hunterResources).forEach(([resourceId, amount]) => {
    console.log(`Adding ${amount} of resource ${resourceId} to bank store`);
    bankStore.addResource(resourceId, amount);
  });
  Object.entries(progressionData.budResources).forEach(([resourceId, amount]) => {
    console.log(`Adding ${amount} of bud resource ${resourceId} to bank store`);
    bankStore.addResource(resourceId, amount);
  });

  // Update Hunter XP
  const hunterStore = useHunterStore.getState();
  Object.entries(progressionData.hunterExperience).forEach(([skillId, xp]) => {
    console.log(`Increasing hunter skill ${skillId} by ${xp} XP`);
    hunterStore.increaseSkillExperience(skillId, xp);
  });

  // Update Assigned Bud XP
  Object.entries(progressionData.budExperience).forEach(([budId, xp]) => {
    console.log(`Increasing bud ${budId} by ${xp} XP`);
    increaseBudExperience(budId, xp);
  });

  setProgressionData(progressionData);
  console.log('Progression data set and modal visibility updated');
  setModalVisible(true);

  // Resume the game
  useGameStore.getState().unpauseGame();
  console.log('Game resumed after applying offline progression');
};