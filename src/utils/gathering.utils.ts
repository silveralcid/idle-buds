import { useHunterStore } from '../stores/hunter.store';
import { defaultSkillMapping } from '../data/defaultSkillMapping';
import { useActivityStore } from '../stores/activity.store';
import { calculateGathering } from './gathering-core.utils';
import { useBankStore } from '../stores/bank.store';
import { allResources } from '../data/allResources.data';
import { useBudStore } from '../stores/bud.store';

export const processGathering = (deltaTime: number): void => {
  console.groupCollapsed(`⚙️ Gathering Process (deltaTime: ${deltaTime})`);

  const activityStore = useActivityStore.getState();
  const bankStore = useBankStore.getState();

  // Log initial state
  console.group('📊 Activities State');
  console.table({
    hunter: activityStore.hunterActivity,
    buds: activityStore.budActivities
  });
  console.groupEnd();

  // Process hunter activity
  if (activityStore.hunterActivity) {
    console.group('🎯 Hunter Gathering');
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

      console.debug('Hunter Results:', {
        resource: resource.id,
        gathered: gatherResult.wholeAmount,
        xp: gatherResult.wholeXP
      });

      resource.resourceNodeYields.forEach(itemId => {
        bankStore.addItem(itemId, gatherResult.wholeAmount);
      });

      const skillId = defaultSkillMapping[resource.type];
      useHunterStore.getState().increaseSkillExperience(skillId, gatherResult.wholeXP);
    }
    console.groupEnd();
  }

  // Process bud activities
  if (Object.keys(activityStore.budActivities).length > 0) {
    console.group('🌱 Bud Gathering');
    Object.entries(activityStore.budActivities).forEach(([budId, activity]) => {
      console.groupCollapsed(`Bud: ${budId}`);
      const resource = allResources.find(r => r.id === activity.nodeId);
      if (resource) {
        const fractionalProgress = activityStore.fractionalProgress[budId]?.items[resource.id] || 0;
        const fractionalXP = activityStore.fractionalProgress[budId]?.xp[resource.id] || 0;

        const gatherResult = calculateGathering(
          resource,
          deltaTime,
          fractionalProgress,
          fractionalXP,
          1
        );

        console.debug('Gathering Results:', {
          resource: resource.id,
          gathered: gatherResult.wholeAmount,
          xp: gatherResult.wholeXP
        });

        resource.resourceNodeYields.forEach(itemId => {
          bankStore.addItem(itemId, gatherResult.wholeAmount);
        });

        if (gatherResult.wholeXP > 0) {
          useBudStore.getState().gainExperience(budId, gatherResult.wholeXP);
        }
      }
      console.groupEnd();
    });
    console.groupEnd();
  }

  console.groupEnd();
};