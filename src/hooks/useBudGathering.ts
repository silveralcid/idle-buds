// src/hooks/useBudGathering.ts
import { useActiveBudStore } from '../stores/active-bud.store';
import { useHunterStore } from '../stores/hunter.store';

export const useBudGathering = (nodeId: string, isUnlocked: boolean) => {
  const budActivities = useActiveBudStore((state) => state.budActivities);
  const startBudActivity = useActiveBudStore((state) => state.startBudActivity);
  const stopBudActivity = useActiveBudStore((state) => state.stopBudActivity);
  const getBudActivity = useActiveBudStore((state) => state.getBudActivity);

  const startGathering = (budId: string) => {
    console.log('🟢 Starting gathering:', { budId, nodeId, isUnlocked });
    
    if (!isUnlocked || !budId) {
      console.log('❌ Cannot start gathering - unlocked or budId check failed');
      return false;
    }

    // Check if bud is already assigned to an activity
    const currentActivity = getBudActivity(budId);
    if (currentActivity) {
      console.warn('❌ Bud is already assigned to an activity', { budId });
      return false;
    }
    
    const success = startBudActivity(budId, 'gathering', nodeId);
    console.log('📍 startBudActivity result:', success);
    return success;
  };

  const stopGathering = (budId: string) => {
    console.log('🔴 Stopping gathering:', { budId, nodeId });
    stopBudActivity(budId);
    return true;
  };

  const isGathering = (budId: string) => 
    budActivities[budId]?.nodeId === nodeId && 
    budActivities[budId]?.type === 'gathering';

  return { startGathering, stopGathering, isGathering };
};