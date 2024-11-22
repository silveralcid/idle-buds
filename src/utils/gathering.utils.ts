import { useHunterStore } from '../stores/hunter.store';
import { defaultSkillMapping } from '../data/defaultSkillMapping';
import { useActiveBudStore } from '../stores/active-bud.store';
import { calculateGathering } from './gathering-core.utils';
import { useBankStore } from '../stores/bank.store';
import { allResources } from '../data/allResources.data';

export const processGathering = (deltaTime: number): void => {
  console.groupCollapsed(`⚙️ Gathering Process (deltaTime: ${deltaTime})`);

  const hunterStore = useHunterStore.getState();
  const activeBudStore = useActiveBudStore.getState();
  const bankStore = useBankStore.getState();

  // Log initial state
  console.group('📊 Activities State');
  console.table({
    hunter: hunterStore.currentActivity,
    buds: activeBudStore.budActivities,
  });
  console.groupEnd();

  // Process hunter activity
  if (hunterStore.currentActivity?.type === 'gathering') {
    console.group('🎯 Hunter Gathering');
    const resource = allResources.find(r => r.id === hunterStore.currentActivity?.nodeId);
    if (resource) {
      const fractionalProgress = hunterStore.currentActivity.fractionalProgress.items[resource.id] || 0;
      const fractionalXP = hunterStore.currentActivity.fractionalProgress.xp[resource.id] || 0;

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

      // Add gathered resources to bank
      resource.resourceNodeYields.forEach(itemId => {
        bankStore.addItem(itemId, gatherResult.wholeAmount);
      });

      // Update hunter skill experience
      const skillId = defaultSkillMapping[resource.type];
      hunterStore.increaseHunterSkillExperience(skillId, gatherResult.wholeXP);

      // Update progress
      hunterStore.updateHunterActivityProgress(deltaTime);
    }
    console.groupEnd();
  }

  // Process bud activities
  if (Object.keys(activeBudStore.budActivities).length > 0) {
    console.group('🌱 Bud Gathering');
    Object.entries(activeBudStore.budActivities).forEach(([budId, activity]) => {
      if (activity.type !== 'gathering') return;
      
      console.groupCollapsed(`Bud: ${budId}`);
      const resource = allResources.find(r => r.id === activity.nodeId);
      if (resource) {
        const fractionalProgress = activeBudStore.budProgress[budId]?.items[resource.id] || 0;
        const fractionalXP = activeBudStore.budProgress[budId]?.xp[resource.id] || 0;

        const gatherResult = calculateGathering(
          resource,
          deltaTime,
          fractionalProgress,
          fractionalXP,
          1 // Default efficiency multiplier
        );

        console.debug('Gathering Results:', {
          resource: resource.id,
          gathered: gatherResult.wholeAmount,
          xp: gatherResult.wholeXP
        });

        // Add gathered resources to bank
        resource.resourceNodeYields.forEach(itemId => {
          bankStore.addItem(itemId, gatherResult.wholeAmount);
        });

        // Update bud experience
        if (gatherResult.wholeXP > 0) {
          const bud = activeBudStore.getBudFromParty(budId);
          if (bud) {
            // Update bud experience through the store
            activeBudStore.updateBudProgress(deltaTime);
          }
        }
      }
      console.groupEnd();
    });
    console.groupEnd();
  }

  console.groupEnd();
};