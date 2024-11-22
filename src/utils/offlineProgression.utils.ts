import { calculateResourceGain, calculateExperienceGain } from './resourceCalculation.utils';
import { allResources } from '../data/allResources.data';
import { GameState } from '../types/state.types';
import { useNodeAssignmentStore } from '../stores/nodeAssignment.store';
import { defaultSkillMapping } from '../data/defaultSkillMapping';
import { useGameStore } from '../stores/game.store';
import { GameConfig } from '../constants/gameConfig';
import { useBankStore } from '../stores/bank.store';
import { useHunterStore } from '../stores/hunter.store';
import { increaseBudExperience } from './budManagement.utils';
import { miningItems } from '../data/items/ore.data';

interface OfflineProgressionResult {
  offlineHunterItemYield: Record<string, number>;
  offlineBudItemYield: Record<string, number>;
  offlineHunterExperience: Record<string, number>;
  offlineBudExperience: Record<string, number>;
}

export const calculateOfflineProgression = (state: GameState, deltaTime: number): OfflineProgressionResult => {
  const offlineHunterItemYield: Record<string, number> = {};
  const offlineBudItemYield: Record<string, number> = {};
  const offlineHunterExperience: Record<string, number> = {};
  const offlineBudExperience: Record<string, number> = {};

  console.log('Current Activity:', state.currentActivity);
  console.log('Bud Activity:', state.budActivity);
  console.log('All Resources:', allResources);
  console.log('Default Skill Mapping:', defaultSkillMapping);

  const tickDuration = GameConfig.tickDuration / 1000; // Convert to seconds
  const ticks = deltaTime / tickDuration;

  if (state.currentActivity) {
    const resource = allResources.find(r => r.id === state.currentActivity);
    if (resource) {
      const { wholeAmount: hunterResourceGain, newFraction: newHunterFraction } = calculateResourceGain(resource.gatherRate, ticks, state.fractionalItems[resource.id] || 0);
      const skillId = defaultSkillMapping[resource.type];
      const { wholeXP: hunterXP, newXPFraction: newHunterXPFraction } = calculateExperienceGain(resource.experienceGain, ticks, state.fractionalXP[skillId] || 0);

      resource.resourceNodeYields.forEach(itemId => {
        offlineHunterItemYield[itemId] = hunterResourceGain;
        state.fractionalItems[itemId] = newHunterFraction;
      });
      offlineHunterExperience[skillId] = hunterXP;
      state.fractionalXP[skillId] = newHunterXPFraction;
    }
  }
  
  if (state.budActivity) {
    const resource = allResources.find(r => r.id === state.budActivity);
    if (resource) {
      const { assignments } = useNodeAssignmentStore.getState();
      const assignedBud = assignments[state.budActivity];

      if (assignedBud) {
        const { wholeAmount: budResourceGain, newFraction: newBudFraction } = calculateResourceGain(resource.gatherRate, ticks, state.fractionalItems[resource.id] || 0);
        const { wholeXP: budXP, newXPFraction: newBudXPFraction } = calculateExperienceGain(resource.experienceGain, ticks, state.fractionalXP[assignedBud.id] || 0);

        resource.resourceNodeYields.forEach(itemId => {
          offlineBudItemYield[itemId] = budResourceGain;
          state.fractionalItems[itemId] = newBudFraction;
        });
        offlineBudExperience[assignedBud.id] = budXP;
        state.fractionalXP[assignedBud.id] = newBudXPFraction;
      }
    }
  }

  return {
    offlineHunterItemYield,
    offlineBudItemYield,
    offlineHunterExperience,
    offlineBudExperience
  };
};

export const handleOfflineProgression = (setProgressionData: (data: any) => void, setModalVisible: (visible: boolean) => void) => {
  console.log('Calculating offline progression');
  const lastSaveTime = useGameStore.getState().lastSaveTime;
  const currentTime = Date.now();
  const deltaTime = (currentTime - lastSaveTime) / 1000;

  const state = useGameStore.getState();
  const progressionData = calculateOfflineProgression(state, deltaTime);
  
  // Map the progression data to match the modal's expected format
  const formattedProgressionData = {
    hunterResources: progressionData.offlineHunterItemYield,
    budResources: progressionData.offlineBudItemYield,
    hunterExperience: progressionData.offlineHunterExperience,
    budExperience: progressionData.offlineBudExperience
  };

  // Update Bank Store with hunter and bud resources
  const bankStore = useBankStore.getState();
  Object.entries(progressionData.offlineHunterItemYield).forEach(([itemId, amount]) => {
    console.log(`Adding ${amount} of resource ${itemId} to bank store`);
    bankStore.addItem(itemId, amount);
  });
  Object.entries(progressionData.offlineBudItemYield).forEach(([itemId, amount]) => {
    console.log(`Adding ${amount} of bud resource ${itemId} to bank store`);
    bankStore.addItem(itemId, amount);
  });

  // Update Hunter XP
  const hunterStore = useHunterStore.getState();
  Object.entries(progressionData.offlineHunterExperience).forEach(([skillId, xp]) => {
    console.log(`Increasing hunter skill ${skillId} by ${xp} XP`);
    hunterStore.increaseSkillExperience(skillId, xp);
  });

  // Update Assigned Bud XP
  Object.entries(progressionData.offlineBudExperience).forEach(([budId, xp]) => {
    console.log(`Increasing bud ${budId} by ${xp} XP`);
    increaseBudExperience(budId, xp);
  });

  setProgressionData(formattedProgressionData);
  setModalVisible(true);

  // Resume the game
  useGameStore.getState().unpauseGame();
  console.log('Game resumed after applying offline progression');
}