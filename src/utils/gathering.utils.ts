import { useHunterStore } from '../stores/hunter.store';
import { defaultSkillMapping } from '../data/defaultSkillMapping';
import { useActivityStore } from '../stores/activity.store';
import { calculateGathering } from './gathering-core.utils';
import { useBankStore } from '../stores/bank.store';
import { allResources } from '../data/allResources.data';
import { useBudStore } from '../stores/bud.store';

export const processGathering = (deltaTime: number): void => {
  const activityStore = useActivityStore.getState();
  const bankStore = useBankStore.getState();
  
  // Process hunter activity
  if (activityStore.hunterActivity) {
    const resource = allResources.find(r => r.id === activityStore.hunterActivity?.nodeId);
    if (resource) {
      const fractionalProgress = activityStore.fractionalProgress['hunter']?.items[resource.id] || 0;
      const fractionalXP = activityStore.fractionalProgress['hunter']?.xp[resource.id] || 0;

      const gatherResult = calculateGathering(
        resource,
        deltaTime,
        fractionalProgress,
        fractionalXP
      );

      // Add resources to bank
      resource.resourceNodeYields.forEach(itemId => {
        bankStore.addItem(itemId, gatherResult.wholeAmount);
      });

      // Update hunter experience
      const skillId = defaultSkillMapping[resource.type];
      useHunterStore.getState().increaseSkillExperience(skillId, gatherResult.wholeXP);
    }
  }

  // Process bud activities
  Object.entries(activityStore.budActivities).forEach(([budId, activity]) => {
    const resource = allResources.find(r => r.id === activity.nodeId);
    if (resource) {
      const fractionalProgress = activityStore.fractionalProgress[budId]?.items[resource.id] || 0;
      const fractionalXP = activityStore.fractionalProgress[budId]?.xp[resource.id] || 0;

      const gatherResult = calculateGathering(
        resource,
        deltaTime,
        fractionalProgress,
        fractionalXP,
        1 // TODO: Add bud efficiency calculations here
      );

      // Add resources to bank
      resource.resourceNodeYields.forEach(itemId => {
        bankStore.addItem(itemId, gatherResult.wholeAmount);
      });

      // Update bud experience
      if (gatherResult.wholeXP > 0) {
        useBudStore.getState().gainExperience(budId, gatherResult.wholeXP);
      }
    }
  });
};