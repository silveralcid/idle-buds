import { useHunterStore } from '../stores/hunter.store';
import { useBankStore } from '../stores/bank.store';
import { defaultSkillMapping } from '../data/defaultSkillMapping';
import { GatheringCalculator } from './gathering-core.utils';
import { allResources } from '../data/allResources.data';

interface GatheringResult {
  resources: Record<string, number>;
  experience: Record<string, number>;
}

export const processGathering = (deltaTime: number): GatheringResult | null => {
  const hunterStore = useHunterStore.getState();
  const bankStore = useBankStore.getState();
  const activity = hunterStore.currentHunterActivity;

  if (!activity || activity.type !== 'gathering') {
    return null;
  }

  console.group('🎯 Processing Gathering');
  
  try {
    const resource = allResources.find(r => r.id === activity.nodeId);
    if (!resource) {
      console.warn('❌ Resource not found:', activity.nodeId);
      return null;
    }

    // Calculate gathering using the calculator
    const gatherResult = GatheringCalculator.calculate(
      resource,
      deltaTime,
      {
        resourceFraction: 0,
        experienceFraction: 0
      }
    );

    const result: GatheringResult = {
      resources: {},
      experience: {}
    };

    // Process resources
    resource.resourceNodeYields.forEach(itemId => {
      const amount = gatherResult.resources.amount;
      result.resources[itemId] = amount;
      bankStore.addItem(itemId, amount);
    });

    // Process experience
    const skillType = resource.type;
    const skillId = defaultSkillMapping[skillType];
    if (skillId) {
      result.experience[skillType] = gatherResult.experience.amount;
      hunterStore.increaseHunterSkillExperience(skillId, gatherResult.experience.amount);
    }

    console.debug('Gathering Results:', {
      nodeId: resource.id,
      resourcesGained: result.resources,
      experienceGained: result.experience,
      ticksProcessed: gatherResult.ticksProcessed
    });

    return result;

  } catch (error) {
    console.error('❌ Error processing gathering:', error);
    return null;
  } finally {
    console.groupEnd();
  }
};

export const canGather = (
  nodeId: string, 
  requiredLevel: number,
  requiredItems: string[]
): boolean => {
  const hunterStore = useHunterStore.getState();
  const bankStore = useBankStore.getState();

  // Check if already gathering
  if (hunterStore.currentHunterActivity?.type === 'gathering') {
    return false;
  }

  // Check skill requirements
  const resource = allResources.find(r => r.id === nodeId);
  if (resource) {
    const skillId = defaultSkillMapping[resource.type];
    const skillLevel = hunterStore.skills[skillId]?.level ?? 0;
    if (skillLevel < requiredLevel) {
      return false;
    }
  }

  // Check required items
  if (requiredItems.length > 0) {
    return requiredItems.every(itemId => 
      bankStore.getItemAmount(itemId) > 0
    );
  }

  return true;
};