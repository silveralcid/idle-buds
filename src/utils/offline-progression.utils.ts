import { useGameStore } from '../stores/game.store';
import { useBankStore } from '../stores/bank.store';
import { useHunterStore } from '../stores/hunter.store';
import { calculateGathering } from './gathering-core.utils';
import { allResources } from '../data/allResources.data';
import { useActiveBudStore } from '../stores/active-bud.store';

interface OfflineProgressionResult {
  hunterResources: Record<string, number>;
  budResources: Record<string, number>;
  hunterExperience: Record<string, number>;
  budExperience: Record<string, number>;
}

export const calculateOfflineProgression = (deltaTime: number): OfflineProgressionResult => {
  const hunterStore = useHunterStore.getState();
  const activityStore = useActiveBudStore.getState();
  const hunterResources: Record<string, number> = {};
  const budResources: Record<string, number> = {};
  const hunterExperience: Record<string, number> = {};
  const budExperience: Record<string, number> = {};

  // Process hunter activity
  if (hunterStore.currentActivity) {
    const resource = allResources.find(r => r.id === hunterStore.currentActivity?.nodeId);
    if (resource) {
      const gatherResult = calculateGathering(
        resource,
        deltaTime,
        0, // Reset fractional progress for offline calculations
        0
      );

      resource.resourceNodeYields.forEach(itemId => {
        hunterResources[itemId] = gatherResult.wholeAmount;
      });
      hunterExperience[resource.type] = gatherResult.wholeXP;
    }
  }

  // Process bud activities
  Object.entries(activityStore.budActivities).forEach(([budId, activity]) => {
    const resource = allResources.find(r => r.id === activity.nodeId);
    if (resource) {
      const gatherResult = calculateGathering(
        resource,
        deltaTime,
        0,
        0,
        1 // Default efficiency for offline progression
      );

      resource.resourceNodeYields.forEach(itemId => {
        budResources[itemId] = (budResources[itemId] || 0) + gatherResult.wholeAmount;
      });
      budExperience[budId] = gatherResult.wholeXP;
    }
  });

  return {
    hunterResources,
    budResources,
    hunterExperience,
    budExperience
  };
};

export const handleOfflineProgression = (
  setProgressionData: (data: OfflineProgressionResult) => void,
  setModalVisible: (visible: boolean) => void
) => {
  const lastSaveTime = useGameStore.getState().lastSaveTime;
  const currentTime = Date.now();
  const deltaTime = (currentTime - lastSaveTime) / 1000; // Convert to seconds

  const progressionData = calculateOfflineProgression(deltaTime);

  // Update Bank Store
  const bankStore = useBankStore.getState();
  Object.entries(progressionData.hunterResources).forEach(([itemId, amount]) => {
    bankStore.addItem(itemId, amount);
  });
  Object.entries(progressionData.budResources).forEach(([itemId, amount]) => {
    bankStore.addItem(itemId, amount);
  });

  // Update Hunter XP
  const hunterStore = useHunterStore.getState();
  Object.entries(progressionData.hunterExperience).forEach(([skillId, xp]) => {
    hunterStore.increaseHunterSkillExperience(skillId, xp);
  });

  // Update Bud XP
  const activeBudStore = useActiveBudStore.getState();
  Object.entries(progressionData.budExperience).forEach(([budId, xp]) => {
    activeBudStore.increaseBudSkillExperience(budId, xp);
  });

  setProgressionData(progressionData);
  setModalVisible(true);

  // Resume game
  useGameStore.getState().unpauseGame();
};