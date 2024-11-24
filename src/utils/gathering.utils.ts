import { useHunterStore } from '../stores/hunter.store';
import { defaultSkillMapping } from '../data/defaultSkillMapping';
import { calculateGathering } from './gathering-core.utils';
import { useBankStore } from '../stores/bank.store';
import { allResources } from '../data/allResources.data';

export const processGathering = (deltaTime: number): void => {
  console.groupCollapsed(`⚙️ Gathering Process (deltaTime: ${deltaTime})`);

  const hunterStore = useHunterStore.getState();
  const bankStore = useBankStore.getState();

  // Log initial state
  console.group('📊 Activities State');
  console.table({
    hunter: hunterStore.currentActivity,
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


  console.groupEnd();
};